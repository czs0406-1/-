
import React from 'react';
import { DrugAnalysis } from '../types';

interface ResultCardProps {
  data: DrugAnalysis;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  if (data.status === 'error' || !data.data) return null;

  const { identity, narrative, ui_design, interaction } = data.data;

  return (
    <div className="fade-in max-w-3xl mx-auto">
      {/* 顶部开场白 */}
      <div className="mb-8 text-center animate-in slide-in-from-top duration-700">
        <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-2">Greeting / 初见</p>
        <p className="serif text-xl italic" style={{ color: ui_design.accent_color }}>
          “{interaction.greeting}”
        </p>
      </div>

      <div 
        className="rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-1000 border border-white/20"
        style={{ backgroundColor: 'white' }}
      >
        <div className="flex flex-col md:flex-row min-h-[550px]">
          
          {/* 左侧：人格侧写 */}
          <div 
            className="md:w-72 p-10 flex flex-col justify-between items-center text-center border-r border-slate-50"
            style={{ backgroundColor: `${ui_design.background_color}40` }}
          >
            <div className="space-y-6">
              <div 
                className="w-24 h-24 rounded-full mx-auto flex items-center justify-center border-2 p-1"
                style={{ borderColor: ui_design.primary_color }}
              >
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center serif text-3xl font-bold text-white shadow-inner"
                  style={{ backgroundColor: ui_design.primary_color }}
                >
                  {identity.name_cn.charAt(0)}
                </div>
              </div>
              <div>
                <h2 className="serif text-3xl font-bold tracking-tight text-slate-800 mb-1">
                  {identity.name_cn}
                </h2>
                <span 
                  className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase border"
                  style={{ color: ui_design.primary_color, borderColor: `${ui_design.primary_color}40` }}
                >
                  {identity.personality_type}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black">药理内核</p>
              <p className="text-xs leading-relaxed text-slate-500 italic px-2">
                {identity.scientific_fact}
              </p>
            </div>

            <div className="w-12 h-px bg-slate-200"></div>
          </div>

          {/* 右侧：内心世界 */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            {/* 性格金句 */}
            <div className="mb-12 relative">
              <span className="absolute -top-10 -left-6 text-8xl opacity-10 serif italic select-none" style={{ color: ui_design.primary_color }}>“</span>
              <p className="relative z-10 serif text-2xl md:text-3xl font-medium leading-snug text-slate-700 italic">
                {narrative.quote}
              </p>
            </div>

            {/* 内心独白 */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Monologue / 内心独白</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <p className="text-slate-600 leading-relaxed text-base font-light indent-8">
                  {narrative.monologue}
                </p>
              </section>

              {/* 三行诗 */}
              <section className="pt-4">
                <div 
                  className="p-8 rounded-2xl relative overflow-hidden group border border-slate-50"
                  style={{ backgroundColor: `${ui_design.background_color}20` }}
                >
                  <div 
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: ui_design.accent_color }}
                  ></div>
                  <pre className="serif text-lg text-slate-700 whitespace-pre-wrap leading-loose italic">
                    {narrative.poem}
                  </pre>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
