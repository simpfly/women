import { Scenario, Category, UserGender, StoryEvent } from "../types";
import { 
    STATIC_SCENARIOS_FEMALE, 
    STATIC_SCENARIOS_MALE, 
    STATIC_PARENTING_SCENARIOS,
    PARENTING_STORY_FEMALE,
    PARENTING_STORY_MALE
} from "../data/scenarios";

const STORY_STAGES = [
    { age: "3岁", title: "早期认同" },
    { age: "6岁", title: "规则学习" },
    { age: "9岁", title: "学校分工" },
    { age: "13岁", title: "青春期边界" },
    { age: "17岁", title: "未来想象" }
] as const;

const buildStoryFromScenarios = (gender: UserGender): StoryEvent[] => {
    // 严格区分男孩与女孩专属的成长历程故事池，彻底解决题目错位与倒置
    const storyPool = gender === 'male' ? PARENTING_STORY_MALE : PARENTING_STORY_FEMALE;

    return STORY_STAGES.map((stage) => {
        const stageEvents = storyPool[stage.age] || [];
        if (stageEvents.length === 0) {
            throw new Error(`未找到阶段 ${stage.age} 的养育故事数据`);
        }
        // 随机从该成长阶段选取一个贴合真实社会规训的情境
        const randomIndex = Math.floor(Math.random() * stageEvents.length);
        const selected = stageEvents[randomIndex];

        return {
            ...selected,
            id: `story-${gender}-${selected.id}`
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
