import { Zap, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                무공해차 통합누리집 정시 자동 신청기
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                ev.or.kr 전용
              </span>
            </div>
            <p className="text-xs text-slate-500">
              서버 RTT 왕복 시간 오차 보정 + 0ms 지연 정시 트리거 + Confirm 창 자동 승인
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <a
            href="https://ev.or.kr/ev_ps/ps/seller/sellerApplyform"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition font-medium"
            title="실제 무공해차 통합누리집 신청서 페이지로 이동"
          >
            <span>대상: sellerApplyform</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
