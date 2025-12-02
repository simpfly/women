import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PlayerProfile } from '../types';
import { X, Download, Share2, Loader2, Activity } from 'lucide-react';
import { toPng } from 'html-to-image';
import { soundManager } from '../utils/sound';

interface ReportModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ profile, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const avgScore = profile.totalTests > 0 ? Math.round(profile.totalScoreAccumulated / profile.totalTests) : 0;
  const dateStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const handleDownload = useCallback(async () => {
    if (reportRef.current === null) return;
    
    soundManager.playClick();
    setIsGenerating(true);

    try {
      // Small delay to ensure rendering frames are ready
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(reportRef.current, { 
          cacheBust: true,
          pixelRatio: 2, // Higher quality
          backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `Feminist_Report_${profile.id}.png`;
      link.href = dataUrl;
      link.click();
      
      soundManager.playSuccess();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert("图片生成失败，请尝试截图保存。");
    } finally {
      setIsGenerating(false);
    }
  }, [profile.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8">
        
        {/* Actions Bar */}
        <div className="flex justify-end gap-3 mb-4 sticky top-0 z-50">
            <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="bg-[#5b21b6] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-[#4c1d95] transition-colors disabled:opacity-50"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4" />}
                {isGenerating ? "生成中..." : "保存图片"}
            </button>
            <button 
                onClick={onClose}
                className="bg-white text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* --- REPORT CONTAINER (Target for Image Generation) --- */}
        <div 
            ref={reportRef} 
            className="bg-white text-black p-0 shadow-2xl overflow-hidden relative"
            style={{ 
                fontFamily: "'Noto Sans SC', sans-serif",
                minHeight: '600px'
            }}
        >
            {/* Top Color Bar */}
            <div className="h-3 bg-[#5b21b6] w-full"></div>

            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#5b21b6] mb-1">
                            <Activity className="w-5 h-5" />
                            <span className="font-bold text-xs tracking-widest uppercase">社会学临床实验室</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900">临床免疫检验报告单</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">CLINICAL LABORATORY REPORT</p>
                    </div>
                    <div className="text-right">
                        <div className="border border-black px-2 py-1 inline-block">
                            <p className="text-[10px] font-bold">样本编号 / SAMPLE ID</p>
                            <p className="text-lg font-mono font-bold leading-none">{profile.id}</p>
                        </div>
                    </div>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-4 gap-y-2 text-xs mb-6 font-medium border-b border-gray-200 pb-4">
                    <div className="text-gray-500">姓名</div>
                    <div className="font-bold text-base col-span-3">{profile.name}</div>
                    
                    <div className="text-gray-500">检验日期</div>
                    <div>{dateStr}</div>
                    
                    <div className="text-gray-500">报告时间</div>
                    <div>{timeStr}</div>

                    <div className="text-gray-500">临床诊断</div>
                    <div className="col-span-3 font-bold text-[#5b21b6]">
                        {profile.earnedTitles[profile.earnedTitles.length - 1] || '观察者'}
                        <span className="ml-2 text-gray-400 font-normal text-[10px]">(当前觉醒阶段)</span>
                    </div>
                </div>

                {/* Results Table */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="font-bold text-sm bg-gray-100 px-2 py-1 inline-block">特异性 IgE 抗体检测结果</h3>
                    </div>
                    
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="py-2 w-10">序号</th>
                                <th className="py-2">过敏源项目 (Item)</th>
                                <th className="py-2 w-20">结果</th>
                                <th className="py-2 w-24">提示</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.encounteredAllergens.length > 0 ? (
                                profile.encounteredAllergens.map((allergen, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                                        <td className="py-3 font-mono text-gray-400">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td className="py-3 font-bold text-gray-800">{allergen}</td>
                                        <td className="py-3 font-bold text-red-600">阳性 (+)</td>
                                        <td className="py-3 text-red-600 font-bold text-[10px]">⚠ 高度敏感</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                                        本次筛查未检出明显特异性过敏源<br/>
                                        (No specific allergen detected in this session)
                                    </td>
                                </tr>
                            )}
                            
                            {/* Summary Row */}
                            <tr className="bg-purple-50">
                                <td className="py-3 pl-2 font-mono text-[#5b21b6]">*</td>
                                <td className="py-3 font-bold text-[#5b21b6]">总体敏感度指数 (Sensitivity Index)</td>
                                <td className="py-3 font-bold text-[#5b21b6] text-lg">{avgScore}%</td>
                                <td className="py-3 text-[#5b21b6]">
                                    {avgScore > 80 ? '↑↑ 高' : avgScore > 50 ? '↑ 中' : '低'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Doctor's Note */}
                <div className="bg-gray-50 border border-gray-200 p-4 mb-6 relative">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">医生建议 / Doctor's Advice</p>
                    <p className="text-xs leading-relaxed text-gray-700">
                        该受试者对社会结构性不平等具有{avgScore > 60 ? '极高' : '一定'}的感知能力。
                        建议继续保持觉察，在日常生活中建立心理免疫屏障。
                        <br/>
                        <span className="italic opacity-70 mt-1 block">"看见，是改变的第一步。"</span>
                    </p>
                    
                    {/* Red Stamp */}
                    <div className="absolute right-4 bottom-2 w-24 h-24 border-4 border-red-600 rounded-full opacity-80 flex flex-col items-center justify-center text-red-600 font-bold rotate-[-12deg] pointer-events-none mix-blend-multiply" style={{ maskImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }}>
                        <div className="text-[8px] tracking-widest">FEMINISM LAB</div>
                        <div className="text-lg border-t border-b border-red-600 my-1 px-1">确 诊</div>
                        <div className="text-[8px] tracking-widest">CLINICAL</div>
                        <div className="text-[8px]">{dateStr.replace(/\//g, '.')}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black pt-4 flex justify-between items-end text-[10px] text-gray-500">
                    <div>
                        <p>检验者: AI Gemini</p>
                        <p>复核者: {profile.name}</p>
                        <p className="mt-2">本报告仅供自我觉察参考，不作为医学诊断依据。</p>
                    </div>
                    <div className="text-right">
                        <div className="w-12 h-12 bg-black ml-auto mb-1 flex items-center justify-center text-white text-[8px] text-center leading-tight p-1">
                            QR CODE
                            <br/>
                            PLACEHOLDER
                        </div>
                        <p className="font-mono">feminist-allergen-test.com</p>
                    </div>
                </div>
            </div>
            
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-[#fff] opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        </div>
        
        <p className="text-center text-white/50 text-xs mt-4">
            点击上方按钮保存图片，分享你的觉醒时刻
        </p>
      </div>
    </div>
  );
};

export default ReportModal;