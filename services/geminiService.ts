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
    // 纯静态化：当前阶段我们将所有动态的剧情直接降级为预置的 FALLBACK_STORY。
    // 如果想要更多样性，可以在这里从 data/stories.ts 里随机抽取一个子树
    return new Promise(resolve => setTimeout(() => resolve(FALLBACK_STORY), 800));
}