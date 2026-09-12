import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scenario, Category, StoryOption } from '../types';
import { Briefcase, Heart, Home, MessageCircle, Globe, Baby, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface ScenarioCardProps {
  scenario?: Scenario;
  // Story Mode Props
  storyEvent?: {
      age: string;
      title: string;
      content: string;
      options: StoryOption[];
  };
  onEvaluate: (choiceLevel: number) => void;
}

const CategoryIcon = ({ category }: { category: Category }) => {
  const props = { className: "w-5 h-5 text-[#5b21b6]", "aria-hidden": "true" as const };
  switch (category) {
    case Category.WORKPLACE: return <Briefcase {...props} />;
    case Category.RELATIONSHIP: return <Heart {...props} />;
    case Category.FAMILY: return <Home {...props} />;
    case Category.SOCIAL: return <MessageCircle {...props} />;
    case Category.PARENTING: return <Baby {...props} />;
    default: return <Globe {...props} />;
  }
};

// More deceptive/realistic internal monologues for the buttons
const DISMISSIVE_LABELS = [
    "也许是我太敏感了", 
    "为了大局，忍忍吧", 
    "只要我不承认，就不是歧视", 
    "他这人就是情商低，没恶意的", 
    "这就是社会现实，没法改变", 
    "不要破坏当下的气氛", 
    "太较真会显得我很难相处",
    "人家也是一片好心"
];

const UNSURE_LABELS = [
    "这句话听着哪里不对劲...", 
    "虽然不舒服，但不好反驳", 
    "是我想多了吗？", 
    "不知道该摆出什么表情", 
    "心里像扎了一根刺", 
    "这算是玩笑还是冒犯？", 
    "欲言又止，如鲠在喉",
    "感觉怪怪的，但说不上来"
];

const ALERT_LABELS = [
    "精准识别出刻板印象", 
    "看到了背后的权力结构", 
    "这是对边界的隐形侵犯", 
    "拒绝接受这种预设", 
    "典型的煤气灯操纵", 
    "这不仅针对我，是结构性问题", 
    "不需要用愤怒来证明我的合理性",
    "侦测到厌女成分"
];

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, storyEvent, onEvaluate }) => {
  const [labels, setLabels] = useState({ dismiss: "", unsure: "", alert: "" });
  const isStoryMode = !!storyEvent;

  useEffect(() => {
    if (!isStoryMode && scenario) {
        setLabels({
            dismiss: DISMISSIVE_LABELS[Math.floor(Math.random() * DISMISSIVE_LABELS.length)],
            unsure: UNSURE_LABELS[Math.floor(Math.random() * UNSURE_LABELS.length)],
            alert: ALERT_LABELS[Math.floor(Math.random() * ALERT_LABELS.length)]
        });
    }
  }, [scenario?.id, isStoryMode]);

  const handleOptionClick = (score: number) => {
    soundManager.playClick();
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    onEvaluate(score);
  };

  // Content for Main Game vs Story Mode
  const content = isStoryMode ? storyEvent!.content : scenario!.content;
  const headerTitle = isStoryMode ? storyEvent!.title : scenario?.category;
  const headerSub = isStoryMode ? storyEvent!.age : `样本 #${scenario?.id.slice(-4)}`;

  return (
    <div className="w-full max-w-md mx-auto md:max-w-2xl select-none">
      <motion.div
        key={isStoryMode ? storyEvent?.age : scenario?.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="bg-white rounded-none shadow-[4px_4px_0px_0px_#5b21b6] sm:shadow-[8px_8px_0px_0px_#5b21b6] overflow-hidden border-2 border-[#5b21b6] flex flex-col min-h-[360px] sm:min-h-[500px]"
        role="article"
      >
        {/* Card Header */}
        <div className="bg-purple-50 p-3 sm:p-4 flex items-center justify-between border-b-2 border-[#5b21b6]">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-white border border-[#5b21b6] text-[10px] font-black text-[#5b21b6] uppercase tracking-wider">
                {isStoryMode ? <Sparkles className="w-4 h-4 text-[#5b21b6]"/> : <CategoryIcon category={scenario!.category} />}
                <span>{headerTitle}</span>
            </div>
            <div className={`text-[10px] text-[#5b21b6] font-mono tracking-widest font-bold ${isStoryMode ? 'bg-[#5b21b6] text-white px-2 py-0.5' : 'opacity-60'}`}>
                {headerSub}
            </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center bg-white relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50"></div>
            <div className="mb-4 sm:mb-8 opacity-10 hidden md:block" aria-hidden="true">
                {isStoryMode ? (
                     <Baby className="w-16 h-16 sm:w-24 sm:h-24 text-[#5b21b6]" />
                ) : (
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="1" className="mx-auto sm:w-[100px] sm:h-[100px]">
                        <path d="M2 12h5" />
                        <path d="M17 12h5" />
                        <path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5" />
                        <path d="M12 7V3" />
                        <path d="M12 21v-4" />
                    </svg>
                )}
            </div>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#2e1065] leading-relaxed tracking-tight">
            "{content}"
          </p>
        </div>

        {/* Actions */}
        {isStoryMode ? (
             <div className="flex flex-col border-t-2 border-[#5b21b6]">
                {storyEvent!.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        className="p-3.5 sm:p-5 text-left bg-white hover:bg-purple-50 text-[#5b21b6] font-bold transition-colors border-b border-[#5b21b6] last:border-b-0 focus:outline-none focus:bg-purple-100 group flex items-start gap-3 sm:gap-4 select-none"
                    >
                         <span className="bg-[#5b21b6] text-white font-mono text-[11px] sm:text-xs w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full shrink-0 group-hover:scale-110 transition-transform">
                             {String.fromCharCode(65 + idx)}
                         </span>
                         <span className="text-xs sm:text-sm md:text-base leading-snug sm:leading-tight">{opt.text}</span>
                    </button>
                ))}
             </div>
        ) : (
            <div className="flex flex-col border-t-2 border-[#5b21b6]">
                {scenario?.options ? (
                    scenario.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.score)}
                            className="p-3.5 sm:p-5 text-left bg-white hover:bg-purple-50 text-[#5b21b6] font-bold transition-colors border-b border-[#5b21b6] last:border-b-0 focus:outline-none focus:bg-purple-100 group flex items-start gap-3 sm:gap-4 select-none"
                        >
                             <span className="bg-[#5b21b6] text-white font-mono text-[11px] sm:text-xs w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full shrink-0 group-hover:scale-110 transition-transform">
                                 {String.fromCharCode(65 + idx)}
                             </span>
                             <span className="text-xs sm:text-sm md:text-base leading-snug sm:leading-tight">{opt.text}</span>
                        </button>
                    ))
                ) : (
                    [
                        { text: labels.dismiss, score: 0, icon: "☁️" },
                        { text: labels.unsure, score: 1, icon: "🤔" },
                        { text: labels.alert, score: 2, icon: "⚡" }
                    ].map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(option.score)}
                            className="p-3.5 sm:p-5 text-left bg-white hover:bg-purple-50 text-[#5b21b6] font-bold transition-colors border-b border-[#5b21b6] last:border-b-0 focus:outline-none focus:bg-purple-100 group flex items-center justify-between select-none"
                        >
                            <span className="text-xs sm:text-sm md:text-base leading-snug sm:leading-tight uppercase tracking-wider sm:tracking-widest font-black">{option.text}</span>
                            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100">{option.icon}</span>
                        </button>
                    ))
                )}
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScenarioCard;