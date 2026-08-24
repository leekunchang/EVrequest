import { ScriptConfig } from '../types';

export function generateScript(config: ScriptConfig): string {
  const targetIsoString = `${config.targetDate}T${config.targetTime}.${String(config.targetMillis).padStart(3, '0')}`;
  
  return `/**
 * ============================================================================
 * [무공해차 통합누리집 (ev.or.kr) 고정밀 정시 자동 신청 스크립트 v4.1]
 * 
 * 1. 대상 페이지: https://ev.or.kr/ev_ps/ps/seller/sellerApplyform
 * 2. 제공된 타겟 정보:
 *    - Selector: #editForm > div.order-button-group.mb25 > button:nth-child(7)
 *    - XPath: //*[@id="editForm"]/div[7]/button[7]
 *    - Full XPath: /html/body/div[1]/div/div[2]/div/form[4]/div[7]/button[7]
 *    - Target: <button type="button" class="btn-blue btn_step100" onclick="goApply('101', '지원신청서를 제출 하시겠습니까?');return false;" value="">지원신청</button>
 * 
 * 3. 핵심 업데이트 사항:
 *    ① [HUD 자동 소멸]: 정시 도달 후 코드가 실행되면 HUD 화면이 즉시 완전히 사라집니다.
 *    ② [기본 오프셋 +100ms]: 네트워크 지연 및 서버 반영 주기를 고려한 안정적 오프셋 적용.
 *    ③ [실제 팝업창 완벽 대응]: 브라우저의 Confirm 확인창을 화면에 100% 그대로 띄웁니다.
 *    ④ [삭제/수정 버튼 절대 클릭 차단]: '삭제'/'수정'/'goDelete' 요소 원천 배제
 * ============================================================================
 */

(async function () {
  'use strict';

  // ==========================================
  // [1] 사용자 설정 영역
  // ==========================================
  
  // 목표 실행 시각 (YYYY-MM-DDTHH:mm:ss.sss)
  const TARGET_TIME = "${targetIsoString}";
  
  // 선제 오프셋 (기본값: +100ms)
  const EARLY_OFFSET_MS = ${config.earlyOffsetMs};
  
  // 서버 시간 RTT 동기화 샘플 횟수 (기본 ${config.rttSamples}회)
  const RTT_SAMPLES = ${config.rttSamples};
  
  // 화면 우측 상단 플로팅 HUD 표시 여부 (코드 실행 시 즉시 소멸됨)
  const SHOW_FLOATING_HUD = ${config.showFloatingHud};
  
  // 팝업 설정: true면 확인창 없이 자동 전송, false면 화면에 실제 확인 팝업창을 띄움
  const AUTO_BYPASS_CONFIRM = ${config.bypassConfirm};
  const AUTO_BYPASS_ALERT = ${config.bypassAlert};

  // 실행 성공 시 비프음 재생
  const PLAY_BEEP = ${config.playBeepOnTrigger};

  // ==========================================
  // [2] Confirm & Alert 처리 정책
  // ==========================================
  if (AUTO_BYPASS_CONFIRM) {
    console.log('%c[팝업 설정] ⚡ 자동 승인 모드 ON (확인창 팝업 없이 0.001초 만에 즉시 자동 제출)', 'background: #047857; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;');
    const originalConfirm = window.confirm;
    window.confirm = function (msg) {
      console.log('%c[자동승인 완료] Confirm 팝업 감지 -> 즉시 자동 승인(true): ' + msg, 'color: #10b981; font-weight: bold;');
      return true;
    };
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        if (iframe.contentWindow) iframe.contentWindow.confirm = () => true;
      } catch (e) {}
    });
  } else {
    console.log('%c[팝업 설정] 💬 실제 팝업 노출 모드 (화면에 "지원신청서를 제출 하시겠습니까?" 확인창이 뜹니다)', 'background: #2563eb; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;');
  }

  // ==========================================
  // [3] 안전한 '지원신청' 버튼 전용 정밀 탐색기 (삭제/수정 버튼 배제)
  // ==========================================
  console.log('%c🚗 [무공해차 누리집 정시 신청기 v4.1] 초기화 시작', 'background: #1d4ed8; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold;');

  function isDangerousButton(btn) {
    if (!btn) return true;
    const txt = (btn.textContent || '').trim();
    const onclick = btn.getAttribute('onclick') || '';
    const id = btn.id || '';

    if (txt.includes('삭제') || onclick.toLowerCase().includes('delete') || onclick.includes('goDelete') || id.includes('delete')) {
      return true;
    }
    if (txt.includes('수정') || onclick.toLowerCase().includes('modify') || onclick.includes('goModify')) {
      return true;
    }
    return false;
  }

  function isValidApplyButton(btn) {
    if (!btn || isDangerousButton(btn)) return false;
    const txt = (btn.textContent || '').trim();
    const onclick = btn.getAttribute('onclick') || '';

    if (txt === '지원신청' || txt.includes('지원신청')) return true;
    if (onclick.includes('goApply') && onclick.includes('101')) return true;
    return false;
  }

  function findApplyButton() {
    let candidate = null;

    // [1순위] 제공된 정확한 JS Selector
    try {
      candidate = document.querySelector('#editForm > div.order-button-group.mb25 > button:nth-child(7)');
      if (candidate && isValidApplyButton(candidate)) return candidate;
    } catch (e) {}

    // [2순위] 제공된 정확한 XPath
    try {
      const xpathRes = document.evaluate('//*[@id="editForm"]/div[7]/button[7]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (xpathRes && xpathRes.singleNodeValue && isValidApplyButton(xpathRes.singleNodeValue)) {
        return xpathRes.singleNodeValue;
      }
    } catch (e) {}

    // [3순위] Full XPath
    try {
      const fullXpathRes = document.evaluate('/html/body/div[1]/div/div[2]/div/form[4]/div[7]/button[7]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (fullXpathRes && fullXpathRes.singleNodeValue && isValidApplyButton(fullXpathRes.singleNodeValue)) {
        return fullXpathRes.singleNodeValue;
      }
    } catch (e) {}

    // [4순위] editForm 내부의 onclick="goApply" 버튼
    try {
      const formButtons = document.querySelectorAll('#editForm button[onclick*="goApply"], form button[onclick*="goApply"]');
      for (const btn of formButtons) {
        if (isValidApplyButton(btn)) return btn;
      }
    } catch (e) {}

    // [5순위] 텍스트가 '지원신청'인 버튼
    try {
      const allBtns = Array.from(document.querySelectorAll('button, a, input[type="button"]'));
      const applyBtn = allBtns.find(b => (b.textContent || '').trim() === '지원신청' && !isDangerousButton(b));
      if (applyBtn) return applyBtn;
    } catch (e) {}

    return null;
  }

  const detectedButton = findApplyButton();
  if (detectedButton) {
    const btnText = (detectedButton.textContent || '').trim();
    const onclickStr = detectedButton.getAttribute('onclick') || '(없음)';
    console.log('%c[사전점검 성공] ✅ "지원신청" 버튼 타겟팅 100% 완료!', 'background: #10b981; color: white; padding: 4px 8px; font-weight: bold; border-radius: 3px;');
    console.log('%c  - 텍스트: "' + btnText + '" (삭제/수정 버튼 아님 확인됨 ✅)', 'color: #059669; font-weight: bold;');
    console.log('%c  - onclick 속성: ' + onclickStr, 'color: #059669;');
    console.log('%c  - DOM 노드:', 'color: #059669;', detectedButton);
  } else {
    console.warn('%c[사전점검 경고] ⚠️ 지원신청 버튼을 찾지 못했습니다. 페이지가 완전히 로드되었는지 확인하세요.', 'color: #f59e0b; font-weight: bold;');
  }

  // ==========================================
  // [4] 서버 시간 정밀 동기화 (RTT / 2 보정)
  // ==========================================
  let serverEpochAtPerfZero = null;
  let measuredRtt = 0;

  async function syncServerTime() {
    console.log('%c⏳ 서버 시간 동기화(RTT 정밀 측정 ' + RTT_SAMPLES + '회) 진행 중...', 'color: #64748b;');
    const syncUrl = window.location.href.split('#')[0] || '/';
    let bestRtt = Infinity;
    let bestServerEpoch = 0;

    for (let i = 0; i < RTT_SAMPLES; i++) {
      try {
        const t0 = performance.now();
        const response = await fetch(syncUrl, {
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const t1 = performance.now();
        const rtt = t1 - t0;

        const serverDateHeader = response.headers.get('Date');
        if (serverDateHeader) {
          const headerTime = new Date(serverDateHeader).getTime();
          const currentServerTime = headerTime + (rtt / 2);
          if (rtt < bestRtt) {
            bestRtt = rtt;
            bestServerEpoch = currentServerTime - t1;
          }
        }
      } catch (err) {
        try {
          const t0 = performance.now();
          const response = await fetch(syncUrl, { method: 'HEAD', cache: 'no-store' });
          const t1 = performance.now();
          const rtt = t1 - t0;
          const serverDateHeader = response.headers.get('Date');
          if (serverDateHeader) {
            const headerTime = new Date(serverDateHeader).getTime();
            const currentServerTime = headerTime + (rtt / 2);
            if (rtt < bestRtt) {
              bestRtt = rtt;
              bestServerEpoch = currentServerTime - t1;
            }
          }
        } catch (e) {}
      }
      await new Promise(r => setTimeout(r, 40));
    }

    if (bestRtt !== Infinity) {
      serverEpochAtPerfZero = bestServerEpoch;
      measuredRtt = bestRtt;
      console.log('%c✅ 서버 시간 동기화 완료! (최적 RTT: ' + bestRtt.toFixed(2) + 'ms)', 'color: #10b981; font-weight: bold;');
    } else {
      console.warn('%c⚠️ 서버 헤더를 읽지 못하여 브라우저 로컬 시계로 대체합니다.', 'color: #ef4444;');
      serverEpochAtPerfZero = Date.now() - performance.now();
    }
  }

  await syncServerTime();

  function getAccurateServerTime() {
    return serverEpochAtPerfZero + performance.now();
  }

  // ==========================================
  // [5] 확실한 지원신청 실행 및 HUD 자동 소멸
  // ==========================================
  let isTriggered = false;

  function executeApply(triggerSource = '정시 타이머') {
    if (isTriggered && triggerSource === '정시 타이머') return;
    isTriggered = true;

    // [요구사항 1] 코드가 실행되면 HUD 화면을 즉시 완전히 제거
    const hudElem = document.getElementById('ev-auto-hud-wrapper');
    if (hudElem) {
      try {
        hudElem.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
        hudElem.style.opacity = '0';
        hudElem.style.transform = 'translateY(-10px)';
        setTimeout(() => hudElem.remove(), 200);
      } catch (e) {
        hudElem.remove();
      }
    }

    const execTime = new Date(getAccurateServerTime());
    const timeFormatted = execTime.toISOString().replace('T', ' ').substring(0, 23);
    console.log('%c🚀 [' + triggerSource + ' 발동] 지원신청 실행! (시각: ' + timeFormatted + ')', 'background: #dc2626; color: white; padding: 6px 12px; font-size: 14px; font-weight: bold; border-radius: 4px;');

    if (PLAY_BEEP) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 1000;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.35);
        setTimeout(() => audioCtx.close(), 400);
      } catch (e) {}
    }

    const targetBtn = findApplyButton();

    if (targetBtn) {
      if (isDangerousButton(targetBtn)) {
        console.error('❌ [긴급 차단] 감지된 버튼이 삭제/수정 버튼이므로 실행을 취소합니다.');
        return;
      }

      console.log('%c[실행 단계 1] 지원신청 버튼 DOM Native Click 실행', 'color: #2563eb; font-weight: bold;');
      
      // 1. 표준 클릭 이벤트 발생
      try {
        targetBtn.click();
      } catch (e) {
        console.error('targetBtn.click() 에러:', e);
      }

      // 2. 인라인 onclick 직접 평가 (click으로 팝업이 안 뜰 경우 백업)
      try {
        const onclickStr = targetBtn.getAttribute('onclick');
        if (onclickStr) {
          console.log('%c[실행 단계 2] onclick 인라인 핸들러 평가 실행:', 'color: #2563eb;', onclickStr);
          const fn = new Function(onclickStr);
          fn.call(targetBtn);
        }
      } catch (e) {}

    } else {
      // 버튼 탐색 실패 시 전역 함수 직접 호출
      if (typeof window.goApply === 'function') {
        console.log('%c[실행 대체] window.goApply("101", ...) 직접 실행', 'color: #2563eb; font-weight: bold;');
        window.goApply('101', '지원신청서를 제출 하시겠습니까?');
      }
    }
  }

  // ==========================================
  // [6] 고정밀 타이머 루프 및 플로팅 HUD
  // ==========================================
  const targetEpoch = new Date(TARGET_TIME).getTime() + EARLY_OFFSET_MS;

  if (SHOW_FLOATING_HUD) {
    const existingHud = document.getElementById('ev-auto-hud-wrapper');
    if (existingHud) existingHud.remove();

    const hudContainer = document.createElement('div');
    hudContainer.id = 'ev-auto-hud-wrapper';
    hudContainer.style.cssText = 'position: fixed; top: 16px; right: 16px; z-index: 9999999; background: rgba(15, 23, 42, 0.96); color: #f8fafc; padding: 14px 18px; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); min-width: 320px; font-size: 13px; line-height: 1.5;';
    
    hudContainer.innerHTML = \`
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 6px;">
        <span style="font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 6px; font-size: 13px;">
          <span style="display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></span>
          ev.or.kr 지원신청기 v4.1
        </span>
        <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">RTT \${measuredRtt.toFixed(1)}ms</span>
      </div>

      <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">현재 서버시각:</span>
        <span id="ev-auto-hud-server-time" style="font-family: monospace; font-weight: 700; color: #f1f5f9;">--:--:--.---</span>
      </div>

      <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">목표 정시:</span>
        <span style="font-family: monospace; font-weight: 700; color: #fbbf24;">\${TARGET_TIME.split('T')[1]} (+\${EARLY_OFFSET_MS}ms)</span>
      </div>

      <div style="margin-top: 6px; padding: 4px 8px; background: rgba(30, 41, 59, 0.7); border-radius: 6px; font-size: 11px; color: #93c5fd; display: flex; align-items: center; justify-content: space-between;">
        <span>🎯 타겟: [지원신청] 버튼</span>
        <span style="color: \${AUTO_BYPASS_CONFIRM ? '#4ade80' : '#38bdf8'}; font-weight: bold;">
          \${AUTO_BYPASS_CONFIRM ? '⚡ 팝업 자동승인(Bypass)' : '💬 팝업창 실제 노출'}
        </span>
      </div>

      <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;" id="ev-auto-hud-status">
        <span style="color: #94a3b8; font-size: 12px;">남은 시간: </span>
        <span id="ev-auto-hud-countdown" style="font-size: 17px; font-weight: 900; color: #38bdf8; font-family: monospace;">계산 중...</span>
      </div>

      <div style="margin-top: 10px; display: flex; gap: 6px;">
        <button id="ev-hud-test-btn" style="flex: 1; background: #334155; color: #f8fafc; border: 1px solid #475569; border-radius: 8px; padding: 6px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
          🧪 지원신청 1회 시험
        </button>
        <button id="ev-hud-force-btn" style="flex: 1.2; background: #dc2626; color: #ffffff; border: none; border-radius: 8px; padding: 6px 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);">
          ⚡ 지금 즉시 실행
        </button>
      </div>
      
      <div style="margin-top: 6px; text-align: center; font-size: 10px; color: #64748b;">
        * 실행 즉시 HUD 창은 자동으로 소멸합니다.
      </div>
    \`;
    document.body.appendChild(hudContainer);

    document.getElementById('ev-hud-test-btn').onclick = function () {
      console.log('%c[수동 시험] 지원신청 버튼 1회 시험 실행', 'color: #f59e0b; font-weight: bold;');
      executeApply('수동 시험');
    };

    document.getElementById('ev-hud-force-btn').onclick = function () {
      executeApply('HUD 강제 실행');
    };
  }

  let lastConsoleSec = -1;

  function scheduleCheck() {
    const now = getAccurateServerTime();
    const remainMs = targetEpoch - now;

    if (SHOW_FLOATING_HUD) {
      const serverDate = new Date(now);
      const timeStr = serverDate.toTimeString().split(' ')[0] + '.' + String(serverDate.getMilliseconds()).padStart(3, '0');
      const timeElem = document.getElementById('ev-auto-hud-server-time');
      if (timeElem) timeElem.textContent = timeStr;

      const countElem = document.getElementById('ev-auto-hud-countdown');
      if (countElem && !isTriggered) {
        if (remainMs > 0) {
          const totalSec = Math.floor(remainMs / 1000);
          const ms = Math.floor(remainMs % 1000);
          const min = Math.floor(totalSec / 60);
          const sec = totalSec % 60;
          countElem.textContent = (min > 0 ? min + '분 ' : '') + sec + '.' + String(ms).padStart(3, '0') + '초';
        } else {
          countElem.textContent = '0.000초 (실행됨)';
        }
      }
    }

    const currentSecFloor = Math.floor(remainMs / 1000);
    if (remainMs > 0 && currentSecFloor !== lastConsoleSec && (currentSecFloor <= 10 || currentSecFloor % 10 === 0)) {
      lastConsoleSec = currentSecFloor;
      console.log('%c[카운트다운] 남은 시간: ' + (remainMs / 1000).toFixed(1) + '초 | 현재 서버: ' + new Date(now).toTimeString().split(' ')[0] + '.' + String(new Date(now).getMilliseconds()).padStart(3, '0'), 'color: #0284c7;');
    }

    if (remainMs <= 0) {
      executeApply('정시 타이머');
      return;
    }

    if (remainMs > 1000) {
      setTimeout(scheduleCheck, Math.min(remainMs - 800, 400));
    } else if (remainMs > 25) {
      requestAnimationFrame(scheduleCheck);
    } else {
      while (getAccurateServerTime() < targetEpoch) {}
      executeApply('정시 타이머 (Precision Spin)');
    }
  }

  console.log('%c⏱️ [대기 시작] 설정된 정시에 지원신청 버튼이 자동 실행됩니다. 실행 시 HUD는 자동 소멸합니다.', 'color: #10b981; font-weight: bold;');
  scheduleCheck();

})();
`;
}

export function generateBookmarklet(script: string): string {
  const cleanScript = script
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `javascript:${encodeURIComponent(cleanScript)}`;
}
