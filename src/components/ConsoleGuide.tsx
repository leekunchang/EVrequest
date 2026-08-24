import { useState } from 'react';
import { Terminal, ShieldAlert, Copy, Check, AlertCircle, ShieldCheck, Crosshair, Sparkles, CheckCircle2 } from 'lucide-react';

export function ConsoleGuide() {
  const [copiedAllowPasting, setCopiedAllowPasting] = useState(false);
  const [copiedQuickCheck, setCopiedQuickCheck] = useState(false);
  const [copiedTestCmd1, setCopiedTestCmd1] = useState(false);
  const [copiedTestCmd2, setCopiedTestCmd2] = useState(false);

  const handleCopyAllow = () => {
    navigator.clipboard.writeText('allow pasting');
    setCopiedAllowPasting(true);
    setTimeout(() => setCopiedAllowPasting(false), 2000);
  };

  const quickCheckCode = `document.querySelector('#editForm > div.order-button-group.mb25 > button:nth-child(7)')`;

  const handleCopyCheck = () => {
    navigator.clipboard.writeText(quickCheckCode);
    setCopiedQuickCheck(true);
    setTimeout(() => setCopiedQuickCheck(false), 2000);
  };

  // 즉시 팝업을 띄우는 직통 명령어들
  const testCmd1 = `document.querySelector('#editForm > div.order-button-group.mb25 > button:nth-child(7)').click();`;
  const testCmd2 = `eval(document.querySelector('#editForm > div.order-button-group.mb25 > button:nth-child(7)').getAttribute('onclick'));`;

  const handleCopyTest1 = () => {
    navigator.clipboard.writeText(testCmd1);
    setCopiedTestCmd1(true);
    setTimeout(() => setCopiedTestCmd1(false), 2000);
  };

  const handleCopyTest2 = () => {
    navigator.clipboard.writeText(testCmd2);
    setCopiedTestCmd2(true);
    setTimeout(() => setCopiedTestCmd2(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Why popup didn't show diagnosis banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
        <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
          <span>💡 [핵심 원인 분석] 왜 콘솔 명령어 실행 시 화면에 "지원신청" 팝업이 안 떴을까요?</span>
        </div>
        <div className="text-xs text-blue-900 space-y-2 pl-7 leading-relaxed">
          <p>
            1. <strong>Confirm 팝업 자동 승인(Bypass) 가동</strong>:
            기존 자동화 스크립트는 정시 0.001초 제출을 위해 브라우저의 <code>confirm()</code> 확인창을 가로채어 <strong>화면에 팝업을 띄우지 않고 백그라운드에서 즉시 승인(true) 처리</strong>하도록 설정되어 있었습니다. 이 때문에 사용자 눈에는 "팝업이 안 뜨니 작동하지 않는 것"처럼 보였습니다.
          </p>
          <p>
            2. <strong>v4.0 즉시 개선 조치</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 font-medium text-slate-800">
            <li>
              <strong>팝업 표시 모드 자유 전환</strong>: 상단 설정에서 <strong>[💬 팝업창 실제 노출]</strong>을 켜면 영상처럼 화면에 <strong className="text-blue-700">"지원신청서를 제출 하시겠습니까?"</strong> 확인창이 100% 그대로 뜹니다.
            </li>
            <li>
              <strong>삭제/수정 버튼 절대 클릭 차단</strong>: 제공해주신 <code>#editForm button:nth-child(7)</code> 경로로 오직 "지원신청" 버튼만 타겟팅합니다.
            </li>
          </ul>
        </div>
      </div>

      {/* 1-Second Instant Test Box for User */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-xl text-slate-200 space-y-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">
              [1초 즉시 테스트] 콘솔에 아래 1줄을 입력하면 화면에 즉시 팝업이 뜹니다!
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            영상 확인용
          </span>
        </div>

        {/* Command 1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-blue-400">1순위: DOM Native Click (가장 권장)</span>
            <button
              type="button"
              onClick={handleCopyTest1}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition flex items-center gap-1 shadow-xs"
            >
              {copiedTestCmd1 ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTestCmd1 ? '복사됨' : '명령어 복사'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
            {testCmd1}
          </div>
        </div>

        {/* Command 2 */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-blue-400">2순위: onclick 속성 직접 실행</span>
            <button
              type="button"
              onClick={handleCopyTest2}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition flex items-center gap-1 border border-slate-700"
            >
              {copiedTestCmd2 ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTestCmd2 ? '복사됨' : '명령어 복사'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 break-all select-all">
            {testCmd2}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              크롬 개발자 도구(Console) v4.0 실행 4단계
            </h3>
            <p className="text-xs text-slate-500">
              신청서 화면에서 그대로 붙여넣어 실행하는 표준 절차입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                1단계
              </span>
              <span className="text-xs font-mono text-slate-400">Target URL</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">신청서 작성 완료 상태 유지</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              <strong>/ev_ps/ps/seller/sellerApplyform</strong> 화면에서 신청서 작성을 끝내고,
              하단에 파란색 <strong className="text-blue-600">[지원신청]</strong> 버튼이 보이는 상태를 유지합니다.
            </p>
          </div>
          <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
            ⚠️ 이 상태에서 페이지를 새로고침(F5)하지 마세요.
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                2단계
              </span>
              <span className="text-xs font-mono text-slate-400">F12 / Cmd+Option+I</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">콘솔(Console) 창 열기</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              키보드의 <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">F12</kbd> (Mac: <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-800 font-mono shadow-xs">Cmd + Option + I</kbd>)를 누르고,
              우측 또는 하단 개발자 도구의 <strong>[Console]</strong> 탭을 클릭합니다.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 font-mono">
            DevTools &gt; Console 탭의 커서(<span className="text-blue-600 font-bold">&gt;</span>) 확인
          </div>
        </div>

        {/* Step 3 (Crucial: allow pasting) */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900">
                3단계 (보안 해제)
              </span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-sm font-bold text-amber-950">붙여넣기 차단 해제 ('allow pasting')</h4>
            <p className="text-xs text-amber-900 leading-relaxed mt-1">
              크롬 콘솔에 코드가 안 붙여넣어지는 경우, 콘솔창 입력줄에 영문으로 <strong className="text-red-700 font-mono">allow pasting</strong>을 타이핑하고 <kbd className="px-1 bg-white border rounded">Enter</kbd>를 누르면 즉시 잠금이 풀립니다.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 bg-white/90 p-2 rounded-lg border border-amber-300">
            <span className="text-xs font-mono font-bold text-slate-800">allow pasting</span>
            <button
              type="button"
              onClick={handleCopyAllow}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1"
            >
              {copiedAllowPasting ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAllowPasting ? '복사됨' : '단어 복사'}</span>
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                4단계
              </span>
              <span className="text-xs font-mono text-slate-400">Run Script</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">스크립트 붙여넣기 및 사전 점검 확인</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              상단의 <strong>[코드 전체 복사]</strong> 버튼을 누른 후, 콘솔창에 붙여넣고 <kbd className="px-1.5 py-0.5 bg-white border rounded text-slate-800 font-mono shadow-xs">Enter</kbd>를 누릅니다.
              콘솔에 <span className="text-emerald-600 font-bold">[사전점검 성공] ✅ "지원신청" 버튼 타겟팅 100% 완료!</span> 문구가 뜨면 완벽히 준비된 것입니다!
            </p>
          </div>
          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>HUD의 <strong>[🧪 지원신청 1회 시험]</strong>을 눌러 사전 안전 테스트 가능</span>
          </div>
        </div>
      </div>
    </div>
  );
}
