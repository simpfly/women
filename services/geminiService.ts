import { Scenario, Category, UserGender, StoryEvent } from "../types";
import { STATIC_SCENARIOS_FEMALE, STATIC_SCENARIOS_MALE, STATIC_PARENTING_SCENARIOS } from "../data/scenarios";

const STORY_STAGES = [
    { age: "3岁", title: "早期认同" },
    { age: "6岁", title: "规则学习" },
    { age: "9岁", title: "学校分工" },
    { age: "13岁", title: "青春期边界" },
    { age: "17岁", title: "未来想象" }
] as const;

const CHILD_COPY = {
    female: {
        child: "女儿",
        pronoun: "她",
        pronounObj: "她",
        role: "女孩"
    },
    male: {
        child: "儿子",
        pronoun: "他",
        pronounObj: "他",
        role: "男孩"
    }
} as const;

const rewriteStoryText = (text: string, gender: UserGender) => {
    const copy = CHILD_COPY[gender];
    return text
        .replace(/女儿/g, copy.child)
        .replace(/儿子/g, copy.child)
        .replace(/女孩/g, copy.role)
        .replace(/男孩/g, copy.role)
        .replace(/她/g, copy.pronoun)
        .replace(/他/g, copy.pronoun);
};

const rewriteConsequence = (text: string | undefined, gender: UserGender) => {
    if (!text) return undefined;
    const copy = CHILD_COPY[gender];
    return text
        .replace(/孩子/g, copy.child)
        .replace(/她/g, copy.pronoun)
        .replace(/他/g, copy.pronoun);
};

const buildStoryFromScenarios = (gender: UserGender): StoryEvent[] => {
    const shuffled = [...STATIC_PARENTING_SCENARIOS].sort(() => 0.5 - Math.random()).slice(0, STORY_STAGES.length);

    return shuffled.map((scenario, index) => {
        const stage = STORY_STAGES[index];
        return {
            id: `story-${gender}-${scenario.id}`,
            age: stage.age,
            title: `${stage.title} · ${scenario.allergenName}`,
            content: rewriteStoryText(scenario.content, gender),
            options: (scenario.options || []).map((option) => ({
                ...option,
                text: rewriteStoryText(option.text, gender),
                consequence: rewriteConsequence(
                    option.consequence ||
                    (option.score === 2
                        ? `${CHILD_COPY[gender].child}记住了边界、能力与尊严可以同时成立。`
                        : option.score === 1
                        ? `${CHILD_COPY[gender].child}感受到你的犹豫，也学会了在模糊地带里自我揣测。`
                        : `${CHILD_COPY[gender].child}把这条性别规则默默收进了成长脚本。`),
                    gender
                )
            }))
        };
    });
};

// 完全移除大模型API_KEY读取

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

// 静态模式下不再需要动态生成题目
// preLoad 也不再需要工作
export const preloadScenarios = async (gender: UserGender = 'female') => {
    // 静态模式，瞬发，无需缓冲
};

export const generateScenarios = async (gender: UserGender, category: Category | 'RANDOM' = 'RANDOM', playedIds: string[] = []): Promise<Scenario[]> => {
  // 纯静态化策略：所有题目直接从静态数据池拉取
  const staticData = getRandomStaticScenarios(gender, category, playedIds, 5);
  
  if (staticData.length === 0) {
      // 题库耗尽，直接返回空信号完成
      return []; 
  }

  // 模拟稍微真实的加载感，但不再需要等大模型
  return new Promise(resolve => setTimeout(() => resolve(staticData), 500));
};

export const generateParentingStory = async (childGender: UserGender): Promise<StoryEvent[]> => {
    const story = buildStoryFromScenarios(childGender);
    return new Promise(resolve => setTimeout(() => resolve(story), 500));
}
