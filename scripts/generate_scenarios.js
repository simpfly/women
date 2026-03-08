import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs/promises";
import path from "path";

// 从全局或 .env 里读取（因为这是脚本运行）
// 你可以在跑这个脚本前先 export GEMINI_API_KEY=xxx
const getApiKey = () => process.env.GEMINI_API_KEY;

const ScenarioSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      content: { type: Type.STRING },
      category: { type: Type.STRING },
      allergenName: { type: Type.STRING },
      allergenLevel: { type: Type.STRING },
      analysis: { type: Type.STRING },
      wittyComment: { type: Type.STRING },
    },
    required: [
      "id",
      "content",
      "category",
      "allergenName",
      "allergenLevel",
      "analysis",
      "wittyComment",
    ],
  },
};

const StorySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      age: { type: Type.STRING },
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            score: { type: Type.NUMBER },
            consequence: { type: Type.STRING },
          },
          required: ["text", "score", "consequence"],
        },
      },
    },
    required: ["id", "age", "title", "content", "options"],
  },
};

// 封装批量调用 Gemini 接口
async function generateBatch(mode, gender, count) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing GEMINI_API_KEY environment variable. Run: export GEMINI_API_KEY=xxx",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  let contents = "";
  let schema = mode === "story" ? StorySchema : ScenarioSchema;

  if (mode === "scenario") {
    const playerContext =
      gender === "female"
        ? "The player is FEMALE. Scenarios should reflect systemic biases women face in China."
        : "The player is MALE. Scenarios should reflect 'Toxic Masculinity', expectations of being a provider, or repression of emotions.";

    contents = `Generate ${count} distinct, realistic scenarios that appear in Chinese society containing gender bias.
            Language: MUST BE Simplified Chinese (简体中文).
            Target Audience: Chinese users.
            ${playerContext}
            Categories should be one of ['WORK', 'RELATIONSHIP', 'FAMILY', 'SOCIAL'].
            Ensure 'allergenLevel' is one of ['MILD', 'MODERATE', 'CRITICAL'].
            Output pure JSON array.`;
  } else if (mode === "story") {
    contents = `Generate a chronological 5-stage coming-of-age simulation for a ${gender === "female" ? "GIRL" : "BOY"} in China.
            Language: MUST BE Simplified Chinese (简体中文).
            Perspective: The player is the PARENT observing or guiding the child.
            Stages (Age keys must be exactly as written): 3岁 (Toddler), 7岁 (Primary), 12岁 (Middle), 16岁 (High School), 22岁 (Adult).
            Focus: Gender roles, societal expectations, and how the parent's choice shapes the child's view.
            
            IMPORTANT: For EACH scenario, provide exactly 3 distinct options with correct 'score' (number):
            - Score 0: Must be the option that enforces traditional gender stereotypes or dismisses the child's feelings. (Negative outcome)
            - Score 1: A neutral or compromising option.
            - Score 2: Must be the option that breaks stereotypes, empowers the child, or supports their individuality against bias. (Positive outcome)
            
            Output pure JSON array.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction:
          "You are an expert feminist sociologist specialized in Chinese gender dynamics.",
      },
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      return data.map((d, i) => ({
        ...d,
        // 添加特殊的 id 标志它是后来用脚本生成出来的
        id: `gen-${mode}-${gender}-${Date.now()}-${i}`,
        ...(mode === "story" && d.options
          ? {
              options: d.options.map((opt) => ({
                ...opt,
                score: Number(opt.score),
              })),
            }
          : {}),
      }));
    }
  } catch (error) {
    console.error("API Error generating mode:", mode, gender, error);
  }
  return [];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function start() {
  console.log("=== 开始批量生成静态题库 ===");

  // 生成数量配置
  const SCENARIOS_PER_GENDER = 50;
  const BATCH_SIZE = 5;

  // 我们将数据收集在这里
  const results = {
    female_scenarios: [],
    male_scenarios: [],
    // 剧情模式数据
    parenting_stories_female: [],
    parenting_stories_male: [],
  };

  // 1. 生成普通场景测试题 (Female & Male)
  for (const gender of ["female", "male"]) {
    console.log(`开始为 ${gender} 生成 ${SCENARIOS_PER_GENDER} 个测试场景...`);
    let currentCount = 0;

    while (currentCount < SCENARIOS_PER_GENDER) {
      console.log(`  -> Batch: ${currentCount}/${SCENARIOS_PER_GENDER}`);
      const batch = await generateBatch("scenario", gender, BATCH_SIZE);
      if (batch && batch.length > 0) {
        if (gender === "female") results.female_scenarios.push(...batch);
        else results.male_scenarios.push(...batch);
        currentCount += batch.length;
      }
      // 每次请求后至少暂停 3 秒，避免 429 Rate Limit
      await sleep(3000);
    }
  }

  // 2. 生成养育路线的剧情故事 (Female & Male)
  // 剧情模式由于每次调用会返回5个阶段（3,7,12,16,22岁），相当于一次产生一条完整的养育线。
  // 我们为每个性别预置 10 条独立的养育线即可保证极高的重玩价值。
  for (const childGender of ["female", "male"]) {
    console.log(`为 ${childGender} 小孩生成 10 条养育成长故事线...`);
    for (let i = 0; i < 10; i++) {
      console.log(`  -> Story Track ${i + 1}/10`);
      const storyEvents = await generateBatch("story", childGender, 5);
      if (storyEvents && storyEvents.length > 0) {
        if (childGender === "female")
          results.parenting_stories_female.push(storyEvents);
        else results.parenting_stories_male.push(storyEvents);
      }
      await sleep(3000);
    }
  }

  // 3. 写入文件
  // 在较新的 Node ESM 环境下 import.meta.dirname 可以直接使用，或者用 URL
  const __dirname = new URL(".", import.meta.url).pathname;
  const outPath = path.resolve(__dirname, "../data/generated_pool.json");

  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`=== 生成完毕! 共计写入题库至 ${outPath} ===`);
}

start();
