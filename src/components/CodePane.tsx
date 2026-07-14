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
// @version      1.3
// @description  입력한 데이터셋을 감지하여 무공해차 보조금 신청서 작성 페이지에 폼 데이터를 자동으로 완벽 주입합니다.
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
    // [날짜 입력 필드 셀렉터 설정]
    // 실제 무공해차 보조금 신청서 페이지 구성에 맞춰진 각 날짜 입력란의 ID/CSS 셀렉터입니다.
    // 타겟 사이트 분석에 따라 계약일자는 #contract_day, 출고예정일자는 #delivery_sch_day,
    // 생년월일은 #birth1을 완벽히 타겟팅하여 매핑합니다.
    // =========================================================================
    const DATE_SELECTORS = {
        birth_date: "#birth1",                // 생년월일 입력란 (jQuery datepicker / 기본 ID: #birth1)
        contract_date: "#contract_day",        // 계약일자 입력란 (실제 ID: #contract_day)
        release_date: "#delivery_sch_day"     // 출고예정일자 입력란 (실제 ID: #delivery_sch_day)
    };

    // 1. 현재 주소 확인
    const currentUrl = window.location.href;
    console.log("[자동 주입기] 현재 주소 감지됨:", currentUrl);

    // 2. URL 파라미터에서 데이터 파싱 (크로스 도메인 우회용 가장 안전한 방식)
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

    // 주입 대상 도메인 매칭 시에만 자동 기입 실행
    if (data && (currentUrl.includes("ev.or.kr") || currentUrl.includes("apply-form") || document.getElementById("model_cd") || document.getElementById("req_nm"))) {
        
        // 폼 주입 실행 함수 (로딩 속도 지연을 배려해 0.8초 후 가동)
        setTimeout(function() {
            try {
                console.log("[자동 주입기] ⚡ 데이터 자동 기입을 개시합니다!");

                // Helper 1: 일반 값 입력 및 이벤트 동기화 발송
                const fillInput = (id, value) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = value;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(\`  - 입력 성공: ID[\${id}] -> \${value}\`);
                        return true;
                    }
                    return false;
                };

                // Helper 2: 날짜 전용 안전 입력 함수 (readonly 속성 우회 및 jQuery datepicker/hidden 동기화)
                const setDateValue = (selector, value) => {
                    if (!value) return false;
                    // id 또는 full selector 모두 지원
                    const el = document.querySelector(selector) || document.getElementById(selector.replace('#', ''));
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
                fillInput("req_kind", data.req_kind);

                // 3. 성명 입력
                fillInput("req_nm", data.req_nm);

                // 4. 생년월일 입력 (안전 입력 함수)
                setDateValue(DATE_SELECTORS.birth_date, data.birth_date);

                // 5. 성별 선택 (라디오 버튼)
                const sexRadio = document.querySelector(\`input[name="req_sex"][value="\${data.req_sex}"]\`);
                if (sexRadio) {
                    sexRadio.checked = true;
                    sexRadio.dispatchEvent(new Event('change', { bubbles: true }));
                    sexRadio.click();
                    console.log(\`  - 성별 라디오 선택 성공: \${data.req_sex}\`);
                }

                // 6. 신청차종 드롭다운 선택 (3단계 정밀 매칭)
                const modelSelect = document.getElementById("model_cd");
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

                // 7. 신청대수
                fillInput("req_cnt", data.req_cnt);

                // 8. 출고예정일자 (안전 입력 함수)
                setDateValue(DATE_SELECTORS.release_date, data.release_date);

                // 9. 연락처 휴대폰 및 이메일
                fillInput("mobile", data.mobile);
                fillInput("email", data.email);

                // 10. 주소지 및 상세 주소
                fillInput("search_address", data.search_address);
                fillInput("detail_address", data.detail_address);
                fillInput("rtAddrDetail", data.detail_address); // 변형 id 지원

                // 11. 지원여부 신청조건 라디오 버튼
                const socialYnRadio = document.querySelector(\`input[name="social_yn"][value="\${data.social_yn}"]\`);
                if (socialYnRadio) {
                    socialYnRadio.checked = true;
                    socialYnRadio.dispatchEvent(new Event('change', { bubbles: true }));
                    socialYnRadio.click();
                    console.log(\`  - 지원대상 여부 선택 성공: \${data.social_yn}\`);
                    
                    // 지원대상 종류 드롭다운 조작 (시간차 지연)
                    if (data.social_yn === "Y") {
                        setTimeout(() => {
                            fillInput("social_kind", data.social_kind);
                        }, 200);
                    }
                }

                // 12. 제조수입사 담당자 및 휴대폰
                fillInput("contact_nm", data.contact_nm);
                fillInput("contact_mobile", data.contact_mobile);

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
                alertBanner.innerHTML = "🎉 [무공해차 주입 완료] 입력 전송된 직원 데이터가 폼 전체에 자동으로 기입되었습니다! 내용을 최종 확인해 주십시오.";
                
                document.body.appendChild(alertBanner);
                setTimeout(() => { alertBanner.remove(); }, 6000);

            } catch (err) {
                console.error("[자동 주입기] 입력 자동 주입 프로세스 실행 실패:", err);
            }
        }, 800);
    }
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
