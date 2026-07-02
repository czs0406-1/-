
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-1000 text-slate-800 selection:bg-rose-100">
      <div>
        <header className="py-8 md:py-12 px-4 md:px-6 text-center">
          <h1 className="serif text-3xl md:text-4xl font-bold tracking-[0.3em] text-slate-800 drop-shadow-sm">本草·心语</h1>
          <p className="mt-2 text-slate-400 font-light tracking-[0.1em] text-[10px] md:text-xs uppercase">Herbal Heart-Whisper / PharmAesthetic</p>
        </header>
        <main className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
          {children}
        </main>
      </div>
      <footer className="py-6 text-center text-[9px] md:text-[10px] text-slate-400/60 uppercase tracking-widest font-mono mt-auto">
        Science Truth · Aesthetic Beauty · Soul Healing
      </footer>
    </div>
  );
};
