import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Scenario, Category, AllergenLevel, UserGender, StoryEvent } from "../types";
import { STATIC_SCENARIOS_FEMALE, STATIC_SCENARIOS_MALE, STATIC_PARENTING_SCENARIOS } from "../data/scenarios";

// --- BUFFERING SYSTEM ---
// Keep a buffer of scenarios ready to serve immediately
let scenarioBuffer: Scenario[] = [];
let bufferGender: UserGender | null = null;
let isFetching = false;

// Fallback data for story mode
const FALLBACK_STORY: StoryEvent[] = [
    {
        id: "s1",
        age: "3岁",
        title: "玩具的选择",
        content: "亲戚送给孩子一套粉红色的过家家厨房玩具，但孩子盯着商场里的机械挖掘机不肯走。",
        options: [
            { text: "劝说：那个太沉了不好拿，而且容易弄脏裙子，粉色的厨房多可爱呀。", score: 0, consequence: "孩子学会了玩具是有性别的，并开始在意'得体'。" },
            { text: "折中：既然喜欢就都买回家试试看吧。", score: 1, consequence: "孩子得到了满足，但仍对亲戚的态度感到困惑。" },
            { text: "支持：立刻买下挖掘机，告诉她没有什么玩具是女孩不能玩的。", score: 2, consequence: "孩子建立了一种自信：喜好不受性别限制。" }
        ]
    },
    {
        id: "s2",
        age: "7岁",
        title: "班干部的竞选",
        content: "老师让男生去搬新书，让女生负责擦桌子。孩子问你为什么。",
        options: [
            { text: "解释：男生天生力气大就该多干活，女孩子要被照顾，擦桌子多轻松。", score: 0, consequence: "孩子接受了'弱者红利'，同时也默认了能力的上限。" },
            { text: "回避：老师这么安排肯定有道理，照做就是了。", score: 0, consequence: "教会了顺从权威，而非思考不公。" },
            { text: "引导：鼓励孩子去问老师‘我可以去搬书吗？’", score: 2, consequence: "孩子学会了挑战不合理的性别分工。" }
        ]
    }
];

const getApiKey = () => process.env.API_KEY;

// Helper to get random scenarios from static bank
// CHANGED: Default count reduced to 5
const getRandomStaticScenarios = (gender: UserGender, category: Category | 'RANDOM', playedIds: string[] = [], count: number = 5): Scenario[] => {
    let pool: Scenario[] = [];
    
    // Select the correct base pool based on gender
    const basePool = gender === 'male' ? STATIC_SCENARIOS_MALE : STATIC_SCENARIOS_FEMALE;
    
    if (category === Category.PARENTING) {
        pool = STATIC_PARENTING_SCENARIOS;
    } else if (category === 'RANDOM') {
        pool = [...basePool, ...STATIC_PARENTING_SCENARIOS];
    } else {
        pool = basePool.filter(s => s.category === category);
    }
    
    // STRICT FILTERING: Only return unplayed scenarios
    // We do NOT recycle questions anymore for specific categories to allow "Completion"
    const unplayedPool = pool.filter(s => !playedIds.includes(s.id));
    
    // If no unplayed scenarios remain:
    if (unplayedPool.length === 0) {
        return []; // Return empty to signal completion
    }

    // Shuffle and return limited amount
    const shuffled = [...unplayedPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// --- NEW PRELOAD FUNCTION ---
// Call this when the app loads to fill the buffer in the background
export const preloadScenarios = async (gender: UserGender = 'female') => {
    // Prevent refetching if already fetching OR if buffer is populated with correct gender
    if (isFetching || (scenarioBuffer.length > 0 && bufferGender === gender)) return;
    
    console.log("Starting background preload for", gender);
    isFetching = true;
    
    // If we are switching gender context, clear previous buffer implicitly by overwriting later,
    // but good practice to clear intent now.
    if (bufferGender !== gender) {
        scenarioBuffer = [];
    }
    bufferGender = gender;

    try {
        const scenarios = await fetchAiScenarios(gender, 'RANDOM');
        if (scenarios.length > 0) {
            scenarioBuffer = scenarios;
            console.log("Buffer filled with", scenarios.length, "scenarios.");
        }
    } catch (e) {
        console.warn("Preload failed silently", e);
    } finally {
        isFetching = false;
    }
};

// Internal function to actually call API
const fetchAiScenarios = async (gender: UserGender, category: Category | 'RANDOM'): Promise<Scenario[]> => {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    
    const schema: Schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING, enum: Object.values(Category) },
            allergenName: { type: Type.STRING },
            allergenLevel: { type: Type.STRING, enum: Object.values(AllergenLevel) },
            analysis: { type: Type.STRING },
            wittyComment: { type: Type.STRING }
          },
          required: ["id", "content", "category", "allergenName", "allergenLevel", "analysis", "wittyComment"]
        }
    };

    // CONTEXT REFINEMENT: Ensure distinct separation of concerns
    const playerContext = gender === 'female' 
    ? "The player is FEMALE. Scenarios should reflect systemic biases women face in China."
    : "The player is MALE. Scenarios should reflect 'Toxic Masculinity', expectations of being a provider, or repression of emotions.";

    let categoryPrompt = "";
    if (category === Category.PARENTING) {
        // STRICT CHILD-CENTRIC PROMPT
        categoryPrompt = `CRITICAL: ALL scenarios must strictly focus on the CHILD's experience of gender socialization, or the parent observing gender bias affecting the CHILD.
        - Examples: Gendered toys (blue for boys/pink for girls), teachers treating genders differently, relatives commenting on child's personality based on gender.
        - The player's role is the PARENT witnessing these events.
        - DO NOT generate scenarios about the parent's own workplace issues or marriage issues unless it directly impacts the child's gender perception.`;
    } else if (category && category !== 'RANDOM') {
        categoryPrompt = `ALL scenarios must be strictly within the '${category}' context.`;
    } else {
        categoryPrompt = "Categories should vary among Workplace, Relationship, Family, Social.";
    }

    try {
        // GENERATE 5 QUESTIONS PER BATCH
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 distinct, realistic scenarios that appear in Chinese society containing gender bias.
            Language: MUST BE Simplified Chinese (简体中文).
            Target Audience: Chinese users.
            ${playerContext}
            ${categoryPrompt}
            Output pure JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                systemInstruction: "You are an expert feminist sociologist specialized in Chinese gender dynamics."
            }
        });
        
        const text = response.text;
        if (text) {
            const data = JSON.parse(text) as Scenario[];
            return data.map((d, i) => ({ ...d, id: `gen-${Date.now()}-${i}` }));
        }
        return [];
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return [];
    }
}

