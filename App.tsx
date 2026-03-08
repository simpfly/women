import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, UserGender, AllergenLevel, Book, Category, PlayerProfile, Achievement, ChildArchetype, Term, UserStory, EmpowermentType, TermCategory, Scenario } from './types';
import { generateScenarios, generateParentingStory, preloadScenarios } from './services/geminiService'; 
import { db } from './services/db';
import Toast from './components/Toast';
import { Microscope, RotateCcw, Activity, User, ArrowRight, Quote, BookOpen, Library, X, Lock, Fingerprint, PenLine, Award, Baby, BookA, Heart, MessageSquareHeart, Globe, Zap, Star, ShieldCheck, Users, Trophy, Clipboard, Briefcase, Home, MessageCircle, Sparkles, Info, Check } from 'lucide-react';
import { soundManager } from './utils/sound';

// Import Static Data
import { FEMINIST_LIBRARY } from './data/library';
import { FEMINIST_DICTIONARY } from './data/dictionary';
import { EMPOWERMENT_DATA } from './data/empowerment';

// --- ACHIEVEMENTS / TITLES ---
const ACHIEVEMENTS: Achievement[] = [
    // Score based
    { id: 'f_high', gender: 'female', threshold: 80, title: "鹰眼观察者", description: "你的过敏雷达极其灵敏，任何细微的父权制尘埃都逃不过你的眼睛。" },
    { id: 'f_mid', gender: 'female', threshold: 50, title: "觉醒中", description: "你能识别大部分明显的偏见，但在某些隐蔽的场景下可能还会犹豫。" },
    { id: 'f_low', gender: 'female', threshold: 0, title: "低敏感度", description: "你可能对环境有着极强的耐受力。多了解一下‘过敏源’能帮你更好地保护自己。" },
    { id: 'm_high', gender: 'male', threshold: 80, title: "珍贵的共情者", description: "你敏锐地读懂了那些常被忽略的微小刺痛。你的清醒是弥合裂痕的桥梁。" },
    { id: 'm_mid', gender: 'male', threshold: 50, title: "探索中的观察者", description: "你已经迈出了重要的一步。但在某些微妙的语境下，既得利益者的盲区可能仍会遮蔽视线。" },
    { id: 'm_low', gender: 'male', threshold: 0, title: "沉睡的潜能", description: "生活对你足够宽容，让你难以体察那些隐形的'过敏'反应。试着放下预设，去听听另一半人口的声音。" },
    
    // Category Completion Badges (Threshold > 100 usually means manually assigned)
    { id: 'c_work', gender: 'female', threshold: 999, title: "职场人类学家", description: "你已完成所有职场场景筛查。" },
    { id: 'c_rel', gender: 'female', threshold: 999, title: "亲密关系诊断师", description: "你已完成所有亲密关系场景筛查。" },
    { id: 'c_fam', gender: 'female', threshold: 999, title: "家庭结构分析员", description: "你已完成所有家庭场景筛查。" },
    { id: 'c_soc', gender: 'female', threshold: 999, title: "社会观察家", description: "你已完成所有社会舆论场景筛查。" },
    { id: 'c_par', gender: 'female', threshold: 999, title: "养育系统架构师", description: "你已完成所有养育系统筛查。" },
    
    // Male equivalents
    { id: 'c_m_work', gender: 'male', threshold: 999, title: "职场生态观察员", description: "你已完成所有男性职场场景筛查。" },
    { id: 'c_m_rel', gender: 'male', threshold: 999, title: "亲密关系思考者", description: "你已完成所有男性亲密关系场景筛查。" },
    { id: 'c_m_fam', gender: 'male', threshold: 999, title: "家庭角色破壁者", description: "你已完成所有男性家庭场景筛查。" },
    { id: 'c_m_soc', gender: 'male', threshold: 999, title: "社会规训反抗者", description: "你已完成所有男性社会舆论场景筛查。" },
    { id: 'c_m_par', gender: 'male', threshold: 999, title: "养育系统架构师", description: "你已完成所有养育系统筛查。" }
];

const FEMINIST_QUOTES = [
  { text: "女人不是天生的，而是后天形成的。", author: "西蒙娜·德·波伏娃" },
  { text: "女性主义绝不是弱者试图变为强者的思想。女性主义是追求弱者也能得到尊重的思想。", author: "上野千鹤子" },
  { text: "个人的即是政治的。", author: "卡罗尔·哈尼什" },
  { text: "我不想控制男人，我只想控制我自己。", author: "玛丽·沃斯通克拉夫特" },
  { text: "不仅仅是某种性别，我们首先是人。", author: "奇玛曼达·恩戈兹·阿迪奇" },
  { text: "父权制的核心不仅是男性对女性的支配，更是男性之间通过支配女性来确认彼此的联结。", author: "上野千鹤子" },
  { text: "我们拼命划桨，渴望逆流而上，却不断被推回过去。", author: "《始于极限》" },
  { text: "忍耐不是美德，把忍耐当成美德是这个伪善的世界维持它扭曲秩序的方式。", author: "林奕含" }
];

const STORY_TAG_OPTIONS = ['职场', '家庭', '关系', '公共空间', '成长时刻'] as const;
const MAX_STORY_LENGTH = 280;
const ScenarioCard = lazy(() => import('./components/ScenarioCard'));
const AnalysisModal = lazy(() => import('./components/AnalysisModal'));
const ReportModal = lazy(() => import('./components/ReportModal'));

