import React, { useState, useEffect } from 'react';
import { Clock, Zap, Server, Monitor, ShieldCheck } from 'lucide-react';
import { TimeMode } from '../types';

interface HeaderProps {
  timeMode: TimeMode;
  setTimeMode: (mode: TimeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ timeMode, setTimeMode }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [serverTimeOffset, setServerTimeOffset] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Update clock every 10ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10);
    return () => clearInterval(timer);
  }, []);

  const handleSyncServerTime = async () => {
    setIsSyncing(true);
    try {
      const start = performance.now();
      const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      const rtt = performance.now() - start;
      const dateHeader = res.headers.get('Date');
      if (dateHeader) {
        const serverTimeMs = new Date(dateHeader).getTime() + (rtt / 2);
        const offset = serverTimeMs - Date.now();
        setServerTimeOffset(offset);
      }
    } catch {
      setServerTimeOffset(0);
    } finally {
      setIsSyncing(false);
    }
  };

  const formattedLocalTime = () => {
    const d = new Date(currentTime.getTime() + (serverTimeOffset || 0));
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                  보조금 신청서 작성 자동 클릭 스크립트 생성기
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  v2.0 Professional Edition
                </span>
              </div>
              <p className="text-xs text-slate-500">
                목표 시간에 맞춰 <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-[11px]">신청서 작성</code> 버튼을 초정밀 자동 클릭하는 자바스크립트 매크로를 생성합니다.
              </p>
            </div>
          </div>

          {/* Live Clock Display Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2 flex items-center justify-between md:justify-end gap-4 shrink-0 shadow-2xs">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>실시간 시계 {timeMode === 'server' ? '(서버 보정)' : '(브라우저)'}</span>
                {serverTimeOffset !== null && (
                  <span className="text-emerald-600 font-mono font-bold text-[10px]">
                    ({serverTimeOffset >= 0 ? `+${Math.round(serverTimeOffset)}ms` : `${Math.round(serverTimeOffset)}ms`})
                  </span>
                )}
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {formattedLocalTime()}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncServerTime}
              disabled={isSyncing}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 shrink-0"
            >
              {isSyncing ? '측정중...' : '서버시간 측정'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

