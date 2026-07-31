import React from 'react';
import { BookOpen, CheckCircle2, ShieldAlert, Keyboard } from 'lucide-react';

export const InstructionGuideCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <span className="bg-blue-50 text-blue-600 font-bold text-[11px] px-2.5 py-1 rounded tracking-wide uppercase inline-block mb-1 border border-blue-100">
          Guide
        </span>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">상세 실행 가이드 (3 Step)</h2>
        <p className="text-xs text-slate-500">생성된 자바스크립트 매크로를 목표 신청서 페이지에 적용하는 방법입니다.</p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">STEP 1</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">목표 시간 설정</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            보조금 신청 오픈 시간(예: 09:00:00.000) 및 서버시간 보정 모드를 설정합니다.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">STEP 2</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">코드 복사</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">"클립보드로 복사"</strong> 버튼을 클릭하여 스크립트 코드를 복사합니다.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">STEP 3</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">개발자도구(F12) 실행</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            목표 페이지 접속 후 <kbd className="bg-slate-200 px-1 rounded text-[11px] font-mono">F12</kbd> &gt; <strong className="text-slate-800">Console</strong> 탭에 붙여넣고 <kbd className="bg-slate-200 px-1 rounded text-[11px] font-mono">Enter</kbd>를 누르면 대기 타이머가 동작합니다.
          </p>
        </div>
      </div>

      {/* Shortcuts & Helpful Tips Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Shortcuts */}
        <div className="bg-[#1E293B] text-slate-200 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <Keyboard className="w-4 h-4" />
            <span>브라우저별 개발자 도구 단축키</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>Windows (Chrome / Edge / Whale)</span>
              <span className="text-amber-300 font-bold">F12 또는 Ctrl + Shift + J</span>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-1">
              <span>macOS (Chrome / Safari)</span>
              <span className="text-amber-300 font-bold">Cmd + Option + J</span>
            </li>
          </ul>
        </div>

        {/* Caution Tips */}
        <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-lg text-amber-900 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <ShieldAlert className="w-4 h-4" />
            <span>유의 사항 및 문제 해결</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px] leading-relaxed">
            <li>크롬의 탭 절전 기능 방지를 위해 <strong>신청서 탭을 항상 최상단 활성화</strong>해 두세요.</li>
            <li>콘솔창 붙여넣기 시 <code className="bg-amber-100 text-amber-900 px-1 rounded">allow pasting</code> 수동 입력 요구가 나올 수 있습니다.</li>
            <li>시뮬레이션 모드로 클릭 타이밍을 사전에 검증해 볼 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

