import { ScriptConfig } from '../types';

export function formatTargetDateTimeString(config: ScriptConfig): string {
  const msFormatted = String(config.milliseconds).padStart(3, '0');
  return `${config.targetDate}T${config.targetTime}.${msFormatted}`;
}

export function generateScript(config: ScriptConfig, isAdvanced: boolean = false): string {
  const targetIsoStr = formatTargetDateTimeString(config);
  
  if (!isAdvanced) {
    // Basic template matching prompt specification directly
    if (config.timeMode === 'browser') {
      return `(function() {
    // 목표 실행 시간 (${targetIsoStr})
    const targetTime = new Date('${targetIsoStr}').getTime();
    console.log("⏱️ 자동 클릭 타이머가 시작되었습니다. 목표 시간:", new Date(targetTime).toLocaleString() + ".${String(config.milliseconds).padStart(3, '0')}");

    const timer = setInterval(() => {
        const currentTime = Date.now();
        const remaining = targetTime - currentTime;

        if (remaining <= 0) {
            clearInterval(timer);
            // 버튼 탐색 (innerText 포함 여부 및 onclick 속성 검사)
            const targetButton = Array.from(document.querySelectorAll('button, a, input[type="button"]')).find(el => {
                const textMatch = el.innerText && el.innerText.includes('${config.customText || '신청서 작성'}');
                const onclickAttr = el.getAttribute('onclick') || '';
                const onclickMatch = onclickAttr.includes('${config.customOnclick || 'sellerApplyWrite'}');
                return textMatch || onclickMatch;
            }) || document.querySelector("${config.customSelector || "button[onclick*='sellerApplyWrite']"}");

            if (targetButton) {
                console.log("🚀 목표 시간 도달! 버튼을 클릭합니다.");
                targetButton.click();
            } else {
                console.error("❌ 클릭할 버튼을 찾을 수 없습니다. (텍스트: '${config.customText}')");
            }
        }
    }, ${config.checkIntervalMs || 10}); // ${config.checkIntervalMs || 10}ms 단위 초정밀 체크
})();`;
    } else {
      // Server Time basic template
      return `(function() {
    // 목표 실행 시간 (${targetIsoStr})
    const targetTime = new Date('${targetIsoStr}').getTime();
    console.log("⏱️ [서버시간 동기화] 자동 클릭 타이머 시작. 목표 시간:", new Date(targetTime).toLocaleString());

    let serverTimeOffset = 0; // (서버시간 - 브라우저시간)

    // 서버 시간 동기화 (fetch HEAD 사용)
    async function syncServerTime() {
        try {
            const start = performance.now();
            const res = await fetch(location.href, { method: 'HEAD', cache: 'no-store' });
            const rtt = performance.now() - start;
            const dateStr = res.headers.get('Date');
            if (dateStr) {
                const serverTime = new Date(dateStr).getTime() + (rtt / 2);
                serverTimeOffset = serverTime - Date.now();
                console.log("🌐 서버시간 동기화 완료! 오프셋:", Math.round(serverTimeOffset) + "ms");
            }
        } catch (e) {
            console.warn("⚠️ 서버시간 조회 실패. 브라우저 시간으로 동작합니다.", e);
        }
    }

    async function startTimer() {
        await syncServerTime();

        const timer = setInterval(() => {
            const currentServerTime = Date.now() + serverTimeOffset;
            const remaining = targetTime - currentServerTime;

            if (remaining <= 0) {
                clearInterval(timer);
                const targetButton = Array.from(document.querySelectorAll('button, a, input[type="button"]')).find(el => {
                    const textMatch = el.innerText && el.innerText.includes('${config.customText || '신청서 작성'}');
                    const onclickAttr = el.getAttribute('onclick') || '';
                    return textMatch || onclickAttr.includes('${config.customOnclick || 'sellerApplyWrite'}');
                }) || document.querySelector("${config.customSelector || "button[onclick*='sellerApplyWrite']"}");

                if (targetButton) {
                    console.log("🚀 [서버시간 도달] 버튼을 클릭합니다!");
                    targetButton.click();
                } else {
                    console.error("❌ 클릭할 버튼을 찾을 수 없습니다.");
                }
            }
        }, ${config.checkIntervalMs || 10});
    }

    startTimer();
})();`;
    }
  }

  // Advanced, robust version with retry clicks, fine-tuning offset, sounds, logging, and auto re-sync
  return `(function() {
    /**
     * 보조금 신청서 작성 초정밀 자동 클릭 스크립트 (고급형)
     * 생성시각: ${new Date().toLocaleString('ko-KR')}
     * 목표시각: ${targetIsoStr}
     * 동기화모드: ${config.timeMode === 'server' ? '서버 시간 동기화 (HEAD Response Date)' : '브라우저 고정밀 시간 (Date.now())'}
     */
    const TARGET_ISO = "${targetIsoStr}";
    const TARGET_TIME = new Date(TARGET_ISO).getTime();
    const TIME_MODE = "${config.timeMode}";
    const CHECK_INTERVAL = ${config.checkIntervalMs}; // ms
    const EARLY_OFFSET = ${config.offsetMs}; // ms (사전 클릭 보정)
    const RETRY_COUNT = ${config.retryCount};
    const RETRY_GAP = ${config.retryIntervalMs}; // ms

    console.log("%c[자동클릭 매크로 가동]", "color: #2563eb; font-weight: bold; font-size: 15px; background: #e0f2fe; padding: 4px 8px; border-radius: 4px;");
    console.log("🎯 목표 시간:", new Date(TARGET_TIME).toLocaleString('ko-KR') + ".${String(config.milliseconds).padStart(3, '0')}");
    console.log("⚙️ 설정: 모드(" + TIME_MODE + "), 오프셋(" + EARLY_OFFSET + "ms), 체크주기(" + CHECK_INTERVAL + "ms), 연타(" + RETRY_COUNT + "회)");

    let serverOffsetMs = 0;

    async function syncServerTime() {
        if (TIME_MODE !== 'server') return;
        try {
            const t0 = performance.now();
            const response = await fetch(location.href, { method: 'HEAD', cache: 'no-store' });
            const t1 = performance.now();
            const rtt = t1 - t0;
            const serverDateHeader = response.headers.get('Date');
            
            if (serverDateHeader) {
                const serverTimeMs = new Date(serverDateHeader).getTime() + (rtt / 2);
                serverOffsetMs = serverTimeMs - Date.now();
                console.log("%c[서버시간 동기화 성공]", "color: #059669; font-weight: bold;", 
                    "RTT: " + rtt.toFixed(1) + "ms | 오프셋: " + (serverOffsetMs >= 0 ? '+' : '') + serverOffsetMs.toFixed(0) + "ms");
            }
        } catch (e) {
            console.warn("[경고] 서버시간 가져오기 실패, 브라우저 표준 시간을 사용합니다.", e);
        }
    }

    function getNow() {
        return Date.now() + (TIME_MODE === 'server' ? serverOffsetMs : 0);
    }

    function findTargetElement() {
        // 1. 신청서 작성 버튼 검색
        const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
        let btn = buttons.find(el => {
            const txt = (el.innerText || el.textContent || '').trim();
            const onclick = el.getAttribute('onclick') || '';
            return txt.includes('${config.customText || '신청서 작성'}') || onclick.includes('${config.customOnclick || 'sellerApplyWrite'}');
        });

        if (!btn) {
            btn = document.querySelector("${config.customSelector || "button[onclick*='sellerApplyWrite']"}");
        }
        return btn;
    }

    function triggerClick() {
        const btn = findTargetElement();
        if (btn) {
            console.log("%c[목표 시간 도달!] 버튼 클릭을 시작합니다.", "color: #16a34a; font-weight: bold; font-size: 16px;");
            
            for (let i = 0; i < RETRY_COUNT; i++) {
                setTimeout(() => {
                    btn.click();
                    console.log("👉 클릭 발사 #" + (i + 1) + " 실행 완료!");
                }, i * RETRY_GAP);
            }
            return true;
        } else {
            console.error("%c[클릭 실패] 버튼을 찾을 수 없습니다! 버튼이 아직 렌더링되지 않았거나 선택자가 다릅니다.", "color: #dc2626; font-weight: bold;");
            ${config.autoReloadIfNotFound ? 'console.log("300ms 후 페이지를 새로고침합니다."); setTimeout(() => location.reload(), 300);' : ''}
            return false;
        }
    }

    async function run() {
        if (TIME_MODE === 'server') {
            await syncServerTime();
            // 30초마다 서버시간 재동기화
            setInterval(syncServerTime, 30000);
        }

        const timer = setInterval(() => {
            const now = getNow();
            const remaining = (TARGET_TIME - EARLY_OFFSET) - now;

            if (remaining <= 0) {
                clearInterval(timer);
                triggerClick();
            } else if (remaining <= 3000 && remaining > 2980) {
                console.log("⏰ [3초 전] 준비하세요!");
            }
        }, CHECK_INTERVAL);
    }

    run();
})();`;
}
