import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Server, Monitor, Sparkles, Timer } from 'lucide-react';
import { ScriptConfig } from '../types';

interface TimeConfigCardProps {
  config: ScriptConfig;
  onChange: (updated: Partial<ScriptConfig>) => void;
}

export const TimeConfigCard: React.FC<TimeConfigCardProps> = ({ config, onChange }) => {
  const [remainingMs, setRemainingMs] = useState<number>(0);

  // Calculate target date timestamp and remaining time
  useEffect(() => {
    const calculateTime = () => {
      try {
        const msFormatted = String(config.milliseconds).padStart(3, '0');
        const targetDateTimeStr = `${config.targetDate}T${config.targetTime}.${msFormatted}`;
        const targetTimeMs = new Date(targetDateTimeStr).getTime();
        const diff = targetTimeMs - Date.now();
        setRemainingMs(diff);
      } catch {
        setRemainingMs(0);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 50);
    return () => clearInterval(interval);
  }, [config.targetDate, config.targetTime, config.milliseconds]);

  const applyOffsetMinutes = (minutes: number) => {
    const future = new Date(Date.now() + minutes * 60 * 1000);
    const dateStr = future.toISOString().split('T')[0];
    const hours = String(future.getHours()).padStart(2, '0');
    const mins = String(future.getMinutes()).padStart(2, '0');
    const secs = String(future.getSeconds()).padStart(2, '0');
    onChange({
      targetDate: dateStr,
      targetTime: `${hours}:${mins}:${secs}`,
      milliseconds: 0,
    });
  };

  const applyOffsetSeconds = (seconds: number) => {
    const future = new Date(Date.now() + seconds * 1000);
    const dateStr = future.toISOString().split('T')[0];
    const hours = String(future.getHours()).padStart(2, '0');
    const mins = String(future.getMinutes()).padStart(2, '0');
    const secs = String(future.getSeconds()).padStart(2, '0');
    onChange({
      targetDate: dateStr,
      targetTime: `${hours}:${mins}:${secs}`,
      milliseconds: 0,
    });
  };

  const applyFixedTime = (hoursStr: string) => {
    const today = new Date();
    const [h, m, s] = hoursStr.split(':').map(Number);
    const targetToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, s);
    
    let targetDateObj = today;
    if (targetToday.getTime() <= today.getTime()) {
      targetDateObj = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }

    const dateStr = targetDateObj.toISOString().split('T')[0];
    onChange({
      targetDate: dateStr,
      targetTime: hoursStr,
      milliseconds: 0,
    });
  };

  const formatRemainingText = () => {
    if (remainingMs <= 0) {
      return { text: '설정한 목표 시간이 지났습니다', isPast: true };
    }
    const totalSecs = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const ms = remainingMs % 1000;

    const parts = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (mins > 0 || hours > 0) parts.push(`${mins}분`);
    parts.push(`${secs}.${String(ms).padStart(3, '0')}초`);

    return { text: `${parts.join(' ')} 남음`, isPast: false };
  };

  const remainingInfo = formatRemainingText();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="bg-blue-50 text-blue-600 font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase inline-block mb-1 border border-blue-100">
            Step 01
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">목표 클릭 시간 및 모드 설정</h2>
          <p className="text-xs text-slate-500">신청 버튼이 활성화되는 정확한 날짜와 시각을 입력하세요.</p>
        </div>

        {/* Remaining Badge */}
        <div
          className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono flex items-center gap-1.5 self-start sm:self-auto ${
            remainingInfo.isPast
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>{remainingInfo.text}</span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          빠른 목표시간 설정 (프리셋)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => applyOffsetSeconds(10)}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700"
          >
            +10초 후 (테스트)
          </button>
          <button
            type="button"
            onClick={() => applyOffsetSeconds(30)}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700"
          >
            +30초 후
          </button>
          <button
            type="button"
            onClick={() => applyOffsetMinutes(1)}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700"
          >
            +1분 후
          </button>
          <button
            type="button"
            onClick={() => applyFixedTime('09:00:00')}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700 font-mono"
          >
            09:00:00
          </button>
          <button
            type="button"
            onClick={() => applyFixedTime('10:00:00')}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700 font-mono"
          >
            10:00:00
          </button>
          <button
            type="button"
            onClick={() => applyFixedTime('14:00:00')}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-md transition-colors text-slate-700 font-mono"
          >
            14:00:00
          </button>
        </div>
      </div>

      {/* Target Date / Time Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            목표 날짜 (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={config.targetDate}
            onChange={(e) => onChange({ targetDate: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        {/* Time Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            목표 시간 (HH:mm:ss)
          </label>
          <input
            type="time"
            step="1"
            value={config.targetTime}
            onChange={(e) => onChange({ targetTime: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        {/* Millisecond Precision Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>밀리초 정밀도 (0~999ms)</span>
            <span className="text-[10px] text-blue-600 font-normal lowercase">ms precision</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="999"
              value={config.milliseconds}
              onChange={(e) => {
                const val = Math.min(999, Math.max(0, parseInt(e.target.value) || 0));
                onChange({ milliseconds: val });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
              placeholder="0"
            />
            <span className="text-xs font-mono text-slate-500 font-medium">ms</span>
          </div>
        </div>
      </div>

      {/* Time Mode Selection */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          동기화 모드 선택 (Time Mode)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Server Time Option */}
          <button
            type="button"
            onClick={() => onChange({ timeMode: 'server' })}
            className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
              config.timeMode === 'server'
                ? 'bg-blue-50/90 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-md mt-0.5 ${config.timeMode === 'server' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Server className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-bold flex items-center gap-1.5 text-blue-900">
                <span>Option A: 서버 시간 동기화</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white rounded font-normal">권장</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                대상 서버의 HTTP Date 헤더로 시계 오차를 자동 보정합니다. (선착순 보조금 신청 필수)
              </p>
            </div>
          </button>

          {/* Browser Local Time Option */}
          <button
            type="button"
            onClick={() => onChange({ timeMode: 'browser' })}
            className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
              config.timeMode === 'browser'
                ? 'bg-blue-50/90 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
            }`}
          >
            <div className={`p-2 rounded-md mt-0.5 ${config.timeMode === 'browser' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              <Monitor className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-800">Option B: 로컬 브라우저 시간</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                사용자 PC/스마트폰 시계(<code className="font-mono text-slate-700">Date.now()</code>)를 직접 사용합니다.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

