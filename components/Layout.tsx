
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen transition-colors duration-1000 text-slate-800 selection:bg-rose-100">
      <header className="py-12 px-6 text-center">
        <h1 className="serif text-4xl font-bold tracking-[0.3em] text-slate-800 drop-shadow-sm">本草·心语</h1>
        <p className="mt-3 text-slate-400 font-light tracking-[0.1em] text-xs uppercase">Herbal Heart-Whisper / PharmAesthetic</p>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-20">
        {children}
      </main>
      <footer className="fixed bottom-6 left-0 right-0 text-center text-[10px] text-slate-400/60 uppercase tracking-widest font-mono">
        Science Truth · Aesthetic Beauty · Soul Healing
      </footer>
    </div>
  );
};
