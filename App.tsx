
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ResultCard } from './components/ResultCard';
import { AppStatus, DrugAnalysis } from './types';
import { analyzeDrug } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [drugName, setDrugName] = useState('');
  const [result, setResult] = useState<DrugAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 动态更新页面背景
  useEffect(() => {
    if (result?.data?.ui_design?.background_color) {
      document.body.style.backgroundColor = result.data.ui_design.background_color;
      document.body.style.transition = 'background-color 1.5s ease-in-out';
    } else {
      document.body.style.backgroundColor = '#f8f9fa';
    }
  }, [result]);

  const handleSearch = async () => {
    if (!drugName.trim()) return;
    processAnalysis(drugName.trim());
  };

  const handleSuggestionClick = (name: string) => {
    setDrugName(name);
    processAnalysis(name);
  };

  const processAnalysis = async (name: string) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setError(null);
    try {
      const analysis = await analyzeDrug(name);
      setResult(analysis);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '药灵在虚空深处迷失了，请稍后再试。');
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setDrugName('');
    setError(null);
  };

  const LoadingPhrases = [
    "正在开启灵魂同调...",
    "寻觅分子间的诗意契合...",
    "聆听药草的第一次心跳...",
    "正在调配感官与理性的黄金比例...",
  ];
  const [loadingPhrase] = useState(() => LoadingPhrases[Math.floor(Math.random() * LoadingPhrases.length)]);

  const suggestions = ["阿司匹林", "连翘", "薄荷", "枸杞", "人参", "青蒿素"];

  return (
    <Layout>
      <div className="space-y-12">
        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="max-w-2xl mx-auto space-y-12 pt-12 pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase border border-white/30 shadow-sm">
                Herbal Heart-Whisper • 本草心语
              </div>
              <p className="text-slate-500 leading-relaxed font-light text-xl md:text-2xl serif italic px-4">
                “万物皆药，唯美治愈。”<br/>
                <span className="text-xs md:text-sm not-italic font-sans text-slate-400 block mt-3 tracking-widest uppercase">
                  唤醒药物深处的灵魂，聆听分子的第一声叹息
                </span>
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto px-2">
              <div className="bg-white/80 backdrop-blur-md p-1.5 md:p-2 rounded-[1.8rem] md:rounded-[2rem] shadow-xl shadow-slate-200/30 border border-white/60 flex items-center gap-2 md:gap-3 transition-all focus-within:shadow-2xl focus-within:bg-white focus-within:border-slate-300">
                <input
                  type="text"
                  placeholder="如: 阿司匹林 / 连翘..."
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-300 serif text-base md:text-xl min-w-0"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-slate-900 text-white px-5 md:px-8 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-slate-800 transition-all active:scale-95 font-medium tracking-widest text-xs md:text-sm shadow-lg shadow-slate-200 cursor-pointer whitespace-nowrap"
                >
                  唤醒
                </button>
              </div>

              {/* 推荐词推荐 */}
              <div className="text-center space-y-3 pt-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">推荐唤醒：</p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSuggestionClick(name)}
                      className="px-4 py-1.5 bg-white/40 hover:bg-white border border-white/50 hover:border-slate-200 text-xs text-slate-500 rounded-full transition-all duration-300 hover:shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50/80 backdrop-blur-sm text-rose-600 px-6 py-4 rounded-2xl text-center text-sm border border-rose-100/50 animate-in fade-in zoom-in-95 duration-300 shadow-sm max-w-xl mx-auto">
                {error}
              </div>
            )}
          </div>
        ) : null}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-32 space-y-10">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-[1px] border-slate-900/10 rounded-full"></div>
              <div className="absolute inset-0 border-[3px] border-slate-900 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-6 border border-slate-200 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-3">
              <p className="serif text-2xl text-slate-700 tracking-[0.2em] font-light animate-pulse">
                {loadingPhrase}
              </p>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
            <ResultCard data={result} />
            <div className="text-center pb-12">
              <button 
                onClick={reset}
                className="group inline-flex items-center gap-4 text-slate-400 hover:text-slate-600 text-sm transition-all cursor-pointer"
              >
                <span className="w-8 h-px bg-slate-300 group-hover:w-16 transition-all duration-500"></span>
                寻觅下一个灵魂
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
