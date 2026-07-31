import React, { useState, useEffect, useRef } from 'react';
import { X, Play, CheckCircle2, Terminal, Monitor, Flame } from 'lucide-react';
import { ScriptConfig } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ScriptConfig;
}

interface ConsoleLogItem {
  id: string;
  type: 'log' | 'info' | 'success' | 'warn' | 'error';
  text: string;
  timestamp: string;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose, config }) => {
  const [logs, setLogs] = useState<ConsoleLogItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [remainingTimeText, setRemainingTimeText] = useState<string>('00:00:00.000');
  const [, setSimTargetMs] = useState<number>(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const addLog = (text: string, type: ConsoleLogItem['type'] = 'log') => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setLogs((prev) => [...prev, { id: Math.random().toString(), type, text, timestamp: ts }]);
  };

  const startTestCountdown = (customOffsetSecs?: number) => {
    setLogs([]);
    setClicked(false);
    setIsRunning(true);

    let targetMs: number;
    if (customOffsetSecs) {
      targetMs = Date.now() + customOffsetSecs * 1000;
    } else {
      const msStr = String(config.milliseconds).padStart(3, '0');
      targetMs = new Date(`${config.targetDate}T${config.targetTime}.${msStr}`).getTime();
    }

    setSimTargetMs(targetMs);

    addLog(`[시뮬레이터 시작] 목표 시각: ${new Date(targetMs).toLocaleString('ko-KR')}.${String(targetMs % 1000).padStart(3, '0')}`, 'info');
    addLog(`동기화 모드: ${config.timeMode === 'server' ? '서버 시간 보정' : '브라우저 시간'}, 오프셋: ${config.offsetMs}ms`, 'log');

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = targetMs - config.offsetMs - now;

      if (remaining <= 0) {
        clearInterval(timer);
        setIsRunning(false);
        setRemainingTimeText('00:00:00.000');

        addLog('🚀 [목표 시간 도달!] 버튼을 탐색하고 클릭을 시도합니다.', 'success');

        if (buttonRef.current) {
          buttonRef.current.click();
        } else {
          addLog('❌ 버튼을 찾지 못했습니다.', 'error');
        }
      } else {
        const totalSecs = Math.floor(remaining / 1000);
        const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
        const secs = String(totalSecs % 60).padStart(2, '0');
        const ms = String(remaining % 1000).padStart(3, '0');
        setRemainingTimeText(`00:${mins}:${secs}.${ms}`);
      }
    }, config.checkIntervalMs || 10);
  };

  const handleMockButtonClick = () => {
    setClicked(true);
    addLog(`✅ [클릭 이벤트 성공] 버튼이 성공적으로 클릭되었습니다! (onclick="location.href='/ev_ps/ps/seller/sellerApplyWrite?car_type=11'")`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1E293B] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-md">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">신청서 페이지 자동 클릭 시뮬레이션</h3>
              <p className="text-xs text-slate-400">앱 내에서 타이머 및 버튼 감지 동작을 실시간으로 테스트합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Simulation Launcher Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">목표 남은 시간</span>
              <div className="text-2xl font-bold font-mono text-blue-600">
                {remainingTimeText}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startTestCountdown(5)}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>+5초 후 테스트 실행</span>
              </button>
              <button
                type="button"
                onClick={() => startTestCountdown()}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>설정한 시간으로 테스트</span>
              </button>
            </div>
          </div>

          {/* Mock Application Webpage DOM Canvas */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
            {/* Mock Browser Header */}
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white px-3 py-0.5 rounded text-xs font-mono text-slate-600 flex-1 ml-2 border border-slate-200 truncate">
                https://ev.or.kr/ev_ps/ps/seller/sellerApplyWrite?car_type=11
              </div>
            </div>

            {/* Mock Page Content */}
            <div className="p-6 bg-slate-50/50 min-h-[160px] flex flex-col items-center justify-center space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">무공해차 보조금 지원 시스템</span>
                <h4 className="text-base font-bold text-slate-800">2026년 전기차 보조금 구매 지원 신청서</h4>
                <p className="text-xs text-slate-500">목표 시각이 되면 아래 버튼이 자동으로 클릭됩니다.</p>
              </div>

              {/* Target Button requested in user prompt */}
              <div className="pt-2">
                <button
                  ref={buttonRef}
                  type="button"
                  className={`px-6 py-2.5 rounded-md font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    clicked
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 scale-105'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 active:scale-95'
                  }`}
                  onClick={handleMockButtonClick}
                >
                  {clicked ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>신청서 작성 완료 (클릭됨!)</span>
                    </>
                  ) : (
                    <span>신청서 작성</span>
                  )}
                </button>
              </div>

              {clicked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-semibold animate-bounce text-center">
                  🎉 축하합니다! 자동 클릭 매크로 스크립트가 성공적으로 버튼을 눌렀습니다!
                </div>
              )}
            </div>
          </div>

          {/* Virtual Browser Developer Console Log View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-500" />
                가상 F12 개발자 도구 콘솔 (Console Log Output)
              </span>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-slate-400 hover:text-slate-600 text-[11px] underline cursor-pointer"
              >
                콘솔 지우기
              </button>
            </div>

            <div className="bg-[#1E293B] text-slate-200 rounded-lg p-4 font-mono text-xs h-[180px] overflow-y-auto space-y-1.5 border border-slate-800">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic text-center pt-12">
                  테스트 버튼을 눌러 시뮬레이션을 시작하면 콘솔 로그가 출력됩니다.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-slate-800/60 pb-1">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={`break-all ${
                        log.type === 'success'
                          ? 'text-emerald-400 font-bold'
                          : log.type === 'info'
                          ? 'text-blue-400'
                          : log.type === 'error'
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log.text}
                    </span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

