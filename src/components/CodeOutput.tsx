import { useState } from 'react';
import { ScriptConfig } from '../types';
import { generateScript, generateBookmarklet } from '../utils/scriptGenerator';
import { Copy, Check, Download, Bookmark, Code2 } from 'lucide-react';

interface CodeOutputProps {
  config: ScriptConfig;
}

export function CodeOutput({ config }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarkletCopied, setBookmarkletCopied] = useState(false);
  const [tab, setTab] = useState<'script' | 'bookmarklet'>('script');

  const scriptCode = generateScript(config);
  const bookmarkletCode = generateBookmarklet(scriptCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleCopyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      setBookmarkletCopied(true);
      setTimeout(() => setBookmarkletCopied(false), 2000);
    } catch (err) {
      console.error('북마크릿 복사 실패:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([scriptCode], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ev_auto_apply_${config.targetDate}_${config.targetTime.replace(/:/g, '')}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-100">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50">
            <button
              type="button"
              onClick={() => setTab('script')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                tab === 'script'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>자바스크립트 코드 (v4.1 HUD 소멸·오프셋 반영)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('bookmarklet')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                tab === 'bookmarklet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>북마크릿 (1클릭 실행)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {tab === 'script' ? (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                title="스크립트 파일(.js) 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">.js 다운로드</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm shadow-blue-500/20 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>코드 전체 복사</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCopyBookmarklet}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
            >
              {bookmarkletCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>북마크릿 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>북마크릿 URL 복사</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Target Info Bar */}
      <div className="px-5 py-2 bg-slate-950/40 border-b border-slate-800/50 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
        <div>
          <span className="text-slate-500">목표 시각: </span>
          <span className="text-amber-400 font-semibold">{config.targetDate}T{config.targetTime}</span>
        </div>
        <div>
          <span className="text-slate-500">오프셋: </span>
          <span className="text-cyan-400 font-semibold">{config.earlyOffsetMs >= 0 ? `+${config.earlyOffsetMs}ms` : `${config.earlyOffsetMs}ms`}</span>
        </div>
        <div>
          <span className="text-slate-500">정밀 타겟: </span>
          <span className="text-emerald-400 font-semibold">#editForm button:nth-child(7)</span>
        </div>
        <div>
          <span className="text-slate-500">팝업 모드: </span>
          <span className={!config.bypassConfirm ? "text-blue-400 font-semibold" : "text-emerald-400 font-semibold"}>
            {!config.bypassConfirm ? "💬 실제 Confirm 팝업창 노출" : "⚡ 자동 승인(Bypass)"}
          </span>
        </div>
        <div>
          <span className="text-slate-500">HUD: </span>
          <span className="text-purple-400 font-semibold">실행 시 즉시 자동 소멸</span>
        </div>
      </div>

      {/* Code Body */}
      {tab === 'script' ? (
        <div className="relative">
          <pre className="p-5 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto text-slate-300 max-h-[380px] scrollbar-thin scrollbar-thumb-slate-700">
            <code>{scriptCode}</code>
          </pre>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              북마크릿(Bookmarklet) 사용 방법
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              아래 버튼을 브라우저 북마크바(즐겨찾기 바)로 직접 <strong>드래그 앤 드롭</strong>하거나, 
              북마크 생성 후 URL 칸에 복사한 코드를 붙여넣으세요. 무공해차 통합누리집 신청 페이지에서 북마크를 클릭하면 1초 만에 자동 활성화됩니다!
            </p>

            <div className="flex items-center gap-3">
              <a
                href={bookmarkletCode}
                onClick={(e) => {
                  e.preventDefault();
                  alert('이 버튼을 브라우저 상단 북마크바(즐겨찾기 바)로 드래그해서 저장하세요!');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 cursor-grab active:cursor-grabbing transition"
              >
                <span>⭐ [ev.or.kr 정시 신청 v4.1] 북마크바로 드래그</span>
              </a>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1.5">북마크릿 Raw URL 코드:</label>
            <textarea
              readOnly
              rows={3}
              value={bookmarkletCode}
              className="w-full p-3 text-xs font-mono bg-slate-950 text-slate-400 rounded-xl border border-slate-800 focus:outline-none select-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