export const generateScenarios = async (gender: UserGender, category: Category | 'RANDOM' = 'RANDOM', playedIds: string[] = []): Promise<Scenario[]> => {
  // STRATEGY: SPEED FIRST
  if (category === 'RANDOM' && scenarioBuffer.length > 0 && bufferGender === gender) {
      const data = [...scenarioBuffer];
      scenarioBuffer = []; // Clear buffer
      bufferGender = null;
      preloadScenarios(gender); 
      return new Promise(resolve => setTimeout(() => resolve(data), 3000));
  }
  
  if (category === 'RANDOM' && bufferGender !== gender) {
      scenarioBuffer = [];
      bufferGender = null;
  }

  const staticData = getRandomStaticScenarios(gender, category, playedIds, 5);
  
  if (staticData.length === 0) {
      if (category !== 'RANDOM') {
          return []; // Signal completion
      } else {
          const aiData = await fetchAiScenarios(gender, 'RANDOM');
          return aiData;
      }
  }

  if (!isFetching && category === 'RANDOM') {
      preloadScenarios(gender);
  }

  return new Promise(resolve => setTimeout(() => resolve(staticData), 3000));
};

export const generateParentingStory = async (childGender: UserGender): Promise<StoryEvent[]> => {
    const apiKey = getApiKey();
    if (!apiKey) return new Promise(resolve => setTimeout(() => resolve(FALLBACK_STORY), 3000));

    const ai = new GoogleGenAI({ apiKey });

    const schema: Schema = {
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
                            consequence: { type: Type.STRING }
                        },
                        required: ["text", "score", "consequence"]
                    }
                }
            },
            required: ["id", "age", "title", "content", "options"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a chronological 5-stage coming-of-age simulation for a ${childGender === 'female' ? 'GIRL' : 'BOY'} in China.
            Language: MUST BE Simplified Chinese (简体中文).
            Perspective: The player is the PARENT observing or guiding the child.
            Stages (Age keys must be exactly as written): 3岁 (Toddler), 7岁 (Primary), 12岁 (Middle), 16岁 (High School), 22岁 (Adult).
            Focus: Gender roles, societal expectations, and how the parent's choice shapes the child's view.
            
            IMPORTANT: For EACH scenario, provide 3 distinct options with correct 'score':
            - Score 0: Must be the option that enforces traditional gender stereotypes or dismisses the child's feelings. (Negative outcome)
            - Score 1: A neutral or compromising option.
            - Score 2: Must be the option that breaks stereotypes, empowers the child, or supports their individuality against bias. (Positive outcome)
            
            Output pure JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                systemInstruction: "You are a parenting simulation engine. You MUST ensure the 'score' property matches the sentiment of the option text. Score 2 is ALWAYS the feminist/empowering choice."
            }
        });

        const text = response.text;
        if (text) {
            const data = JSON.parse(text) as StoryEvent[];
            // Post-processing to ensure scores are numbers and IDs are unique
            return data.map((d, i) => ({ 
                ...d, 
                id: `story-${Date.now()}-${i}`,
                options: d.options.map(opt => ({
                    ...opt,
                    score: Number(opt.score) // Explicitly cast to number to prevent type issues
                }))
            }));
        }
        return FALLBACK_STORY;
    } catch (error) {
        console.error("Story API Error:", error);
        return FALLBACK_STORY;
    }
}