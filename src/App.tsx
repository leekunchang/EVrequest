import React, { useState } from 'react';
import { ScriptConfig } from './types';
import { Header } from './components/Header';
import { TimeConfigCard } from './components/TimeConfigCard';
import { TargetElementCard } from './components/TargetElementCard';
import { CodeOutputCard } from './components/CodeOutputCard';
import { InstructionGuideCard } from './components/InstructionGuideCard';
import { SimulationModal } from './components/SimulationModal';

export default function App() {
  const getInitialTargetDate = () => {
    const now = new Date();
    if (now.getHours() >= 9) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return tomorrow.toISOString().split('T')[0];
    }
    return now.toISOString().split('T')[0];
  };

  const [config, setConfig] = useState<ScriptConfig>({
    targetDate: getInitialTargetDate(),
    targetTime: '09:00:00',
    milliseconds: 0,
    timeMode: 'server',
    selectorStrategy: 'combined',
    customText: '신청서 작성',
    customOnclick: 'sellerApplyWrite',
    customSelector: "button[onclick*='sellerApplyWrite']",
    checkIntervalMs: 10,
    offsetMs: 0,
    retryCount: 1,
    retryIntervalMs: 50,
    playBeep: false,
    autoReloadIfNotFound: false,
  });

  const [isSimOpen, setIsSimOpen] = useState<boolean>(false);

  const handleConfigChange = (updated: Partial<ScriptConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        timeMode={config.timeMode}
        setTimeMode={(timeMode) => handleConfigChange({ timeMode })}
      />

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* Step 1: Time Configuration */}
        <TimeConfigCard config={config} onChange={handleConfigChange} />

        {/* Step 2: Target Button Information & Selector Strategy */}
        <TargetElementCard config={config} onChange={handleConfigChange} />

        {/* Step 3: Generated Code Output */}
        <CodeOutputCard
          config={config}
          onOpenSimulation={() => setIsSimOpen(true)}
        />

        {/* Step 4: Step-by-step Guide */}
        <InstructionGuideCard />
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM READY — AUTO CLICK SCRIPT GENERATOR</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>TARGET: EV_PS_SELLER_APPLY</span>
          <span>PRECISION: MS LEVEL</span>
        </div>
      </footer>

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={isSimOpen}
        onClose={() => setIsSimOpen(false)}
        config={config}
      />
    </div>
  );
}

