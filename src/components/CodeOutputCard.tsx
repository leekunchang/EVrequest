import React, { useState } from 'react';
import { Copy, Check, Play, Sparkles, AlertCircle } from 'lucide-react';
import { ScriptConfig } from '../types';
import { generateScript } from '../utils/scriptGenerator';

interface CodeOutputCardProps {
  config: ScriptConfig;
  onOpenSimulation: () => void;
}

export const CodeOutputCard: React.FC<CodeOutputCardProps> = ({ config, onOpenSimulation }) => {
  const [isAdvancedScript, setIsAdvancedScript] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generatedCode = generateScript(config, isAdvancedScript);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = generatedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <span className="bg-blue-50 text-blue-600 font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase inline-block mb-1 border border-blue-100">
            Step 03
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">생성된 매크로 자바스크립트 스크립트</h2>
          <p className="text-xs text-slate-500">목표 페이지의 F12 개발자도구 콘솔창에 복사하여 붙여넣으세요.</p>
        </div>

        {/* Script Type Switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto border border-slate-200/60">
          <button
            type="button"
            onClick={() => setIsAdvancedScript(false)}
            className={`px-3 py-1.5 rounded-md transition-all ${
              !isAdvancedScript ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            기본 스크립트 (경량)
          </button>
          <button
            type="button"
            onClick={() => setIsAdvancedScript(true)}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
              isAdvancedScript ? 'bg-blue-600 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            고급 스크립트 (연타/보정)
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative group">
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>클립보드로 복사</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Box */}
        <pre className="bg-[#1E293B] text-slate-200 rounded-lg p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 max-h-[380px] scrollbar-thin scrollbar-thumb-slate-700">
          <code>{generatedCode}</code>
        </pre>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>F12 <strong className="text-slate-700 font-semibold">Console (콘솔)</strong> 탭에 붙여넣고 Enter 키를 누르시면 예약 동작합니다.</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Test Simulation Button */}
          <button
            type="button"
            onClick={onOpenSimulation}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>앱 내 시뮬레이션 테스트</span>
          </button>
        </div>
      </div>
    </div>
  );
};

