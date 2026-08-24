import { useState } from 'react';
import { ScriptConfig } from './types';
import { getTodayDateString } from './utils/timeUtils';
import { Header } from './components/Header';
import { TargetConfig } from './components/TargetConfig';
import { CodeOutput } from './components/CodeOutput';
import { SimulationSandbox } from './components/SimulationSandbox';
import { ConsoleGuide } from './components/ConsoleGuide';
import { Zap, ShieldCheck, Clock } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ScriptConfig>({
    targetDate: getTodayDateString(),
    targetTime: '09:00:00',
    targetMillis: 0,
    earlyOffsetMs: 100, // 기본값 +100ms
    rttSamples: 5,
    showFloatingHud: true,
    bypassConfirm: false, // 실제 팝업창 노출 기본
    bypassAlert: true,
    playBeepOnTrigger: true,
    retryAttempts: 1,
    retryIntervalMs: 200,
    syncMethod: 'HEAD',
    targetFunction: "goApply('101', '지원신청서를 제출 하시겠습니까?')",
    fallbackSelector: '#editForm > div.order-button-group.mb25 > button:nth-child(7)',
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Core Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">서버 시간 RTT 보정 동기화</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                ev.or.kr 서버의 <code className="text-blue-600 font-mono">Date</code> 헤더와 패킷 왕복 시간(RTT/2)을 정밀 계산하여 0ms 오차로 동기화합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">정시 즉시 실행 (+100ms 기본 오프셋)</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                <code className="text-emerald-600 font-mono">performance.now()</code>와 Busy-Spin 하이브리드 루프로 지연 없이 정시에 즉시 발동하며, 실행 즉시 HUD는 자동 소멸합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">팝업창 노출 및 자동제출 대응</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                영상 속 "지원신청서를 제출..." 확인 팝업창을 완벽히 띄우거나 자동 승인(Bypass)으로 초고속 제출할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Target Time Configuration */}
        <section>
          <TargetConfig config={config} onChange={setConfig} />
        </section>

        {/* Generated Code & Bookmarklet */}
        <section>
          <CodeOutput config={config} />
        </section>

        {/* Interactive Simulation Sandbox */}
        <section>
          <SimulationSandbox config={config} />
        </section>

        {/* Chrome DevTools Console Step-by-Step Guide */}
        <section>
          <ConsoleGuide />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            무공해차 통합누리집 (ev.or.kr) 고정밀 정시 자동 신청 스크립트 도구
          </p>
          <p className="text-[11px] text-slate-400">
            본 도구는 사용자의 원활한 신청 편의를 돕는 클라이언트 사이드 자바스크립트 자동화 유틸리티입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
