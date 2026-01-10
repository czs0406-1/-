
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ResultCard } from './components/ResultCard';
import { AppStatus, DrugAnalysis } from './types';
import { analyzeDrug } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [drugName, setDrugName] = useState('');
  const [result, setResult] = useState<DrugAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result?.toString().split(',')[1];
      if (base64Data) {
        processAnalysis({ data: base64Data, mimeType: file.type });
      }
    };
    reader.readAsDataURL(file);
  };

  const processAnalysis = async (input: string | { data: string, mimeType: string }) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setError(null);
    try {
      const analysis = await analyzeDrug(input);
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

  return (
    <Layout>
      <div className="space-y-12">
        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="max-w-xl mx-auto space-y-10 pt-4">
            <div className="text-center space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase border border-white/20 shadow-sm">
                Herbal Heart-Whisper • 本草心语
              </div>
              <p className="text-slate-500 leading-relaxed font-light text-lg serif italic">
                “万物皆药，唯美治愈。”<br/>
                <span className="text-sm not-italic font-sans text-slate-400 block mt-2 tracking-wide">
                  唤醒药物深处的灵魂，聆听分子的第一声叹息。
                </span>
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-[2rem] shadow-xl shadow-slate-200/20 border border-white/50 flex items-center gap-3 transition-all focus-within:shadow-2xl focus-within:bg-white">
              <input
                type="text"
                placeholder="它是谁？(如: 阿司匹林 / 连翘)"
                className="flex-1 px-5 py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-300 serif text-xl"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] hover:bg-slate-800 transition-all active:scale-95 font-medium tracking-widest text-sm shadow-lg shadow-slate-200"
              >
                唤醒
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/50"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-transparent px-6 text-slate-300 tracking-[0.5em] font-bold">Or Identify by Vision</span>
              </div>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-slate-200/50 rounded-[3rem] p-12 text-center hover:border-slate-400 hover:bg-white/40 transition-all cursor-pointer relative overflow-hidden backdrop-blur-[2px]"
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleFileUpload}
              />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-500 font-medium tracking-wide">上传包装或药片图像</p>
                  <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">视觉感知模式</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl text-center text-sm border border-rose-100 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
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
                className="group inline-flex items-center gap-4 text-slate-400 hover:text-slate-600 text-sm transition-all"
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
