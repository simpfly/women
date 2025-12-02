import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scenario, AllergenLevel } from '../types';
import { AlertTriangle, CheckCircle, Thermometer, HelpCircle, UserCheck, ArrowRight, Fingerprint, Check } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface AnalysisModalProps {
  scenario?: Scenario;
  storyFeedback?: {
      consequence: string;
      score: number; // 0, 1, 2
  };
  userChoice: number; // 0=Dismiss, 1=Unsure, 2=Alert
  onNext: () => void;
  // New props for encountering feature
  onEncounter?: (allergenName: string) => void;
  hasEncountered?: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ 
    scenario, 
    storyFeedback, 
    userChoice, 
    onNext,
    onEncounter,
    hasEncountered = false
}) => {
  const isStoryMode = !!storyFeedback;
  const [localEncountered, setLocalEncountered] = useState(hasEncountered);
  
  // Logic for Normal Mode
  const isActuallyAllergen = scenario?.allergenLevel !== AllergenLevel.NONE;
  let resultStatus: 'success' | 'partial' | 'fail' = 'fail';

  if (!isStoryMode && scenario) {
      if (isActuallyAllergen) {
          if (userChoice === 2) resultStatus = 'success';
          else if (userChoice === 1) resultStatus = 'partial';
          else resultStatus = 'fail';
      } else {
          if (userChoice === 0) resultStatus = 'success';
          else resultStatus = 'fail'; 
      }
  }

  useEffect(() => {
    setLocalEncountered(hasEncountered);
  }, [hasEncountered]);

  useEffect(() => {
    if (isStoryMode && storyFeedback) {
        // Story mode sounds - explicit conversion to number for safety
        const s = Number(storyFeedback.score);
        if (s === 2) soundManager.playSuccess();
        else if (s === 1) soundManager.playClick();
        else soundManager.playMiss();
    } else {
        // Normal mode sounds
        if (resultStatus === 'success') {
            isActuallyAllergen ? soundManager.playAlert() : soundManager.playSuccess();
        } else if (resultStatus === 'partial') {
            soundManager.playClick();
        } else {
            soundManager.playMiss();
        }
    }
  }, [resultStatus, isActuallyAllergen, isStoryMode, storyFeedback]);

  const handleEncounterClick = () => {
      if (!scenario || localEncountered || !onEncounter) return;
      onEncounter(scenario.allergenName);
      setLocalEncountered(true);
  };

  // --- STORY MODE RENDER ---
  if (isStoryMode && storyFeedback) {
      // Force conversion to number to handle potential string types from API
      const scoreVal = Number(storyFeedback.score);
      const isGood = scoreVal === 2;
      const isNeutral = scoreVal === 1;

      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-[#5b21b6] w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(91,33,182,0.5)] overflow-hidden flex flex-col"
            >
                <div className={`p-6 text-center border-b-2 border-[#5b21b6] ${isGood ? 'bg-[#5b21b6] text-white' : isNeutral ? 'bg-purple-100 text-[#5b21b6]' : 'bg-gray-100 text-gray-500'}`}>
                    <UserCheck className="w-8 h-8 mx-auto mb-2" />
                    <h2 className="text-xl font-black uppercase tracking-widest">
                        {isGood ? "成长轨迹优化" : isNeutral ? "常规成长路径" : "刻板印象加深"}
                    </h2>
                </div>
                
                <div className="p-8 text-center">
                    <p className="text-[#2e1065] text-lg font-medium leading-relaxed mb-6">
                        "{storyFeedback.consequence}"
                    </p>
                    <div className="h-px bg-purple-100 mb-6"></div>
                    <p className="text-xs text-purple-400 font-mono uppercase tracking-widest">
                        {isGood ? "+2 分 (Empowered)" : isNeutral ? "+1 分 (Neutral)" : "+0 分 (Reinforced)"}
                    </p>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-white hover:bg-purple-50 text-[#5b21b6] font-bold uppercase tracking-widest border-t-2 border-[#5b21b6] flex items-center justify-center gap-2"
                >
                    下一阶段 <ArrowRight className="w-4 h-4" />
                </button>
            </motion.div>
         </div>
      );
  }

  // --- NORMAL MODE RENDER ---
  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        role="dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-[#5b21b6] w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(91,33,182,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Color Logic */}
        <div className={`p-6 text-center relative overflow-hidden border-b-2 border-[#5b21b6] 
            ${resultStatus === 'success' ? 'bg-[#5b21b6] text-white' : 
              resultStatus === 'partial' ? 'bg-purple-200 text-[#5b21b6]' : 
              'bg-white text-[#5b21b6] pattern-diagonal-lines'}`}>
            
            <div className="relative z-10">
                {isActuallyAllergen ? (
                    // It IS an Allergen
                    resultStatus === 'success' ? (
                        <div className="flex flex-col items-center">
                            <AlertTriangle className="w-8 h-8 mb-2" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">成功捕获</h2>
                            <p className="text-purple-200 mt-1 font-mono text-xs">检测到过敏源</p>
                        </div>
                    ) : resultStatus === 'partial' ? (
                        <div className="flex flex-col items-center">
                            <HelpCircle className="w-8 h-8 mb-2" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">直觉敏锐</h2>
                            <p className="text-[#5b21b6] mt-1 font-mono text-xs opacity-70">可疑迹象</p>
                            <p className="text-xs mt-2 font-bold">你的直觉是对的，这确实是过敏源。</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Thermometer className="w-8 h-8 mb-2 text-[#5b21b6]" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">检测遗漏</h2>
                            <p className="text-purple-400 font-mono text-xs">漏诊</p>
                        </div>
                    )
                ) : (
                    // It is SAFE
                    resultStatus === 'success' ? (
                        <div className="flex flex-col items-center">
                            <CheckCircle className="w-8 h-8 mb-2" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">环境安全</h2>
                            <p className="text-purple-200 font-mono text-xs">安全</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Thermometer className="w-8 h-8 mb-2 text-[#5b21b6]" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">过度敏感</h2>
                            <p className="text-purple-400 font-mono text-xs">误报</p>
                        </div>
                    )
                )}
            </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-purple-50/50">
            {isActuallyAllergen && scenario && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#5b21b6] text-white text-xs font-bold uppercase tracking-wider border border-[#5b21b6]">
                            诊断结果
                        </span>
                        <h3 className="text-lg font-bold text-[#2e1065]">{scenario.allergenName}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#5b21b6] mb-4 font-mono">
                        <span>危害等级:</span>
                        <span className="font-bold border-b border-[#5b21b6]">
                            {scenario.allergenLevel}
                        </span>
                    </div>

                    <div className="bg-white p-4 border border-[#5b21b6] mb-4 shadow-sm">
                        <h4 className="text-xs font-bold text-[#5b21b6] uppercase mb-2 border-b border-purple-100 pb-1">病理分析</h4>
                        <p className="text-[#2e1065] leading-relaxed text-sm">
                            {scenario.analysis}
                        </p>
                    </div>

                    <div className="bg-purple-100 p-4 border-l-4 border-[#5b21b6] relative italic text-[#4c1d95] text-sm">
                        <span className="absolute -top-3 left-2 bg-[#5b21b6] text-white text-[10px] px-1 font-mono">专家点评</span>
                        "{scenario.wittyComment}"
                    </div>

                    {/* NEW: Reality Resonance Section */}
                    <div className="mt-8 pt-4 border-t border-dashed border-[#5b21b6]/30">
                        <div className="flex flex-col items-center text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">现实共鸣</p>
                            <button
                                onClick={handleEncounterClick}
                                disabled={localEncountered}
                                className={`w-full py-3 px-4 rounded-sm border-2 flex items-center justify-center gap-2 transition-all group ${
                                    localEncountered 
                                    ? 'bg-purple-100 border-[#5b21b6] text-[#5b21b6] cursor-default' 
                                    : 'bg-white border-gray-300 text-gray-600 hover:border-[#5b21b6] hover:text-[#5b21b6]'
                                }`}
                            >
                                {localEncountered ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span className="font-bold">已记录至过敏源档案</span>
                                    </>
                                ) : (
                                    <>
                                        <Fingerprint className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                                        <span className="font-bold">我在现实中也遇到过</span>
                                    </>
                                )}
                            </button>
                            <p className="text-[10px] text-gray-400 mt-2">
                                {localEncountered ? "数据已同步，将在最终报告中生成个人过敏清单。" : "点击标记，完善你的个人过敏源报告。"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!isActuallyAllergen && (
                <p className="text-[#2e1065] font-medium text-center py-8">
                    该样本未检测到明显的性别偏见成分。<br/><span className="text-sm opacity-70">保持警惕，但不必过度紧张。</span>
                </p>
            )}
        </div>

        <div className="p-4 bg-white border-t-2 border-[#5b21b6]">
            <button
                onClick={onNext}
                aria-label="继续下一个"
                className="w-full py-4 bg-[#5b21b6] hover:bg-[#4c1d95] text-white font-bold uppercase tracking-widest transition-colors shadow-lg active:translate-y-1 transform duration-100 focus:outline-none focus:ring-2 focus:ring-[#5b21b6] focus:ring-offset-2"
            >
                继续筛查
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisModal;