import React, { useState } from 'react';
import { Target, Code, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { ScriptConfig } from '../types';

interface TargetElementCardProps {
  config: ScriptConfig;
  onChange: (updated: Partial<ScriptConfig>) => void;
}

export const TargetElementCard: React.FC<TargetElementCardProps> = ({ config, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <span className="bg-blue-50 text-blue-600 font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase inline-block mb-1 border border-blue-100">
          Step 02
        </span>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">클릭 대상 요소 (버튼) 설정</h2>
        <p className="text-xs text-slate-500">목표 페이지에서 자동 탐색하여 클릭할 버튼 매칭 정보를 확인 및 수정합니다.</p>
      </div>

      {/* Target HTML Spec Highlight Box */}
      <div className="bg-[#1E293B] rounded-lg p-3.5 sm:p-4 text-slate-200 space-y-2 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            감지된 타겟 HTML 명세:
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
            무공해차 보조금 지원 시스템
          </span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-md border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
          <code>
            &lt;<span className="text-blue-400">button</span> <span className="text-amber-300">type</span>=<span className="text-emerald-300">"button"</span> <span className="text-amber-300">class</span>=<span className="text-emerald-300">"btn-blue"</span> <span className="text-amber-300">onclick</span>=<span className="text-emerald-300">"location.href='/ev_ps/ps/seller/sellerApplyWrite?car_type=11';return false;"</span>&gt;<span className="text-white font-bold">신청서 작성</span>&lt;/<span className="text-blue-400">button</span>&gt;
          </code>
        </div>
      </div>

      {/* Input customization grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custom Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            버튼 텍스트 키워드 (innerText)
          </label>
          <input
            type="text"
            value={config.customText}
            onChange={(e) => onChange({ customText: e.target.value })}
            placeholder="신청서 작성"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
          />
          <p className="text-[11px] text-slate-500">버튼 내부의 글자('신청서 작성')가 들어있는 요소를 탐색합니다.</p>
        </div>

        {/* Custom Onclick Keyword */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            버튼 onclick 속성 키워드
          </label>
          <input
            type="text"
            value={config.customOnclick}
            onChange={(e) => onChange({ customOnclick: e.target.value })}
            placeholder="sellerApplyWrite"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
          />
          <p className="text-[11px] text-slate-500">onclick 자바스크립트 함수명 키워드로 추가 검증합니다.</p>
        </div>
      </div>

      {/* Toggle Advanced Performance Options */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>고급 정밀도 및 연타 설정 {showAdvanced ? '접기' : '열기'}</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            {/* Check Interval */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">타이머 체크 주기 (Interval)</label>
              <select
                value={config.checkIntervalMs}
                onChange={(e) => onChange({ checkIntervalMs: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800"
              >
                <option value={5}>5ms (최고 정밀도)</option>
                <option value={10}>10ms (기본 권장값)</option>
                <option value={20}>20ms (표준)</option>
                <option value={50}>50ms (저사양 권장)</option>
              </select>
              <p className="text-[10px] text-slate-500">목표 시각 점검 주기를 지정합니다.</p>
            </div>

            {/* Early Offset */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">사전 보정 오프셋 (Latency Offset)</label>
              <select
                value={config.offsetMs}
                onChange={(e) => onChange({ offsetMs: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800"
              >
                <option value={0}>0ms (정시 클릭)</option>
                <option value={10}>-10ms 먼저 클릭</option>
                <option value={20}>-20ms 먼저 클릭</option>
                <option value={50}>-50ms 먼저 클릭</option>
                <option value={100}>-100ms 먼저 클릭</option>
              </select>
              <p className="text-[10px] text-slate-500">네트워크 지연 보정을 위한 사전 발사시간입니다.</p>
            </div>

            {/* Retry Count */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">연속 클릭 횟수 (Retry Count)</label>
              <select
                value={config.retryCount}
                onChange={(e) => onChange({ retryCount: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800"
              >
                <option value={1}>1회 단발 클릭</option>
                <option value={2}>2회 연속 클릭 (50ms 간격)</option>
                <option value={3}>3회 연속 클릭 (50ms 간격)</option>
                <option value={5}>5회 연속 클릭 (50ms 간격)</option>
              </select>
              <p className="text-[10px] text-slate-500">클릭 유실을 방지하기 위한 연속 클릭 연타 수입니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

