/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Copy, Check, Terminal, ExternalLink } from "lucide-react";

interface CodePaneProps {
  onClose?: () => void;
}

export default function CodePane({ onClose }: CodePaneProps) {
  const [copied, setCopied] = useState(false);

  const tampermonkeyCode = `// ==UserScript==
// @name         무공해차 보조금 신청서 초간단 자동 입력기
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  성명 입력란에 이름을 입력하고 벗어날 때(blur), 전송된 데이터와 이름이 일치하면 폼을 실시간 자동 주입합니다.
// @author       사무실 전용 매크로 시스템
// @match        https://ev.or.kr/ev_ps/ps/seller/sellerApplyform*
// @match        http://localhost:*/*
// @match        https://*.run.app/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // [1. 입력 필드 CSS 셀렉터 설정]
    // 웹페이지 구성에 맞게 각 입력란의 CSS 셀렉터(ID, 클래스 등)를 자유롭게 수정할 수 있습니다.
    // =========================================================================
    const NAME_SELECTOR = "#req_nm";                   // 성명(이름) 입력란 셀렉터 (트리거 대상)

    const DATE_SELECTORS = {
        birth_date: "#birth1",                        // 생년월일 입력란 (jQuery datepicker / 기본 ID: #birth1)
        contract_date: "#contract_day",                // 계약일자 입력란 (실제 ID: #contract_day)
        release_date: "#delivery_sch_day"             // 출고예정일자 입력란 (실제 ID: #delivery_sch_day)
    };

    const FIELD_SELECTORS = {
        req_kind: "#req_kind",                        // 신청유형 드롭다운 셀렉터
        req_cnt: "#req_cnt",                          // 신청대수 입력란 셀렉터
        mobile: "#mobile",                            // 연락처 휴대폰 번호 셀렉터
        email: "#email",                              // 이메일 주소 셀렉터
        contact_nm: "#contact_nm",                    // 제조수입사 담당자명 셀렉터
        contact_mobile: "#contact_mobile",            // 담당자 휴대폰 셀렉터
        model_cd: "#model_cd"                         // 신청차종 드롭다운 셀렉터
    };

    // 2. 현재 주소 확인
    const currentUrl = window.location.href;
    console.log("[자동 주입기] 현재 주소 감지됨:", currentUrl);

    // 3. URL 파라미터에서 데이터 파싱 (크로스 도메인 우회용 가장 안전한 방식)
    const urlParams = new URLSearchParams(window.location.search);
    const rawData = urlParams.get('macro_data');

    let data = null;

    if (rawData) {
        try {
            data = JSON.parse(decodeURIComponent(rawData));
            console.log("[자동 주입기] URL 파라미터로부터 전송 데이터를 파싱했습니다:", data);
            
            // 향후 새로고침이나 서브 세션을 위해 로컬 스토리지 백업 저장
            localStorage.setItem("EV_MACRO_BACKUP", JSON.stringify(data));
        } catch (e) {
            console.error("[자동 주입기] URL 데이터 파싱 중 실패했습니다:", e);
        }
    } else {
        // 백업 데이터 체크
        const backup = localStorage.getItem("EV_MACRO_BACKUP");
        if (backup) {
            try {
                data = JSON.parse(backup);
                console.log("[자동 주입기] 로컬 스토리지 백업 데이터 활용:", data);
            } catch (e) {}
        }
    }

    // 데이터가 없으면 매크로 작동 대기
    if (!data) {
        console.log("[자동 주입기] 전송된 데이터셋(macro_data)이 없어 대기 모드로 작동합니다.");
        return;
    }

    // 4. 성명 입력 필드의 blur 이벤트 리스너 등록 (지속 감시 및 즉시성 확보)
    const registerTrigger = () => {
        const nameInput = document.querySelector(NAME_SELECTOR);
        if (!nameInput) {
            // 성명 입력란이 아직 렌더링되지 않았을 수 있으므로 재귀 대기
            setTimeout(registerTrigger, 500);
            return;
        }

        console.log("[자동 주입기] 성명 입력창 감지 성공! blur 이벤트 리스너를 바인딩합니다.", NAME_SELECTOR);

        nameInput.addEventListener("blur", function() {
            const enteredName = nameInput.value.trim();
            const targetName = data.req_nm ? data.req_nm.trim() : "";

            console.log(\`[자동 주입기] 성명 입력칸 blur 감지! 입력된 성명: "\${enteredName}", 원본 성명: "\${targetName}"\`);

            if (enteredName === targetName && enteredName !== "") {
                console.log("[자동 주입기] 🎉 성명이 매크로 데이터와 일치합니다! 폼 전체 주입을 개시합니다.");
                runAutoFill();
            } else if (enteredName !== "") {
                console.warn("[자동 주입기] 입력된 성명이 매크로 데이터와 일치하지 않아 자동 주입을 중단합니다.");
            }
        });
    };

    // 5. 실제 폼 자동 기입 실행
    const runAutoFill = () => {
        try {
            console.log("[자동 주입기] ⚡ 데이터 자동 기입을 개시합니다!");

            // Helper 1: 일반 값 입력 및 이벤트 동기화 발송
            const fillInput = (selector, value) => {
                if (!value) return false;
                const el = document.querySelector(selector);
                if (el) {
                    el.value = value;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(\`  - 입력 성공: \${selector} -> \${value}\`);
                    return true;
                }
                return false;
            };

            // Helper 2: 날짜 전용 안전 입력 함수 (readonly 속성 우회 및 jQuery datepicker/hidden 동기화)
            const setDateValue = (selector, value) => {
                if (!value) return false;
                const el = document.querySelector(selector);
                if (el) {
                    const originalReadOnly = el.getAttribute('readonly');
                    
                    // [날짜 포맷 안전 변환 장치]
                    // 웹앱에서 기입된 날짜는 기본적으로 'YYYY-MM-DD' 형태입니다.
                    // 실제 웹페이지의 입력 필드 제한(예: maxlength가 8자이고 하이픈이 없는 형태)에 대응하기 위해 유연한 변환 처리
                    let formattedValue = value;
                    const maxLength = el.getAttribute('maxlength');
                    if (maxLength === '8' && value.includes('-')) {
                        // 하이픈이 포함되어 있으나 실제 필드 글자 수 제한이 8자인 경우 하이픈 제거 (예: 2026-07-14 -> 20260714)
                        formattedValue = value.replace(/-/g, '');
                    } else if ((maxLength === '10' || !maxLength) && !value.includes('-') && value.length === 8) {
                        // 하이픈이 없으나 실제 필드에서 하이픈 포함 10자를 요구하는 경우 하이픈 복원 (예: 20260714 -> 2026-07-14)
                        formattedValue = value.substring(0,4) + '-' + value.substring(4,6) + '-' + value.substring(6,8);
                    }
                    
                    // 1단계: readonly 속성 임시 제거
                    el.removeAttribute('readonly');
                    
                    // 2단계: 값 기입
                    el.value = formattedValue;
                    
                    // 3단계: 변경 이벤트 강제 발송 (hidden 동기화 및 jQuery datepicker 트리거)
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    // 4단계: 원래 readonly 설정으로 복구
                    if (originalReadOnly !== null) {
                        el.setAttribute('readonly', originalReadOnly);
                    } else {
                        el.setAttribute('readonly', 'readonly');
                    }
                    
                    console.log(\`  - 날짜 안전 기입 완료: \${selector} -> \${formattedValue} (원본: \${value})\`);
                    return true;
                }
                console.warn(\`  - 날짜 입력 필드를 찾지 못함: \${selector}\`);
                return false;
            };

            // 1. 계약일자 (안전 입력 함수)
            setDateValue(DATE_SELECTORS.contract_date, data.contract_date);

            // 2. 신청유형 드롭다운 선택 (P: 개인, B: 개인사업자, G: 단체)
            fillInput(FIELD_SELECTORS.req_kind, data.req_kind);

            // 3. 생년월일 입력 (안전 입력 함수)
            setDateValue(DATE_SELECTORS.birth_date, data.birth_date);

            // 4. 성별 선택 (라디오 버튼)
            const sexRadio = document.querySelector(\`input[name="req_sex"][value="\${data.req_sex}"]\`);
            if (sexRadio) {
                sexRadio.checked = true;
                sexRadio.dispatchEvent(new Event('change', { bubbles: true }));
                sexRadio.click();
                console.log(\`  - 성별 라디오 선택 성공: \${data.req_sex}\`);
            }

            // 5. 신청차종 드롭다운 선택 (3단계 정밀 매칭)
            const modelSelect = document.querySelector(FIELD_SELECTORS.model_cd);
            if (modelSelect) {
                let matched = false;
                
                // 1단계: Value 값으로 정확히 매칭 시도
                for (let opt of modelSelect.options) {
                    if (opt.value === data.model_cd) {
                        modelSelect.value = data.model_cd;
                        matched = true;
                        break;
                    }
                }
                
                // 2단계: 텍스트 값 매칭
                if (!matched) {
                    for (let opt of modelSelect.options) {
                        if (opt.text.trim() === data.model_cd) {
                            modelSelect.value = opt.value;
                            matched = true;
                            break;
                        }
                    }
                }

                // 3단계: 부분 텍스트 매칭
                if (!matched) {
                    for (let opt of modelSelect.options) {
                        if (opt.text.includes(data.model_cd) || data.model_cd.includes(opt.value)) {
                            modelSelect.value = opt.value;
                            matched = true;
                            break;
                        }
                    }
                }

                modelSelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(\`  - 신청차종 선택 완료: \${modelSelect.value}\`);
            }

            // 6. 신청대수
            fillInput(FIELD_SELECTORS.req_cnt, data.req_cnt);

            // 7. 출고예정일자 (안전 입력 함수)
            setDateValue(DATE_SELECTORS.release_date, data.release_date);

            // 8. 연락처 휴대폰 및 이메일
            fillInput(FIELD_SELECTORS.mobile, data.mobile);
            fillInput(FIELD_SELECTORS.email, data.email);

            // 9. 제조수입사 담당자 및 휴대폰
            fillInput(FIELD_SELECTORS.contact_nm, data.contact_nm);
            fillInput(FIELD_SELECTORS.contact_mobile, data.contact_mobile);

            // 실제 폼 자동 스크롤 다운을 수행해 기입 상태 확인 편의 제공
            window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });

            // 성공 알림 배너 생성 및 삽입
            const alertBanner = document.createElement("div");
            alertBanner.style.position = "fixed";
            alertBanner.style.top = "20px";
            alertBanner.style.left = "50%";
            alertBanner.style.transform = "translateX(-50%)";
            alertBanner.style.backgroundColor = "#047857";
            alertBanner.style.color = "#ffffff";
            alertBanner.style.padding = "16px 28px";
            alertBanner.style.borderRadius = "12px";
            alertBanner.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.15)";
            alertBanner.style.zIndex = "999999";
            alertBanner.style.fontFamily = "system-ui, -apple-system, sans-serif";
            alertBanner.style.fontWeight = "800";
            alertBanner.style.fontSize = "15px";
            alertBanner.style.border = "2px solid #065f46";
            alertBanner.innerHTML = "🎉 [무공해차 주입 완료] 성명이 완벽히 일치하여 모든 신청 항목을 실시간 자동 입력했습니다!";
            
            document.body.appendChild(alertBanner);
            setTimeout(() => { alertBanner.remove(); }, 6000);

        } catch (err) {
            console.error("[자동 주입기] 입력 자동 주입 프로세스 실행 실패:", err);
        }
    };

    // 실행 시작
    registerTrigger();
})();`;

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tampermonkeyCode);
    setCopied(true);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden max-w-2xl w-full">
      {/* 팝업 헤더 */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="font-sans font-bold text-slate-100 text-base tracking-tight">
            시스템 관리자 설정 (Tampermonkey 스크립트)
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-all active:scale-95"
          >
            닫기
          </button>
        )}
      </div>

      {/* 팝업 본문 */}
      <div className="p-6 overflow-y-auto space-y-5 leading-relaxed text-sm text-slate-300">
        <div className="bg-emerald-950/40 border border-emerald-900/40 p-4.5 rounded-xl space-y-2.5">
          <h4 className="text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            첫 1회 사전 템퍼몽키 설치 가이드 (관리자용)
          </h4>
          <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4.5 font-medium">
            <li>
              사용 중인 크롬(Chrome) 브라우저에{" "}
              <a
                href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-emerald-400 underline inline-flex items-center gap-0.5 hover:text-emerald-300 font-semibold"
              >
                Tampermonkey 확장 프로그램 <ExternalLink className="w-3 h-3" />
              </a>
              을 설치해 주세요.
            </li>
            <li>
              Tampermonkey 아이콘을 클릭하고 <strong className="text-emerald-300">"새 스크립트 만들기"</strong>를 선택합니다.
            </li>
            <li>
              아래 소스코드를 그대로 전체 복사해서 기존 내용을 모두 지우고 붙여넣은 뒤,{" "}
              <strong className="text-emerald-300">저장(Ctrl+S)</strong>해 주십시오.
            </li>
            <li>설치 완료 후에는 일반 직원들이 본 사이트에서 평소처럼 데이터 기입만 하고 버튼을 누르면 즉시 가동됩니다.</li>
          </ol>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tampermonkey UserScript 소스코드
            </span>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 border border-slate-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>코드 전체 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-400/90 h-[240px] shadow-inner select-all">
              {tampermonkeyCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
