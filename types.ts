
export enum AllergenLevel {
  NONE = '无过敏',
  MILD = '轻度不适',
  SEVERE = '重度过敏',
  TOXIC = '剧毒危害'
}

export enum Category {
  WORKPLACE = '职场',
  RELATIONSHIP = '亲密关系',
  FAMILY = '家庭',
  SOCIAL = '社会舆论',
  PUBLIC = '公共空间',
  PARENTING = '养育系统'
}

export type UserGender = 'female' | 'male';

export interface Scenario {
  id: string;
  content: string; 
  category: Category;
  allergenName: string;
  allergenLevel: AllergenLevel;
  analysis: string; 
  wittyComment: string;
}

// --- Story Mode Types ---
export interface StoryOption {
  text: string;
  score: number; // 0 = Stereotypical, 1 = Neutral, 2 = Empowering
  consequence: string; // Immediate feedback
}

export interface StoryEvent {
  id: string;
  age: string; // e.g. "Age 3", "Age 12"
  title: string;
  content: string;
  options: StoryOption[];
}

export interface ChildArchetype {
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
}

// --- Dictionary Types ---
export type TermCategory = 'ACADEMIC' | 'INTERNET';

export interface Term {
  id: string;
  term: string;
  english: string;
  definition: string;
  example: string;
  relatedTermIds?: string[];
  category: TermCategory;
}

// --- Her Story Types ---
export interface UserStory {
    id: string;
    content: string;
    tags: string[];
    supportCount: number;
    timestamp: number;
    isOfficial?: boolean;
}

// --- Empowerment Resource Types (New) ---
export type EmpowermentType = 'MODEL' | 'FACT' | 'POLICY' | 'COMMUNITY';

export interface EmpowermentItem {
  id: string;
  type: EmpowermentType;
  title: string;
  subtitle?: string; // e.g. "Scientist", "Did you know?"
  content: string;
  tag?: string;
}

// -----------------------------

export interface Book {
  id: string;
  title: string;
  author: string;
  intro: string;
  quote: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  gender: UserGender;
  threshold: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  joinDate: number;
  totalTests: number;
  totalScoreAccumulated: number;
  highestScore: number;
  unlockedBookIds: string[];
  earnedTitles: string[];
  playedScenarioIds: string[]; // Track played scenarios to avoid repetition
  encounteredAllergens: string[]; // List of allergen names user confirmed experiencing in real life
}

export interface GameState {
  // Added 'her-story' status
  status: 'intro' | 'profile' | 'scenario-select' | 'loading' | 'playing' | 'result' | 'bookshelf' | 'dictionary' | 'her-story' | 'error' | 'story-intro' | 'story-playing' | 'story-result';
  userGender: UserGender | null;
  selectedCategory: Category | 'RANDOM';
  scenarios: Scenario[];
  
  // Story Mode Specifics
  storyEvents: StoryEvent[];
  childGender: UserGender | null;
  
  currentIndex: number;
  score: number;
  detectedAllergens: string[];
  newlyUnlockedBookId?: string | null;
  currentTitle?: string | null;

  // App Mode for Parenting Lab separation
  appMode?: 'standard' | 'parenting';
}