const modalFallback = (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white border-2 border-[#5b21b6] px-6 py-4 shadow-[8px_8px_0px_0px_rgba(91,33,182,0.35)] text-sm font-bold text-[#5b21b6]">
      正在载入模块...
    </div>
  </div>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'intro',
    userGender: null,
    selectedCategory: 'RANDOM',
    scenarios: [],
    storyEvents: [], // Story Mode
    childGender: null, // Story Mode
    currentIndex: 0,
    score: 0,
    detectedAllergens: [],
    newlyUnlockedBookId: null,
    currentTitle: null,
    appMode: 'standard'
  });

  // Player Profile State
  const [profile, setProfile] = useState<PlayerProfile>({
    id: 'guest',
    name: 'Observer',
    joinDate: Date.now(),
    totalTests: 0,
    totalScoreAccumulated: 0,
    highestScore: 0,
    unlockedBookIds: [],
    earnedTitles: [],
    playedScenarioIds: [], // Initialize new field
    encounteredAllergens: [] // Initialize new field
  });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [lastUserChoice, setLastUserChoice] = useState(0); 
  const [storyFeedback, setStoryFeedback] = useState<{consequence: string, score: number} | undefined>(undefined);
  const [categoryCompleted, setCategoryCompleted] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null); // State for Toast
  const [showTutorial, setShowTutorial] = useState(false); // State for Tutorial
  
  // Randomize initial quote index to avoid repetition on short loads
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * FEMINIST_QUOTES.length));
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [dictionaryTab, setDictionaryTab] = useState<TermCategory>('ACADEMIC');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [herStoryTab, setHerStoryTab] = useState<'EMPOWERMENT' | 'COMMUNITY'>('EMPOWERMENT');
  
  // New States for Features
  const [visitorCount, setVisitorCount] = useState(0);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [empowermentFilter, setEmpowermentFilter] = useState<EmpowermentType | 'ALL'>('ALL');
  const [storyDraft, setStoryDraft] = useState('');
  const [selectedStoryTags, setSelectedStoryTags] = useState<string[]>([]);
  const [communityFeedback, setCommunityFeedback] = useState<string | null>(null);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [supportedStoryIds, setSupportedStoryIds] = useState<string[]>([]);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Load Profile (Async from DB)
    const initData = async () => {
        const loadedProfile = await db.loadProfile(null); // Load current user
        if (loadedProfile) {
            // BACKFILL SAFETY: Ensure new fields exist for legacy data
            setProfile({
                ...loadedProfile,
                playedScenarioIds: loadedProfile.playedScenarioIds || [],
                encounteredAllergens: loadedProfile.encounteredAllergens || []
            });
        } else {
             // Create new if strictly not found (though loadProfile handles creation logic usually)
             // Keeping the logic simple here as db handles fallbacks
             const newProfile: PlayerProfile = {
                id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
                name: `Subject-${Math.floor(1000 + Math.random() * 9000)}`,
                joinDate: Date.now(),
                totalTests: 0,
                totalScoreAccumulated: 0,
                highestScore: 0,
                unlockedBookIds: [],
                earnedTitles: [],
                playedScenarioIds: [],
                encounteredAllergens: []
            };
            setProfile(newProfile);
            db.saveProfile(newProfile);
        }

        // 2. Load Stories
        const loadedStories = await db.getStories();
        setStories(loadedStories);
        setSupportedStoryIds(db.getSupportedStoryIds());

        // 3. Load Stats
        const stats = await db.getGlobalStats();
        if (stats) {
            setVisitorCount(stats.totalUsers);
        } else {
            // Fallback simulation
            const baseCount = 128450; 
            setVisitorCount(baseCount + Math.floor(Date.now() / 600000));
        }

        // 4. Preload Scenarios (Buffer AI questions)
        preloadScenarios('female'); // Default to female context preloading
    };
    initData();
  }, []);

  // Save Profile when it changes
  useEffect(() => {
    if (profile.id !== 'guest') {
        db.saveProfile(profile);
    }
  }, [profile]);

  // Cycle quotes during loading
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState.status === 'loading') {
      // If we are loading, we can cycle. But initial render is random now.
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % FEMINIST_QUOTES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameState.status]);

  useEffect(() => {
    const shouldLockScroll = showTutorial || showReportModal || showAnalysis;
    const previousOverflow = document.body.style.overflow;
    if (shouldLockScroll) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showTutorial, showReportModal, showAnalysis]);

  useEffect(() => {
    if (!statusNotice) return;
    const timer = window.setTimeout(() => setStatusNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [statusNotice]);

  const resetTransientUi = () => {
    setShowAnalysis(false);
    setShowReportModal(false);
    setShowTutorial(false);
    setStoryFeedback(undefined);
    setSelectedBook(null);
    setSelectedTerm(null);
    setStatusNotice(null);
  };

  const updateProfileName = () => {
      if (tempName.trim()) {
          setProfile(prev => ({ ...prev, name: tempName.trim() }));
      }
      setIsEditingName(false);
  };

  const handleSupportStory = async (id: string) => {
      if (supportedStoryIds.includes(id)) return;
      soundManager.playClick();
      setSupportedStoryIds(prev => [...prev, id]);
      db.markStorySupported(id);
      // Optimistic Update
      setStories(prev => prev.map(s => {
          if (s.id === id) {
              return { ...s, supportCount: s.supportCount + 1 };
          }
          return s;
      }));
      // Async DB call
      await db.supportStory(id);
  };

  const handleToggleStoryTag = (tag: string) => {
      setSelectedStoryTags(prev => (
          prev.includes(tag) ? prev.filter(item => item !== tag) : [...prev, tag].slice(0, 3)
      ));
  };

  const handleSubmitStory = async () => {
      const content = storyDraft.trim();
      if (!content) {
          setCommunityFeedback('先写下一段经历，再投递。');
          soundManager.playMiss();
          return;
      }

      if (content.length < 12) {
          setCommunityFeedback('内容至少写 12 个字，方便其他人理解你的经历。');
          soundManager.playMiss();
          return;
      }

      setIsSubmittingStory(true);
      setCommunityFeedback(null);
      soundManager.playClick();

      const story: UserStory = {
          id: `story-${Date.now()}`,
          content,
          tags: selectedStoryTags.length > 0 ? selectedStoryTags : ['共鸣'],
          supportCount: 0,
          timestamp: Date.now()
      };

      try {
          await db.addStory(story);
          setStories(prev => [story, ...prev]);
          setStoryDraft('');
          setSelectedStoryTags([]);
          setCommunityFeedback('已投递到共鸣广场。');
          soundManager.playSuccess();
      } catch (error) {
          console.error('Failed to submit story', error);
          setCommunityFeedback('投递失败，请稍后重试。');
          soundManager.playMiss();
      } finally {
          setIsSubmittingStory(false);
      }
  };

  const handleGenderSelect = (gender: UserGender) => {
    soundManager.playClick();
    if (profile.totalTests > 0) {
      setGameState(prev => ({ ...prev, status: 'scenario-select', userGender: gender, appMode: 'standard' }));
    } else {
      // New users go directly to random standard questions
      startGame(gender, 'RANDOM');
    }
  };

  const handleEncounterAllergen = (allergenName: string) => {
      setProfile(prev => {
          if (prev.encounteredAllergens.includes(allergenName)) return prev;
          return {
              ...prev,
              encounteredAllergens: [...prev.encounteredAllergens, allergenName]
          };
      });
      soundManager.playClick();
  };

  // Main Game Start
  const startGame = async (gender: UserGender, category: Category | 'RANDOM') => {
    soundManager.playStart();
    setGameState(prev => ({ ...prev, status: 'loading', userGender: gender, selectedCategory: category }));
    setCategoryCompleted(false);
    // Pick a new random quote for this loading session
    setQuoteIndex(Math.floor(Math.random() * FEMINIST_QUOTES.length));
    
    try {
      // Pass playedScenarioIds to filtering
      const scenarios = await generateScenarios(gender, category, profile.playedScenarioIds);
      
      if (scenarios.length === 0) {
          // CATEGORY COMPLETED LOGIC
          handleCategoryCompletion(category, gender);
          return;
      }

      setGameState(prev => ({
        ...prev,
        status: 'playing',
        scenarios,
        currentIndex: 0,
        score: 0,
        detectedAllergens: [],
        newlyUnlockedBookId: null,
        currentTitle: null
      }));
    } catch (e) {
      console.error(e);
      setGameState(prev => ({ ...prev, status: 'error' }));
    }
  };

  const handleCategoryCompletion = (category: Category | 'RANDOM', gender: UserGender) => {
    soundManager.playSuccess();
    setCategoryCompleted(true);
    
    // Determine badge based on category and gender
    let badgeTitle = "";
    if (gender === 'female') {
        if (category === Category.WORKPLACE) badgeTitle = "职场人类学家";
        else if (category === Category.RELATIONSHIP) badgeTitle = "亲密关系诊断师";
        else if (category === Category.FAMILY) badgeTitle = "家庭结构分析员";
        else if (category === Category.SOCIAL) badgeTitle = "社会观察家";
        else if (category === Category.PARENTING) badgeTitle = "养育系统架构师";
    } else {
        if (category === Category.WORKPLACE) badgeTitle = "职场生态观察员";
        else if (category === Category.RELATIONSHIP) badgeTitle = "亲密关系思考者";
        else if (category === Category.FAMILY) badgeTitle = "家庭角色破壁者";
        else if (category === Category.SOCIAL) badgeTitle = "社会规训反抗者";
        else if (category === Category.PARENTING) badgeTitle = "养育系统架构师";
    }

    if (badgeTitle) {
         // Check if this is a new title for Toast notification
         if (!profile.earnedTitles.includes(badgeTitle)) {
             setActiveToast(badgeTitle);
         }

         setProfile(prev => {
             const newTitles = new Set(prev.earnedTitles);
             newTitles.add(badgeTitle);
             return { ...prev, earnedTitles: Array.from(newTitles) };
         });
         setGameState(prev => ({
             ...prev,
             status: 'result',
             userGender: gender,
             scenarios: [],
             currentIndex: 0,
             score: 0,
             detectedAllergens: [],
             newlyUnlockedBookId: null,
             currentTitle: badgeTitle
         }));
    } else {
         // Random mode ran out (unlikely but possible if live API fails)
         setGameState(prev => ({ ...prev, status: 'scenario-select' })); 
         setStatusNotice("当前题库已筛查完毕，请切换别的领域。");
    }
  };

  // Story Mode Start
  const startStoryMode = async () => {
      soundManager.playStart();
      // Pick a new random quote for this loading session
      setQuoteIndex(Math.floor(Math.random() * FEMINIST_QUOTES.length));
      
      // Random gender assignment
      const childGender: UserGender = Math.random() > 0.5 ? 'female' : 'male';
      setGameState(prev => ({ ...prev, status: 'loading', childGender }));
      
      try {
          const storyEvents = await generateParentingStory(childGender);
          setGameState(prev => ({
              ...prev,
              status: 'story-intro', // Transition to reveal gender first
              storyEvents,
              childGender,
              currentIndex: 0,
              score: 0 // Reset score for story
          }));
      } catch (e) {
          console.error(e);
          setGameState(prev => ({ ...prev, status: 'error' }));
      }
  };

  const loadIntro = () => {
      resetTransientUi();
      setCategoryCompleted(false);
      setIsEditingName(false);
      setStoryDraft('');
      setSelectedStoryTags([]);
      setCommunityFeedback(null);
      setGameState({
          status: 'intro',
          userGender: null,
          selectedCategory: 'RANDOM',
          scenarios: [],
          storyEvents: [],
          childGender: null,
          currentIndex: 0,
          score: 0,
          detectedAllergens: [],
          newlyUnlockedBookId: null,
          currentTitle: null,
          appMode: 'standard'
      });
  };

  const handleEvaluation = (choiceLevel: number) => {
    setLastUserChoice(choiceLevel);
    
    // Logic Split
    if (gameState.status === 'story-playing') {
        const currentEvent = gameState.storyEvents[gameState.currentIndex];
        const selectedOption = currentEvent.options[choiceLevel];
        
        // Update score based on the option score (0, 1, 2)
        // Store the feedback to show in modal
        setStoryFeedback({
            consequence: selectedOption.consequence,
            score: selectedOption.score
        });
        
        // Accumulate raw score for story
        setGameState(prev => ({
            ...prev,
            score: prev.score + selectedOption.score
        }));
        
        setShowAnalysis(true);

    } else {
        // Normal Mode Logic
        setStoryFeedback(undefined);
        const currentScenario = gameState.scenarios[gameState.currentIndex];
        const isActuallyAllergen = currentScenario.allergenLevel !== AllergenLevel.NONE;
        
        let points = 0;
        if (isActuallyAllergen) {
            if (choiceLevel === 2) points = 100; // Perfect detection
            if (choiceLevel === 1) points = 50;  // Hesitation / Partial detection
        } else {
            if (choiceLevel === 0) points = 100;
            if (choiceLevel === 1) points = 50; 
        }

        if (isActuallyAllergen && choiceLevel >= 1) {
            setGameState(prev => ({
                ...prev,
                score: prev.score + points,
                detectedAllergens: [...prev.detectedAllergens, currentScenario.allergenName]
            }));
        } else {
            setGameState(prev => ({
                ...prev,
                score: prev.score + points
            }));
        }
        setShowAnalysis(true);
    }
  };

  const nextScenario = () => {
    soundManager.playClick();
    setShowAnalysis(false);
    
    if (gameState.status === 'story-playing') {
        if (gameState.currentIndex >= gameState.storyEvents.length - 1) {
            finishStory();
        } else {
            setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
        }
    } else {
        if (gameState.currentIndex >= gameState.scenarios.length - 1) {
            finishGame();
        } else {
            setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
        }
    }
  };

  const finishStory = () => {
      soundManager.playSuccess();
      setCategoryCompleted(false);
      setGameState(prev => ({ ...prev, status: 'story-result' }));
  };

  const finishGame = () => {
    soundManager.playSuccess();
    setCategoryCompleted(false);

    // Calculate Results
    const totalPossible = gameState.scenarios.length * 100;
    const finalScore = gameState.score;
    const percentage = Math.round((finalScore / totalPossible) * 100);

    // Determine Achievement
    const genderAchievements = ACHIEVEMENTS.filter(a => a.gender === gameState.userGender && a.threshold <= 100);
    let earnedAchievement = genderAchievements.find(a => percentage >= a.threshold);
    if (!earnedAchievement) earnedAchievement = genderAchievements[genderAchievements.length - 1];

    // Check for new achievement for Toast
    if (earnedAchievement && !profile.earnedTitles.includes(earnedAchievement.title)) {
        setActiveToast(earnedAchievement.title);
    }

    // Unlock Book Logic
    let newBookId: string | null = null;
    const lockedBooks = FEMINIST_LIBRARY.filter(b => !profile.unlockedBookIds.includes(b.id));
    if (lockedBooks.length > 0) {
        const randomBook = lockedBooks[Math.floor(Math.random() * lockedBooks.length)];
        newBookId = randomBook.id;
    }

    // Extract current game scenario IDs to mark as played
    const currentScenarioIds = gameState.scenarios.map(s => s.id);

    // Update Profile State
    setProfile(prev => {
        const newTitles = new Set(prev.earnedTitles);
        if (earnedAchievement) newTitles.add(earnedAchievement.title);
        
        const newBookIds = new Set(prev.unlockedBookIds);
        if (newBookId) newBookIds.add(newBookId);

        // Add new scenario IDs to played history (using Set to avoid duplicates just in case)
        const newPlayedIds = new Set([...prev.playedScenarioIds, ...currentScenarioIds]);

        return {
            ...prev,
            totalTests: prev.totalTests + 1,
            totalScoreAccumulated: prev.totalScoreAccumulated + percentage,
            highestScore: Math.max(prev.highestScore, percentage),
            unlockedBookIds: Array.from(newBookIds),
            earnedTitles: Array.from(newTitles),
            playedScenarioIds: Array.from(newPlayedIds),
            encounteredAllergens: prev.encounteredAllergens // Keep existing
        };
    });

    setGameState(prev => ({ 
        ...prev, 
        status: 'result', 
        newlyUnlockedBookId: newBookId,
        currentTitle: earnedAchievement?.title 
    }));
  };

  // --- RENDERS ---
  const renderProfile = () => (
      <div className="min-h-screen bg-white p-6 md:p-12 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#5b21b6] pb-4">
              <button onClick={loadIntro} className="flex items-center gap-2 text-[#5b21b6] font-bold group">
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  返回
              </button>
              <h1 className="text-2xl font-black text-[#2e1065] uppercase tracking-widest">玩家档案</h1>
              <div className="w-20"></div> {/* Spacer */}
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: ID Card */}
              <div className="md:col-span-1 space-y-6">
                  <div className="bg-purple-50 border-2 border-[#5b21b6] p-6 text-center shadow-[8px_8px_0px_0px_#5b21b6]">
                      <div className="w-24 h-24 bg-white border-2 border-[#5b21b6] rounded-full mx-auto mb-4 flex items-center justify-center">
                          <User className="w-12 h-12 text-[#5b21b6]" />
                      </div>
                      
                      {isEditingName ? (
                          <div className="flex gap-2 mb-2">
                              <input 
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  className="w-full border-b border-[#5b21b6] bg-transparent outline-none text-center font-bold"
                                  autoFocus
                              />
                              <button onClick={updateProfileName} className="text-[#5b21b6]"><Check className="w-4 h-4" /></button>
                          </div>
                      ) : (
                          <h2 className="text-xl font-bold text-[#2e1065] mb-1 flex items-center justify-center gap-2">
                              {profile.name}
                              <button onClick={() => { setIsEditingName(true); setTempName(profile.name); }} className="opacity-30 hover:opacity-100"><PenLine className="w-4 h-4" /></button>
                          </h2>
                      )}
                      
                      <p className="text-xs font-mono text-gray-400 mb-6">ID: {profile.id}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-left">
                          <div>
                              <p className="text-[10px] text-gray-400 uppercase">测试次数</p>
                              <p className="font-mono font-bold text-[#5b21b6]">{profile.totalTests}</p>
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-400 uppercase">最高得分</p>
                              <p className="font-mono font-bold text-[#5b21b6]">{profile.highestScore}</p>
                          </div>
                      </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-white border-2 border-[#5b21b6] p-6">
                       <h3 className="font-bold text-[#2e1065] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                          <Award className="w-4 h-4" /> 获得称号
                       </h3>
                       <div className="flex flex-wrap gap-2">
                           {profile.earnedTitles.length > 0 ? profile.earnedTitles.map((t, i) => (
                               <span key={i} className="bg-purple-100 text-[#5b21b6] text-xs px-2 py-1 rounded-sm border border-purple-200">
                                   {t}
                               </span>
                           )) : (
                               <p className="text-xs text-gray-400 italic">暂无称号，请进行测试...</p>
                           )}
                       </div>
                  </div>
              </div>

              {/* Right Column: Allergen List */}
              <div className="md:col-span-2">
                   <div className="bg-white border-2 border-[#5b21b6] p-6 h-full min-h-[400px]">
                      <h3 className="font-bold text-[#2e1065] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                          <Fingerprint className="w-4 h-4" /> 已捕获的过敏源 (Encountered Allergens)
                       </h3>
                       
                       {profile.encounteredAllergens.length > 0 ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                               {profile.encounteredAllergens.map((allergen, idx) => (
                                   <div key={idx} className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 text-red-800 text-sm">
                                       <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                                       <span>{allergen}</span>
                                   </div>
                               ))}
                           </div>
                       ) : (
                           <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
                               <Microscope className="w-12 h-12 opacity-20" />
                               <p className="text-sm">尚未在现实中确认过敏源。</p>
                               <p className="text-xs max-w-xs text-center">在测试分析页点击“我在现实中也遇到过”即可录入此处。</p>
                           </div>
                       )}
                   </div>
              </div>
          </div>
      </div>
  );

  const renderBookshelf = () => {
      // Filter visible books (unlocked or placeholder)
      return (
          <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
              <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
                  <button onClick={loadIntro} className="flex items-center gap-2 text-[#5b21b6] font-bold group">
                      <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                      返回大厅
                  </button>
                  <h1 className="text-2xl font-black text-[#2e1065] uppercase tracking-widest flex items-center gap-2">
                      <Library className="w-6 h-6" /> 我的书架
                  </h1>
                  <div className="w-20"></div>
              </div>

              <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {FEMINIST_LIBRARY.map((book) => {
                      const isUnlocked = profile.unlockedBookIds.includes(book.id);
                      return (
                          <motion.button
                              key={book.id}
                              onClick={() => isUnlocked && setSelectedBook(book)}
                              whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
                              className={`aspect-[2/3] relative rounded-r-md shadow-lg transition-all flex flex-col ${
                                  isUnlocked ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-40 grayscale'
                              }`}
                          >
                              {/* Book Spine Effect */}
                              <div 
                                  className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 rounded-l-sm z-10" 
                                  style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}
                              ></div>
                              
                              <div 
                                  className="w-full h-full p-4 flex flex-col justify-between text-white relative overflow-hidden"
                                  style={{ backgroundColor: book.color }}
                              >
                                  <div className="text-[10px] font-mono opacity-70 text-right">{book.id}</div>
                                  <div className="font-serif font-bold text-lg leading-tight text-center px-2 z-10">
                                      {isUnlocked ? book.title : "???"}
                                  </div>
                                  <div className="text-xs text-center opacity-80 z-10">
                                      {isUnlocked ? book.author : "Locked"}
                                  </div>
                                  
                                  {/* Decor */}
                                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                              </div>
                              
                              {!isUnlocked && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                      <Lock className="w-8 h-8 text-white/80" />
                                  </div>
                              )}
                          </motion.button>
                      );
                  })}
              </div>

              {/* Book Detail Modal */}
              <AnimatePresence>
                  {selectedBook && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBook(null)}>
                          <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 50 }}
                              onClick={e => e.stopPropagation()}
                              className="bg-white w-full max-w-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-sm"
                          >
                               <div className="w-full md:w-1/3 p-8 flex items-center justify-center relative" style={{ backgroundColor: selectedBook.color }}>
                                    <div className="text-white text-center">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-80" />
                                        <h2 className="text-2xl font-serif font-bold mb-2">{selectedBook.title}</h2>
                                        <p className="opacity-80">{selectedBook.author}</p>
                                    </div>
                               </div>
                               <div className="w-full md:w-2/3 p-8 bg-white relative">
                                    <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <Quote className="w-8 h-8 text-gray-200 mb-4" />
                                    <blockquote className="text-lg font-serif text-[#2e1065] mb-6 pl-4 border-l-4 border-purple-200 italic">
                                        "{selectedBook.quote}"
                                    </blockquote>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">简介</h4>
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {selectedBook.intro}
                                    </p>
                               </div>
                          </motion.div>
                      </div>
                  )}
              </AnimatePresence>
          </div>
      );
  };

  const renderDictionary = () => (
      <div className="min-h-screen bg-purple-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-[#5b21b6] text-white p-6 flex flex-col shrink-0">
               <button onClick={loadIntro} className="flex items-center gap-2 font-bold mb-8 hover:opacity-80">
                  <ArrowRight className="w-4 h-4 rotate-180" /> 返回大厅
               </button>
               <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                   <BookA className="w-6 h-6" /> 词典
               </h2>
               <div className="space-y-2">
                   <button 
                      onClick={() => { setDictionaryTab('ACADEMIC'); setSelectedTerm(null); }}
                      className={`w-full text-left px-4 py-3 rounded-sm transition-all ${dictionaryTab === 'ACADEMIC' ? 'bg-white text-[#5b21b6] font-bold shadow-md' : 'hover:bg-white/10 opacity-70'}`}
                   >
                       社会学理论 (Theory)
                   </button>
                   <button 
                      onClick={() => { setDictionaryTab('INTERNET'); setSelectedTerm(null); }}
                      className={`w-full text-left px-4 py-3 rounded-sm transition-all ${dictionaryTab === 'INTERNET' ? 'bg-white text-[#5b21b6] font-bold shadow-md' : 'hover:bg-white/10 opacity-70'}`}
                   >
                       互联网黑话 (Slang)
                   </button>
               </div>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
               <div className="max-w-3xl mx-auto">
                    {!selectedTerm ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FEMINIST_DICTIONARY.filter(t => t.category === dictionaryTab).map(term => (
                                <button
                                    key={term.id}
                                    onClick={() => setSelectedTerm(term)}
                                    className="bg-white p-6 border-l-4 border-[#5b21b6] shadow-sm hover:shadow-md hover:translate-x-1 transition-all text-left group"
                                >
                                    <h3 className="font-bold text-lg text-[#2e1065] group-hover:text-[#5b21b6]">{term.term}</h3>
                                    <p className="text-xs text-gray-400 font-mono mt-1">{term.english}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-[#5b21b6] p-8 shadow-[8px_8px_0px_0px_#5b21b6] relative">
                             <button onClick={() => setSelectedTerm(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-400" />
                             </button>
                             
                             <div className="mb-6 border-b border-gray-100 pb-4">
                                 <h2 className="text-3xl font-black text-[#2e1065] mb-2">{selectedTerm.term}</h2>
                                 <p className="font-mono text-[#5b21b6]">{selectedTerm.english}</p>
                             </div>

                             <div className="space-y-6">
                                 <div>
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">定义 / DEFINITION</h4>
                                     <p className="text-gray-800 leading-relaxed text-lg">{selectedTerm.definition}</p>
                                 </div>
                                 
                                 <div className="bg-purple-50 p-4 border-l-4 border-purple-300">
                                     <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">场景示例 / EXAMPLE</h4>
                                     <p className="text-[#5b21b6] italic">"{selectedTerm.example}"</p>
                                 </div>

                                 {selectedTerm.relatedTermIds && selectedTerm.relatedTermIds.length > 0 && (
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">关联词条 / SEE ALSO</h4>
                                         <div className="flex gap-2 flex-wrap">
                                             {selectedTerm.relatedTermIds.map(rid => {
                                                 const related = FEMINIST_DICTIONARY.find(t => t.id === rid);
                                                 return related ? (
                                                     <button 
                                                         key={rid} 
                                                         onClick={() => setSelectedTerm(related)}
                                                         className="text-xs bg-gray-100 px-2 py-1 hover:bg-[#5b21b6] hover:text-white transition-colors"
                                                     >
                                                         {related.term}
                                                     </button>
                                                 ) : null;
                                             })}
                                         </div>
                                     </div>
                                 )}
                             </div>
                        </div>
                    )}
               </div>
          </div>
      </div>
  );

  const renderHerStory = () => {
    // Filter Empowerment items
    const filteredEmpowerment = empowermentFilter === 'ALL' 
        ? EMPOWERMENT_DATA 
        : EMPOWERMENT_DATA.filter(e => e.type === empowermentFilter);

    return (
        <div className="min-h-screen bg-purple-50 flex flex-col">
             {/* Header */}
            <div className="bg-[#5b21b6] text-white p-6 sticky top-0 z-40 shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                     <button onClick={loadIntro} className="flex items-center gap-2 font-bold hover:opacity-80">
                        <ArrowRight className="w-5 h-5 rotate-180" /> 返回大厅
                     </button>
                     <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                         <MessageSquareHeart className="w-6 h-6" /> 女子故事
                     </h1>
                     <div className="w-20"></div>
                </div>
                
                <div className="flex justify-center mt-6 gap-6">
                    <button 
                        onClick={() => setHerStoryTab('EMPOWERMENT')}
                        className={`pb-2 px-4 font-bold border-b-4 transition-colors ${herStoryTab === 'EMPOWERMENT' ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                    >
                        女性力量 (Empowerment)
                    </button>
                    <button 
                        onClick={() => setHerStoryTab('COMMUNITY')}
                         className={`pb-2 px-4 font-bold border-b-4 transition-colors ${herStoryTab === 'COMMUNITY' ? 'border-white text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                    >
                        共鸣广场 (Community)
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {herStoryTab === 'EMPOWERMENT' && (
                        <>
                             {/* Filter Chips */}
                             <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {(['ALL', 'MODEL', 'FACT', 'POLICY', 'COMMUNITY'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setEmpowermentFilter(f)}
                                        className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap transition-colors border ${
                                            empowermentFilter === f 
                                            ? 'bg-[#5b21b6] text-white border-[#5b21b6]' 
                                            : 'bg-white text-[#5b21b6] border-[#5b21b6]'
                                        }`}
                                    >
                                        {f === 'ALL' ? '全部' : 
                                         f === 'MODEL' ? '榜样' : 
                                         f === 'FACT' ? '新知' : 
                                         f === 'POLICY' ? '权益' : '社群'}
                                    </button>
                                ))}
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {filteredEmpowerment.map(item => (
                                     <div key={item.id} className="bg-white p-6 rounded-sm shadow-sm border-t-4 border-[#5b21b6] hover:shadow-md transition-shadow">
                                         <div className="flex justify-between items-start mb-4">
                                             <div>
                                                 <span className="text-[10px] font-bold bg-purple-100 text-[#5b21b6] px-2 py-0.5 rounded-sm">
                                                     {item.tag || item.type}
                                                 </span>
                                                 <h3 className="font-black text-xl text-gray-900 mt-2">{item.title}</h3>
                                                 {item.subtitle && <p className="text-xs text-gray-500 font-mono uppercase">{item.subtitle}</p>}
                                             </div>
                                             {item.type === 'MODEL' && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                                             {item.type === 'FACT' && <Zap className="w-5 h-5 text-blue-400" />}
                                             {item.type === 'POLICY' && <ShieldCheck className="w-5 h-5 text-green-500" />}
                                             {item.type === 'COMMUNITY' && <Users className="w-5 h-5 text-purple-500" />}
                                         </div>
                                         <p className="text-gray-700 text-sm leading-relaxed">
                                             {item.content}
                                         </p>
                                     </div>
                                 ))}
                             </div>
                        </>
                    )}

                    {herStoryTab === 'COMMUNITY' && (
                        <div className="space-y-6">
                             {/* Input Box Placeholder (Non-functional for demo, or mock functional) */}
                             <div className="bg-white p-6 rounded-sm shadow-sm border border-purple-200">
                                 <h3 className="font-bold text-[#5b21b6] mb-2 flex items-center gap-2">
                                     <PenLine className="w-4 h-4" /> 书写你的故事
                                 </h3>
                                 <div className="flex flex-wrap gap-2 mb-4">
                                     {STORY_TAG_OPTIONS.map(tag => {
                                         const isActive = selectedStoryTags.includes(tag);
                                         return (
                                             <button
                                                 key={tag}
                                                 onClick={() => handleToggleStoryTag(tag)}
                                                 className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                                                     isActive
                                                     ? 'bg-[#5b21b6] text-white border-[#5b21b6]'
                                                     : 'bg-white text-[#5b21b6] border-purple-200 hover:border-[#5b21b6]'
                                                 }`}
                                             >
                                                 #{tag}
                                             </button>
                                         );
                                     })}
                                 </div>
                                 <textarea 
                                    value={storyDraft}
                                    onChange={(e) => {
                                        setStoryDraft(e.target.value.slice(0, MAX_STORY_LENGTH));
                                        if (communityFeedback) setCommunityFeedback(null);
                                    }}
                                    className="w-full bg-purple-50 border-0 p-4 text-sm rounded-sm focus:ring-2 focus:ring-[#5b21b6] outline-none mb-4 min-h-[100px]"
                                    placeholder="在这里写下你曾经历过的性别偏见，或者觉醒的瞬间..."
                                 ></textarea>
                                 <div className="flex justify-between items-center">
                                     <div>
                                         <span className="text-xs text-gray-400">匿名发布 · {storyDraft.length}/{MAX_STORY_LENGTH}</span>
                                         {communityFeedback && (
                                             <p className={`text-xs mt-1 ${communityFeedback.includes('失败') ? 'text-red-500' : 'text-[#5b21b6]'}`}>
                                                 {communityFeedback}
                                             </p>
                                         )}
                                     </div>
                                     <button
                                        onClick={handleSubmitStory}
                                        disabled={isSubmittingStory}
                                        className="bg-[#5b21b6] text-white px-6 py-2 rounded-sm font-bold hover:bg-[#4c1d95] disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                         {isSubmittingStory ? '投递中...' : '投递'}
                                     </button>
                                 </div>
                             </div>

                             {/* Story List */}
                             {stories.map((story) => {
                                 const hasSupported = supportedStoryIds.includes(story.id);
                                 return (
                                     <div key={story.id} className="bg-white p-6 rounded-sm shadow-sm">
                                         <div className="flex gap-2 mb-3">
                                             {story.tags.map(t => (
                                                 <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">#{t}</span>
                                             ))}
                                         </div>
                                         <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-line">
                                             {story.content}
                                         </p>
                                         <div className="flex items-center justify-between text-xs text-gray-400">
                                             <span>{new Date(story.timestamp).toLocaleDateString('zh-CN')}</span>
                                             <button 
                                                onClick={() => handleSupportStory(story.id)}
                                                disabled={hasSupported}
                                                className={`flex items-center gap-1 transition-colors group ${hasSupported ? 'text-[#5b21b6] cursor-default' : 'hover:text-[#5b21b6]'}`}
                                             >
                                                 <Heart className={`w-4 h-4 ${story.supportCount > 0 ? 'fill-purple-50 text-purple-500' : ''} ${hasSupported ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                                 <span>{story.supportCount} {hasSupported ? '已共鸣' : '共鸣'}</span>
                                             </button>
                                         </div>
                                     </div>
                                 );
                             })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderTutorialModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowTutorial(false)}>
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg border-2 border-[#5b21b6] shadow-[8px_8px_0px_0px_#5b21b6] relative overflow-hidden"
        >
            {/* Header */}
            <div className="bg-[#5b21b6] p-4 flex justify-between items-center text-white">
                <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                    <Clipboard className="w-5 h-5"/> 操作指南
                </h2>
                <button onClick={() => setShowTutorial(false)}><X className="w-6 h-6"/></button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Concept */}
                <div>
                    <h3 className="text-[#5b21b6] font-bold border-b-2 border-[#5b21b6] inline-block mb-2">01. 实验目的</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        本实验室旨在测试受试者对日常生活中<span className="font-bold text-[#5b21b6]">隐形性别偏见（过敏源）</span>的识别能力。
                    </p>
                </div>

                {/* Mechanics */}
                <div>
                    <h3 className="text-[#5b21b6] font-bold border-b-2 border-[#5b21b6] inline-block mb-2">02. 鉴定流程</h3>
                    <div className="space-y-3 mt-2">
                        <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-sm border border-purple-100">
                            <div className="bg-white p-1 border border-[#5b21b6] text-xl">☁️</div>
                            <div>
                                <p className="font-bold text-[#2e1065] text-xs">迟钝反应 (0分)</p>
                                <p className="text-[10px] text-gray-500">认为“想多了”或接受现状。长期暴露可能导致慢性麻木。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-sm border border-purple-100">
                            <div className="bg-white p-1 border border-[#5b21b6] text-xl">🤔</div>
                            <div>
                                <p className="font-bold text-[#2e1065] text-xs">直觉不适 (1分)</p>
                                <p className="text-[10px] text-gray-500">感到不对劲但说不出原因。这是觉醒的开始。</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-sm border border-purple-100">
                            <div className="bg-white p-1 border border-[#5b21b6] text-xl">⚡</div>
                            <div>
                                <p className="font-bold text-[#2e1065] text-xs">精准捕获 (2分)</p>
                                <p className="text-[10px] text-gray-500">一眼看穿背后的结构性偏见。你拥有强大的免疫抗体。</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RPG Mode */}
                <div>
                    <h3 className="text-[#5b21b6] font-bold border-b-2 border-[#5b21b6] inline-block mb-2">03. 特别项目：养育模拟</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        在RPG模式中，你将扮演监护人。你的每一次选择都将决定孩子是成为<span className="font-bold text-[#5b21b6]">传统的顺从者</span>还是<span className="font-bold text-[#5b21b6]">自由的灯塔</span>。
                    </p>
                </div>
            </div>

            <div className="p-4 bg-purple-50 text-center border-t border-purple-100">
                <button onClick={() => setShowTutorial(false)} className="bg-[#5b21b6] text-white px-8 py-2 font-bold hover:bg-[#4c1d95] shadow-lg">
                    签署知情同意书 (开始)
                </button>
            </div>

        </motion.div>
    </div>
  );

  const renderIntro = () => {
    // Report progress logic
    const answeredCount = profile.playedScenarioIds.length;
    const targetCount = 10;
    const isReportUnlocked = answeredCount >= targetCount;

    return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-purple-50 relative pattern-diagonal-lines">
      {statusNotice && (
        <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2 bg-white border border-[#5b21b6] px-4 py-2 shadow-[4px_4px_0px_0px_#5b21b6] text-xs font-bold text-[#5b21b6]">
          {statusNotice}
        </div>
      )}
      {/* Top Bar Actions */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
         <button 
            onClick={() => setShowTutorial(true)}
            className="p-3 border-2 border-[#5b21b6] rounded-sm hover:bg-[#5b21b6] hover:text-white transition-all shadow-[4px_4px_0px_0px_#5b21b6] active:translate-y-1 active:shadow-none bg-white group"
            aria-label="操作指南"
         >
            <Info className="w-5 h-5 text-[#5b21b6] group-hover:text-white" />
         </button>
         <button 
            onClick={() => setGameState(prev => ({ ...prev, status: 'her-story' }))}
            className="p-3 border-2 border-[#5b21b6] rounded-sm hover:bg-[#5b21b6] hover:text-white transition-all shadow-[4px_4px_0px_0px_#5b21b6] active:translate-y-1 active:shadow-none bg-white group"
            aria-label="女子故事"
         >
            <MessageSquareHeart className="w-5 h-5 text-[#5b21b6] group-hover:text-white" />
         </button>
         <button 
            onClick={() => setGameState(prev => ({ ...prev, status: 'profile' }))}
            className="p-3 border-2 border-[#5b21b6] rounded-sm hover:bg-[#5b21b6] hover:text-white transition-all shadow-[4px_4px_0px_0px_#5b21b6] active:translate-y-1 active:shadow-none bg-white group"
            aria-label="玩家档案"
         >
            <Fingerprint className="w-5 h-5 text-[#5b21b6] group-hover:text-white" />
         </button>
         <button 
            onClick={() => setGameState(prev => ({ ...prev, status: 'dictionary' }))}
            className="p-3 border-2 border-[#5b21b6] rounded-sm hover:bg-[#5b21b6] hover:text-white transition-all shadow-[4px_4px_0px_0px_#5b21b6] active:translate-y-1 active:shadow-none bg-white group"
            aria-label="女性主义词典"
         >
            <BookA className="w-5 h-5 text-[#5b21b6] group-hover:text-white" />
         </button>
         {profile.unlockedBookIds.length > 0 && (
            <button 
            onClick={() => setGameState(prev => ({ ...prev, status: 'bookshelf' }))}
            className="p-3 border-2 border-[#5b21b6] rounded-sm hover:bg-[#5b21b6] hover:text-white transition-all shadow-[4px_4px_0px_0px_#5b21b6] active:translate-y-1 active:shadow-none bg-white group"
            aria-label="我的书架"
            >
            <Library className="w-5 h-5 text-[#5b21b6] group-hover:text-white" />
            </button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center mt-12 md:mt-0 relative z-10"
      >
        <div className="w-24 h-24 bg-white border-2 border-[#5b21b6] rounded-full flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#5b21b6]">
            <Microscope className="w-12 h-12 text-[#5b21b6]" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-black text-[#2e1065] mb-2 tracking-tighter uppercase">女性主义过敏源筛查</h1>
        <p className="text-purple-600 font-mono text-sm mb-6 tracking-widest">FEMINISM ALLERGEN SCREENING</p>

        {/* Visitor Counter */}
        <div className="bg-purple-100 px-4 py-1.5 rounded-full mb-8 flex items-center gap-2 border border-[#5b21b6]">
            <Globe className="w-3 h-3 text-[#5b21b6]" />
            <span className="text-[10px] font-bold text-[#5b21b6] uppercase tracking-wider">
                已链接的观察者: <span className="font-mono text-sm">{visitorCount.toLocaleString()}</span>
            </span>
        </div>
        
        <div className="bg-white p-6 border-2 border-[#5b21b6] mb-8 text-left space-y-4 shadow-[6px_6px_0px_0px_#5b21b6] w-full relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <Activity className="w-32 h-32 text-[#5b21b6]" />
             </div>
            <p className="text-[#2e1065] text-sm leading-relaxed font-bold relative z-10">
                欢迎来到社会学临床实验室。我们将测试你对日常生活中<span className="bg-[#5b21b6] text-white px-1 mx-1">隐形性别偏见</span>的感知敏锐度。
            </p>
            <div className="h-px bg-purple-200 my-2"></div>
            <div className="flex items-center justify-between text-xs text-purple-700 font-mono font-bold uppercase relative z-10 h-8">
               <div className="flex items-center gap-2">
                 <Activity className="w-4 h-4 text-[#5b21b6]" />
                 <span>5 题 / 轮</span>
               </div>
               
               {isReportUnlocked ? (
                   <button 
                     onClick={() => { soundManager.playClick(); setShowReportModal(true); }}
                     className="flex items-center gap-2 border-2 border-orange-500 bg-white px-3 py-1 rounded-sm hover:bg-orange-50 transition-colors group shadow-sm active:translate-y-[1px]"
                   >
                     <Fingerprint className="w-4 h-4 text-[#5b21b6] group-hover:text-orange-600" />
                     <span className="text-[#5b21b6] group-hover:text-orange-600">报告生成</span>
                   </button>
               ) : (
                   <div className="flex items-center gap-2 opacity-50 cursor-help" title={`还需回答 ${Math.max(0, targetCount - answeredCount)} 题`}>
                     <Lock className="w-4 h-4 text-[#5b21b6]" />
                     <span>报告进度: {answeredCount}/{targetCount}</span>
                   </div>
               )}
            </div>
        </div>

        <div className="w-full space-y-4">
            <p className="text-xs font-bold text-[#5b21b6] uppercase tracking-widest mb-2 border-b border-[#5b21b6] pb-1 inline-block">选择受试者生理性别</p>
            <div className="flex gap-4 w-full">
                <button
                    onClick={() => handleGenderSelect('female')}
                    className="flex-1 py-4 border-2 border-[#5b21b6] bg-white text-[#5b21b6] hover:bg-[#5b21b6] hover:text-white transition-all font-bold flex flex-col items-center gap-2 group shadow-[4px_4px_0px_0px_#5b21b6] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#5b21b6] active:translate-y-[4px] active:shadow-none"
                >
                    <User className="w-6 h-6" />
                    <span>我是女性</span>
                </button>
                <button
                    onClick={() => handleGenderSelect('male')}
                    className="flex-1 py-4 border-2 border-[#5b21b6] bg-white text-[#5b21b6] hover:bg-[#5b21b6] hover:text-white transition-all font-bold flex flex-col items-center gap-2 group shadow-[4px_4px_0px_0px_#5b21b6] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#5b21b6] active:translate-y-[4px] active:shadow-none"
                >
                    <User className="w-6 h-6" />
                    <span>我是男性</span>
                </button>
            </div>
        </div>

        {/* Parenting System - Always Visible as Separate Module */}
         <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setGameState(prev => ({ ...prev, status: 'scenario-select', userGender: 'female', appMode: 'parenting' }))}
            className="mt-6 w-full py-4 border-2 border-[#5b21b6] bg-gradient-to-r from-purple-100 to-white text-[#5b21b6] font-bold flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#5b21b6] relative overflow-hidden group hover:-translate-y-1 transition-transform"
         >
             <Baby className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span>进入「养育实验室」</span>
         </motion.button>
        
      </motion.div>
    </div>
  );
  };

  const renderScenarioSelect = () => (
    <div className="min-h-screen bg-purple-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
            <button onClick={loadIntro} className="p-2 hover:bg-white rounded-full transition-colors"><RotateCcw className="w-6 h-6 text-[#5b21b6]" /></button>
            <h2 className="text-xl font-black uppercase tracking-widest text-[#5b21b6]">
                {gameState.appMode === 'parenting' ? '养育实验室' : '选择筛查领域'}
            </h2>
            <div className="w-10"></div>
        </div>

        <div className={`grid gap-4 ${gameState.appMode === 'parenting' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {[
                { id: 'RANDOM', label: '随机混合', icon: <Sparkles className="w-6 h-6" />, desc: "综合测试" },
                { id: Category.PARENTING, label: '育儿困境', icon: <Baby className="w-6 h-6" />, desc: "场景筛查" },
                { id: Category.WORKPLACE, label: '职场', icon: <Briefcase className="w-6 h-6" />, desc: "生存法则" },
                { id: Category.RELATIONSHIP, label: '亲密关系', icon: <Heart className="w-6 h-6" />, desc: "爱的代价" },
                { id: Category.FAMILY, label: '家庭', icon: <Home className="w-6 h-6" />, desc: "甜蜜负担" },
                { id: Category.SOCIAL, label: '社会舆论', icon: <MessageCircle className="w-6 h-6" />, desc: "他者凝视" },
            ].filter(cat => {
                if (gameState.appMode === 'parenting') {
                    // In Parenting Mode, only show Parenting categories
                    return cat.id === Category.PARENTING;
                } else {
                    // In Standard Mode, hide Parenting
                    return cat.id !== Category.PARENTING;
                }
            }).map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => startGame(gameState.userGender!, cat.id as Category | 'RANDOM')}
                    className="bg-white p-4 border-2 border-[#5b21b6] shadow-[4px_4px_0px_0px_#5b21b6] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#5b21b6] active:translate-y-[4px] active:shadow-none transition-all flex flex-col items-center gap-2 group h-32 justify-center"
                >
                    <div className="text-[#5b21b6] group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <div className="text-center">
                        <div className="font-bold text-[#2e1065]">{cat.label}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">{cat.desc}</div>
                    </div>
                </button>
            ))}
            
            {/* Special Story Mode Button - Only shown in Parenting Mode */}
            {gameState.appMode === 'parenting' && (
                <button
                    onClick={startStoryMode}
                    className="bg-gradient-to-br from-[#5b21b6] to-[#4c1d95] p-4 border-2 border-[#5b21b6] shadow-[4px_4px_0px_0px_rgba(91,33,182,0.5)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(91,33,182,0.5)] active:translate-y-[4px] active:shadow-none transition-all flex flex-col items-center gap-2 group h-32 justify-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 bg-yellow-400 text-[#5b21b6] text-[9px] px-2 py-0.5 font-bold font-mono">RPG MODE</div>
                    <Baby className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                        <div className="font-bold text-lg">养育模拟器</div>
                        <div className="text-xs opacity-80 font-mono mt-1">PARENTING SIMULATION</div>
                    </div>
                </button>
            )}
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen bg-[#5b21b6] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-8 relative z-10"
        />
        <div className="relative z-10 max-w-lg">
            <Quote className="w-8 h-8 text-purple-300 mb-4 mx-auto opacity-50" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-relaxed font-serif">
                "{FEMINIST_QUOTES[quoteIndex].text}"
            </h3>
            <p className="text-purple-200 font-mono text-sm uppercase tracking-widest">
                — {FEMINIST_QUOTES[quoteIndex].author}
            </p>
        </div>
    </div>
  );

  const renderPlaying = () => {
      const isStory = gameState.status === 'story-playing';
      const total = isStory ? gameState.storyEvents.length : gameState.scenarios.length;
      const current = gameState.currentIndex + 1;
      const currentItem = isStory ? gameState.storyEvents[gameState.currentIndex] : gameState.scenarios[gameState.currentIndex];

      return (
        <div className="min-h-screen bg-[#f5f3ff] flex flex-col items-center justify-center p-4 relative">
             {/* Top Bar */}
             <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
                 <div className="flex items-center gap-2">
                     <div className="w-10 h-10 bg-white border-2 border-[#5b21b6] rounded-full flex items-center justify-center font-black text-[#5b21b6] shadow-md">
                         {current}
                     </div>
                     <span className="text-[#5b21b6] font-bold text-sm opacity-50">/ {total}</span>
                 </div>
                 <button onClick={loadIntro} className="p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                     <X className="w-5 h-5 text-gray-400" />
                 </button>
             </div>

             <div className="w-full max-w-2xl pt-12 pb-4">
                 <Suspense fallback={modalFallback}>
                     <AnimatePresence mode='wait'>
                        <ScenarioCard 
                            key={currentItem?.id}
                            scenario={isStory ? undefined : currentItem as Scenario}
                            storyEvent={isStory ? currentItem as any : undefined}
                            onEvaluate={handleEvaluation}
                        />
                     </AnimatePresence>
                 </Suspense>
             </div>

             {showAnalysis && (
                <Suspense fallback={modalFallback}>
                    <AnalysisModal 
                        scenario={!isStory ? currentItem as Scenario : undefined}
                        storyFeedback={storyFeedback}
                        userChoice={lastUserChoice}
                        onNext={nextScenario}
                        onEncounter={handleEncounterAllergen}
                        hasEncountered={!isStory && profile.encounteredAllergens.includes((currentItem as Scenario).allergenName)}
                    />
                </Suspense>
             )}
        </div>
      );
  };

  const renderStoryIntro = () => {
      const isGirl = gameState.childGender === 'female';
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 ${isGirl ? 'border-pink-500 bg-pink-50' : 'border-blue-500 bg-blue-50'}`}
              >
                  <Baby className={`w-16 h-16 ${isGirl ? 'text-pink-500' : 'text-blue-500'}`} />
              </motion.div>
              
              <h2 className="text-2xl font-black text-[#2e1065] mb-4">
                  恭喜！是一个{isGirl ? "女孩" : "男孩"}
              </h2>
              <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
                  在这个模拟人生中，你将扮演{isGirl ? "她" : "他"}的监护人。
                  每一个选择，都将在{isGirl ? "她" : "他"}的成长轨迹上留下烙印。
                  <br/><span className="text-xs text-gray-400 mt-2 block">有些烙印是彩色的，有些是灰色的。</span>
              </p>
              
              <button 
                onClick={() => setGameState(prev => ({ ...prev, status: 'story-playing' }))}
                className="px-8 py-3 bg-[#5b21b6] text-white font-bold rounded-sm shadow-[4px_4px_0px_0px_#2e1065] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#2e1065] active:translate-y-0 active:shadow-none transition-all"
              >
                  开始{isGirl ? "她" : "他"}的人生
              </button>
          </div>
      );
  };

  const renderStoryResult = () => {
      const maxScore = gameState.storyEvents.length * 2;
      const score = gameState.score;
      const percentage = (score / maxScore) * 100;
      
      let title = "";
      let desc = "";
      if (percentage >= 80) {
          title = "灯塔守护者";
          desc = "你为孩子构建了一个尽可能免受刻板印象侵害的乌托邦。你的支持赋予了孩子对抗世界偏见的勇气。";
      } else if (percentage >= 50) {
          title = "温和的引导者";
          desc = "你尽力在现实与理想之间寻找平衡。虽然偶尔妥协，但孩子依然感受到了爱的支持。";
      } else {
          title = "传统守望者";
          desc = "你倾向于让孩子顺应社会既有的规则。这或许是最‘安全’的路，但也可能剪断了孩子飞翔的羽翼。";
      }

      return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 border-2 border-[#5b21b6] shadow-[8px_8px_0px_0px_#5b21b6] max-w-md w-full">
                <Trophy className="w-16 h-16 text-[#5b21b6] mx-auto mb-4" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">养育风格评定</h2>
                <h1 className="text-3xl font-black text-[#2e1065] mb-4">{title}</h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-8">{desc}</p>
                
                <div className="flex gap-4">
                    <button onClick={loadIntro} className="flex-1 py-3 border-2 border-[#5b21b6] font-bold text-[#5b21b6] hover:bg-purple-50">
                        返回主页
                    </button>
                    <button onClick={startStoryMode} className="flex-1 py-3 bg-[#5b21b6] text-white font-bold hover:bg-[#4c1d95]">
                        再来一次
                    </button>
                </div>
            </div>
        </div>
      );
  };

  const renderResult = () => {
      if (categoryCompleted) {
          return (
            <div className="min-h-screen bg-[#2e1065] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white w-full max-w-lg p-8 border-4 border-white shadow-2xl relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-purple-500 to-indigo-500"></div>
                    <Trophy className="w-16 h-16 text-[#5b21b6] mx-auto mb-4" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">分类阶段完成</p>
                    <h1 className="text-4xl font-black text-[#2e1065] my-3">{gameState.currentTitle || '领域通关'}</h1>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        这个领域的静态题库已经全部筛查完毕。继续切换其他领域，或者回到主页生成你的阶段性报告。
                    </p>
                    <div className="bg-purple-50 p-4 mb-6 text-left border-l-4 border-[#5b21b6]">
                        <h3 className="font-bold text-[#2e1065] mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            获得称号
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {ACHIEVEMENTS.find(a => a.title === gameState.currentTitle)?.description || '你已经完成当前筛查领域。'}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setGameState(prev => ({ ...prev, status: 'scenario-select' }))}
                            className="py-3 border-2 border-[#5b21b6] text-[#5b21b6] font-bold hover:bg-purple-50 transition-colors"
                        >
                            换个领域
                        </button>
                        <button 
                            onClick={loadIntro}
                            className="py-3 bg-[#5b21b6] text-white font-bold hover:bg-[#4c1d95] transition-colors shadow-lg"
                        >
                            返回大厅
                        </button>
                    </div>
                </motion.div>
            </div>
          );
      }

      const maxScore = Math.max(1, gameState.scenarios.length * 100);
      const score = gameState.score;
      const percentage = Math.round((score / maxScore) * 100);

      return (
        <div className="min-h-screen bg-[#2e1065] flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-lg p-8 border-4 border-white shadow-2xl relative overflow-hidden text-center"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">本次敏感度测试得分</p>
                    <h1 className="text-6xl font-black text-[#2e1065] my-2">{percentage}</h1>
                    <div className="inline-block px-3 py-1 bg-purple-100 text-[#5b21b6] text-xs font-bold rounded-full">
                        {gameState.currentTitle || "观察者"}
                    </div>
                </div>

                <div className="bg-purple-50 p-4 mb-6 text-left border-l-4 border-[#5b21b6]">
                    <h3 className="font-bold text-[#2e1065] mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" /> 
                        获得评价
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {ACHIEVEMENTS.find(a => a.title === gameState.currentTitle)?.description || "继续保持觉察。"}
                    </p>
                </div>

                {gameState.newlyUnlockedBookId ? (
                    <div className="bg-yellow-50 p-4 border border-yellow-200 mb-6 flex items-center gap-4 text-left">
                        <div className="bg-yellow-400 p-2 text-white rounded-full shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-yellow-700 uppercase">新书解锁</p>
                            <p className="font-bold text-[#2e1065]">
                                {FEMINIST_LIBRARY.find(b => b.id === gameState.newlyUnlockedBookId)?.title}
                            </p>
                            <button 
                                onClick={() => {
                                    const book = FEMINIST_LIBRARY.find(b => b.id === gameState.newlyUnlockedBookId);
                                    if(book) {
                                        setGameState(prev => ({...prev, status: 'bookshelf'}));
                                        setSelectedBook(book);
                                    }
                                }}
                                className="text-xs text-[#5b21b6] underline mt-1 font-bold"
                            >
                                立即阅读
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-gray-400 mb-6 italic">
                        (本次未解锁新书，多尝试不同选择或提高得分)
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={loadIntro}
                        className="py-3 border-2 border-[#5b21b6] text-[#5b21b6] font-bold hover:bg-purple-50 transition-colors"
                    >
                        返回大厅
                    </button>
                    <button 
                        onClick={() => setShowReportModal(true)}
                        className="py-3 bg-[#5b21b6] text-white font-bold hover:bg-[#4c1d95] transition-colors shadow-lg"
                    >
                        分享报告
                    </button>
                </div>
            </motion.div>
        </div>
      );
  };

  return (
    <>
      <div className="hidden">{/* Preload logic if needed */}</div>
      {/* Toast Notification */}
      <Toast message={activeToast} onClose={() => setActiveToast(null)} />

      {/* Tutorial Modal */}
      {showTutorial && renderTutorialModal()}

      {gameState.status === 'intro' && renderIntro()}
      {gameState.status === 'profile' && renderProfile()}
      {gameState.status === 'bookshelf' && renderBookshelf()}
      {gameState.status === 'dictionary' && renderDictionary()}
      {gameState.status === 'her-story' && renderHerStory()}
      {gameState.status === 'scenario-select' && renderScenarioSelect()}
      {gameState.status === 'loading' && renderLoading()}
      {(gameState.status === 'playing' || gameState.status === 'story-playing') && renderPlaying()}
      {gameState.status === 'story-intro' && renderStoryIntro()}
      {gameState.status === 'story-result' && renderStoryResult()}
      {gameState.status === 'result' && renderResult()}
      {gameState.status === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">连接错误</h2>
              <p className="mb-4">无法连接到分析引擎。</p>
              <button onClick={loadIntro} className="px-4 py-2 bg-[#5b21b6] text-white rounded">返回</button>
          </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
          <Suspense fallback={modalFallback}>
              <ReportModal 
                  profile={profile} 
                  onClose={() => setShowReportModal(false)} 
              />
          </Suspense>
      )}
    </>
  );
};

export default App;
