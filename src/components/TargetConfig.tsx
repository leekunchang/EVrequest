import { useState, useEffect } from 'react';
import { ScriptConfig } from '../types';
import { getPresetTarget } from '../utils/timeUtils';
import { Clock, Calendar, Sliders, LayoutTemplate, Sparkles, CheckCircle2, ShieldCheck, Crosshair, Ban, MessageSquare, EyeOff } from 'lucide-react';

interface TargetConfigProps {
  config: ScriptConfig;
  onChange: (newConfig: ScriptConfig) => void;
}

export function TargetConfig({ config, onChange }: TargetConfigProps) {
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const timeStr = d.toLocaleTimeString('ko-KR', { hour12: false });
      const ms = String(d.getMilliseconds()).padStart(3, '0');
      setCurrentLocalTime(`${timeStr}.${ms}`);
    };
    update();
    const interval = setInterval(update, 50);
    return () => clearInterval(interval);
  }, []);

  const handlePreset = (type: 'today-9am' | 'today-10am' | 'today-2pm' | 'plus-10s' | 'plus-30s' | 'plus-1m') => {
    const preset = getPresetTarget(type);
    onChange({
      ...config,
      targetDate: preset.date,
      targetTime: preset.time,
      targetMillis: preset.millis,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Top Banner with Clock */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">신청 목표 시각 및 정밀 타겟 설정</h2>
            <p className="text-xs text-slate-500">신청 개시 정각 또는 원하는 시각을 설정하세요</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">현재 로컬 시각:</span>
          <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">{currentLocalTime}</span>
        </div>
      </div>

      {/* Target Selector Verification Box */}
      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Crosshair className="w-4 h-4 text-emerald-600" />
            검증된 타겟 요소 정보 (JS Path / XPath / Element 바인딩 완료)
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            삭제/수정 버튼 오작동 원천 차단됨
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-white p-2 rounded border border-emerald-200 text-slate-700">
            <span className="text-slate-400 block text-[10px] font-sans font-semibold">Selector (1순위):</span>
            <span className="text-blue-700 font-bold break-all">#editForm &gt; div.order-button-group.mb25 &gt; button:nth-child(7)</span>
          </div>
          <div className="bg-white p-2 rounded border border-emerald-200 text-slate-700">
            <span className="text-slate-400 block text-[10px] font-sans font-semibold">XPath (2순위):</span>
            <span className="text-blue-700 font-bold break-all">//*[@id="editForm"]/div[7]/button[7]</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-900 pt-1">
          <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span><strong>안전 방어벽 작동:</strong> 텍스트에 "삭제", "수정"이 있거나 `goDelete` 등의 속성을 가진 버튼은 탐색에서 100% 강제 배제됩니다.</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
          ⚡ 빠른 목표 시각 프리셋
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => handlePreset('today-9am')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 transition flex flex-col items-center justify-center text-center"
          >
            <span>오늘 09:00:00</span>
            <span className="text-[10px] text-slate-400 font-normal">오전 9시 정각</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('today-10am')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 transition flex flex-col items-center justify-center text-center"
          >
            <span>오늘 10:00:00</span>
            <span className="text-[10px] text-slate-400 font-normal">오전 10시 정각</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('today-2pm')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 transition flex flex-col items-center justify-center text-center"
          >
            <span>오늘 14:00:00</span>
            <span className="text-[10px] text-slate-400 font-normal">오후 2시 정각</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('plus-10s')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 hover:border-amber-400 text-amber-900 transition flex flex-col items-center justify-center text-center"
          >
            <span>10초 후 테스트</span>
            <span className="text-[10px] text-amber-600 font-normal">즉시 검증</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('plus-30s')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 hover:border-amber-400 text-amber-900 transition flex flex-col items-center justify-center text-center"
          >
            <span>30초 후 테스트</span>
            <span className="text-[10px] text-amber-600 font-normal">여유로운 검증</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('plus-1m')}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/80 hover:border-amber-400 text-amber-900 transition flex flex-col items-center justify-center text-center"
          >
            <span>1분 후 테스트</span>
            <span className="text-[10px] text-amber-600 font-normal">정밀 시뮬레이션</span>
          </button>
        </div>
      </div>

      {/* Detailed Target Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            목표 날짜 (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={config.targetDate}
            onChange={(e) => onChange({ ...config, targetDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm bg-slate-50/40"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            목표 시각 (HH:mm:ss)
          </label>
          <input
            type="time"
            step="1"
            value={config.targetTime}
            onChange={(e) => onChange({ ...config, targetTime: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm bg-slate-50/40 font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center justify-between">
            <span>선제 오프셋 (Early Offset)</span>
            <span className="text-[11px] text-blue-600 font-mono font-bold">
              {config.earlyOffsetMs > 0 ? `+${config.earlyOffsetMs}ms (기본 권장)` : `${config.earlyOffsetMs}ms`}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.earlyOffsetMs}
              onChange={(e) => onChange({ ...config, earlyOffsetMs: Number(e.target.value) || 0 })}
              placeholder="100"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm bg-slate-50/40 font-mono"
            />
            <span className="text-xs text-slate-400 font-medium">ms</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            * 기본값: <strong>+100ms</strong> (네트워크 지연 및 서버 반영 타이밍 고려)
          </p>
        </div>
      </div>

      {/* Advanced Toggles */}
      <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>팝업 동작 방식 및 고급 실행 옵션</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Popup Control (Crucial) */}
          <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
            !config.bypassConfirm ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300' : 'bg-white border-slate-200/90 hover:border-blue-300'
          }`}>
            <input
              type="checkbox"
              checked={!config.bypassConfirm}
              onChange={(e) => onChange({ ...config, bypassConfirm: !e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-bold text-slate-900 block flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                화면에 실제 팝업 띄우기
              </span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                체크 시 영상처럼 "지원신청서를 제출..." 확인창이 화면에 실제로 나타납니다.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-slate-200/90 cursor-pointer hover:border-blue-300 transition">
            <input
              type="checkbox"
              checked={config.showFloatingHud}
              onChange={(e) => onChange({ ...config, showFloatingHud: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-semibold text-slate-800 block flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                플로팅 HUD (실행 시 자동 소멸)
              </span>
              <span className="text-[11px] text-slate-500">정시 도달 후 코드가 실행되면 HUD 화면이 즉시 사라집니다.</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-slate-200/90 cursor-pointer hover:border-blue-300 transition">
            <input
              type="checkbox"
              checked={config.playBeepOnTrigger}
              onChange={(e) => onChange({ ...config, playBeepOnTrigger: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-semibold text-slate-800 block">실행 알림 비프음</span>
              <span className="text-[11px] text-slate-500">정시 실행 즉시 비프 사운드 재생</span>
            </div>
          </label>

          <div className="p-3 bg-white rounded-lg border border-slate-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">RTT 측정 횟수</span>
              <span className="font-mono text-blue-600 font-bold">{config.rttSamples}회</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange({ ...config, rttSamples: num })}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded ${
                    config.rttSamples === num
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } transition`}
                >
                  {num}회
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
