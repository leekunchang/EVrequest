/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MacroData, SimulationStep, CAR_MODELS } from "../types";
import { Play, RotateCcw, AlertCircle, Sparkles, CheckCircle2, MapPin, ExternalLink, Calendar, Search, HelpCircle, Terminal } from "lucide-react";

interface FormSimulationProps {
  data: MacroData;
  targetUrl: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "command" | "window";
}

export default function FormSimulation({ data, targetUrl }: FormSimulationProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupStep, setPopupStep] = useState<"input" | "searching" | "results" | "details" | "submitting" | "closed">("closed");
  
  // Simulated Datepicker Popups
  const [activeCalendar, setActiveCalendar] = useState<"contract" | "birth" | "release" | null>(null);

  // Simulated live field inputs (updated during macro execution)
  const [simulatedForm, setSimulatedForm] = useState({
    contract_date: "",
    req_kind: "",
    req_nm: "",
    birth_date: "",
    req_sex: "",
    model_cd: "",
    req_cnt: "",
    release_date: "",
    search_address: "",
    detail_address: "",
    mobile: "",
    email: "",
    social_yn: "",
    social_kind: "",
    contact_nm: "",
    contact_mobile: ""
  });

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Reset form simulation values
  const resetFormValues = () => {
    setSimulatedForm({
      contract_date: "",
      req_kind: "",
      req_nm: "",
      birth_date: "",
      req_sex: "",
      model_cd: "",
      req_cnt: "",
      release_date: "",
      search_address: "",
      detail_address: "",
      mobile: "",
      email: "",
      social_yn: "",
      social_kind: "",
      contact_nm: "",
      contact_mobile: ""
    });
    setCurrentStep(-1);
    setIsPopupOpen(false);
    setPopupStep("closed");
    setActiveCalendar(null);
    setLogs([
      {
        id: "init",
        timestamp: new Date().toLocaleTimeString(),
        message: "매크로 시뮬레이터가 준비되었습니다. '시작' 버튼을 누르세요.",
        type: "info"
      }
    ]);
  };

  useEffect(() => {
    resetFormValues();
  }, [data]);

  // Scroll to bottom of console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Run simulation step by step
  useEffect(() => {
    if (status !== "running" || currentStep === -1) return;

    let delay = 1600; // time in ms before proceeding to next step
    
    const runCurrentStep = async () => {
      switch (currentStep) {
        case 0:
          addLog(`driver.get("${targetUrl}")`, "command");
          addLog(`메인 창 접속 중... URL: ${targetUrl}`, "info");
          setTimeout(() => {
            addLog("메인 웹사이트 로드 완료. (HTTP Status: 200)", "success");
            setCurrentStep(1);
          }, 1200);
          break;

        case 1:
          addLog(`wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@id='contract_date']/following-sibling::button"))).click()`, "command");
          setActiveCalendar("contract");
          addLog("계약일자 달력 버튼을 클릭하였습니다.", "info");
          
          setTimeout(() => {
            addLog(`datepicker.find_element(By.XPATH, "//a[text()='${data.contract_date.split("-")[2]}']").click()`, "command");
            setSimulatedForm(prev => ({ ...prev, contract_date: data.contract_date }));
            setActiveCalendar(null);
            addLog(`계약일자 자동 입력 완료: ${data.contract_date}`, "success");
            setCurrentStep(2);
          }, 1500);
          break;

        case 2:
          addLog(`Select(driver.find_element(By.ID, "req_kind")).select_by_value("${data.req_kind}")`, "command");
          setSimulatedForm(prev => ({ ...prev, req_kind: data.req_kind }));
          addLog(`신청유형 선택 완료: ${data.req_kind === "P" ? "개인" : data.req_kind === "B" ? "개인사업자" : "단체"}`, "success");
          setCurrentStep(3);
          break;

        case 3:
          addLog(`req_nm_input = wait.until(EC.visibility_of_element_located((By.ID, "req_nm")))`, "command");
          addLog(`req_nm_input.clear()`, "command");
          addLog(`req_nm_input.send_keys("${data.req_nm}")`, "command");
          
          // typing animation mockup
          setSimulatedForm(prev => ({ ...prev, req_nm: data.req_nm }));
          addLog(`신청인 성명 자동 입력 완료: ${data.req_nm}`, "success");
          setCurrentStep(4);
          break;

        case 4:
          addLog(`wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@id='birth_date']/following-sibling::button"))).click()`, "command");
          setActiveCalendar("birth");
          addLog("생년월일 달력 버튼을 클릭하였습니다.", "info");
          
          setTimeout(() => {
            addLog(`datepicker.find_element(By.XPATH, "//a[text()='${data.birth_date.split("-")[2]}']").click()`, "command");
            setSimulatedForm(prev => ({ ...prev, birth_date: data.birth_date }));
            setActiveCalendar(null);
            addLog(`생년월일 자동 입력 완료: ${data.birth_date}`, "success");
            setCurrentStep(5);
          }, 1500);
          break;

        case 5:
          addLog(`driver.find_element(By.XPATH, "//input[@name='req_sex' and @value='${data.req_sex}']").click()`, "command");
          setSimulatedForm(prev => ({ ...prev, req_sex: data.req_sex }));
          addLog(`성별 라디오 선택 완료: ${data.req_sex === "M" ? "남자" : "여자"}`, "success");
          setCurrentStep(6);
          break;

        case 6:
          addLog(`# 3단계 매칭을 통해 신청차종 선택 제어`, "info");
          addLog(`target_model = "${data.model_cd}"`, "command");
          addLog(`model_select = Select(driver.find_element(By.ID, "model_cd"))`, "command");
          addLog(`model_select.select_by_value(target_model)  # (1단계 시도)`, "command");
          
          {
            const matchedCar = CAR_MODELS.find(car => car.value === data.model_cd || car.label === data.model_cd);
            const carLabel = matchedCar ? matchedCar.label : data.model_cd;
            const carValue = matchedCar ? matchedCar.value : data.model_cd;

            setSimulatedForm(prev => ({ ...prev, model_cd: carValue }));
            addLog(`신청차종 자동 선택 완료: ${carLabel} (Value: ${carValue})`, "success");
          }
          setCurrentStep(7);
          break;

        case 7:
          addLog(`req_cnt_input = driver.find_element(By.ID, "req_cnt")`, "command");
          addLog(`req_cnt_input.clear()`, "command");
          addLog(`req_cnt_input.send_keys("${data.req_cnt}")`, "command");
          setSimulatedForm(prev => ({ ...prev, req_cnt: data.req_cnt }));
          addLog(`신청대수 입력 완료: ${data.req_cnt} 대`, "success");
          setCurrentStep(8);
          break;

        case 8:
          addLog(`wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@id='release_date']/following-sibling::button"))).click()`, "command");
          setActiveCalendar("release");
          addLog("출고예정일자 달력 버튼을 클릭하였습니다.", "info");
          
          setTimeout(() => {
            addLog(`datepicker.find_element(By.XPATH, "//a[text()='${data.release_date.split("-")[2]}']").click()`, "command");
            setSimulatedForm(prev => ({ ...prev, release_date: data.release_date }));
            setActiveCalendar(null);
            addLog(`출고예정일자 자동 입력 완료: ${data.release_date}`, "success");
            setCurrentStep(9);
          }, 1500);
          break;

        case 9:
          addLog(`main_window = driver.current_window_handle`, "command");
          addLog(`driver.find_element(By.XPATH, "//button[contains(text(), '주소입력')]").click()`, "command");
          addLog("주소입력 버튼 클릭. 팝업창 대기 중...", "info");
          
          setTimeout(() => {
            addLog(`wait.until(lambda d: len(d.window_handles) > 1)`, "command");
            addLog(`driver.switch_to.window(popup_window)`, "command");
            addLog(`[WINDOW SWITCH] 주소 검색 팝업창으로 포커스를 전환했습니다.`, "window");
            setIsPopupOpen(true);
            setPopupStep("input");
            setCurrentStep(10);
          }, 1500);
          break;

        case 10:
          addLog(`keyword_input = wait.until(EC.visibility_of_element_located((By.ID, "keyword")))`, "command");
          addLog(`keyword_input.send_keys("${data.search_address}")`, "command");
          addLog(`driver.find_element(By.CSS_SELECTOR, ".address-search-wrap button").click()`, "command");
          
          setTimeout(() => {
            setPopupStep("searching");
            addLog(`검색어 "${data.search_address}" 조회 완료.`, "info");
            setTimeout(() => {
              setPopupStep("results");
              addLog(`주소 검색 결과 출력됨.`, "success");
              setCurrentStep(11);
            }, 1000);
          }, 800);
          break;

        case 11:
          addLog(`wait.until(EC.element_to_be_clickable((By.XPATH, "//td[@id='roadAddrTd1']//a"))).click()`, "command");
          addLog(`첫 번째 검색 결과 주소 선택 완료.`, "info");
          
          setTimeout(() => {
            setPopupStep("details");
            addLog(`detail_input = wait.until(EC.visibility_of_element_located((By.ID, "rtAddrDetail")))`, "command");
            addLog(`detail_input.send_keys("${data.detail_address}")`, "command");
            
            setTimeout(() => {
              addLog(`주소 팝업 상세주소 기입 완료.`, "success");
              setCurrentStep(12);
            }, 1000);
          }, 800);
          break;

        case 12:
          addLog(`driver.find_element(By.CSS_SELECTOR, "button.btn-blue").click()`, "command");
          setPopupStep("submitting");
          
          setTimeout(() => {
            setSimulatedForm(prev => ({
              ...prev,
              search_address: data.search_address,
              detail_address: data.detail_address
            }));
            setIsPopupOpen(false);
            setPopupStep("closed");
            addLog(`[WINDOW CLOSE] 주소 팝업창이 전송 후 닫혔습니다.`, "window");
            addLog(`driver.switch_to.window(main_window)`, "command");
            addLog(`메인 폼 화면으로 복귀 완료. 메인 필드에 주소가 반영되었습니다.`, "success");
            setCurrentStep(13);
          }, 1200);
          break;

        case 13:
          addLog(`mobile_input = wait.until(EC.visibility_of_element_located((By.ID, "mobile")))`, "command");
          addLog(`mobile_input.send_keys("${data.mobile}")`, "command");
          addLog(`email_input = wait.until(EC.visibility_of_element_located((By.ID, "email")))`, "command");
          addLog(`email_input.send_keys("${data.email}")`, "command");
          
          setSimulatedForm(prev => ({
            ...prev,
            mobile: data.mobile,
            email: data.email
          }));
          addLog(`연락처 및 이메일 주소 입력 완료: ${data.mobile} / ${data.email}`, "success");
          setCurrentStep(14);
          break;

        case 14:
          addLog(`driver.find_element(By.XPATH, "//input[@name='social_yn' and @value='${data.social_yn}']").click()`, "command");
          setSimulatedForm(prev => ({ ...prev, social_yn: data.social_yn }));
          
          if (data.social_yn === "Y") {
            setTimeout(() => {
              addLog(`Select(driver.find_element(By.ID, "social_kind")).select_by_visible_text("${data.social_kind}")`, "command");
              setSimulatedForm(prev => ({ ...prev, social_kind: data.social_kind }));
              addLog(`신청조건(지원대상): 지원 대상(${data.social_kind}) 선택 완료.`, "success");
              setCurrentStep(15);
            }, 1000);
          } else {
            addLog(`신청조건(지원대상): 지원 대상 아님`, "success");
            setCurrentStep(15);
          }
          break;

        case 15:
          addLog(`driver.find_element(By.ID, "contact_nm").send_keys("${data.contact_nm}")`, "command");
          addLog(`driver.find_element(By.ID, "contact_mobile").send_keys("${data.contact_mobile}")`, "command");
          
          setSimulatedForm(prev => ({
            ...prev,
            contact_nm: data.contact_nm,
            contact_mobile: data.contact_mobile
          }));
          addLog(`제조수입사 담당자 정보 자동 입력 완료: ${data.contact_nm} (${data.contact_mobile})`, "success");
          setCurrentStep(16);
          break;

        case 16:
          addLog(`save_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '임시저장')]")))`, "command");
          addLog(`save_btn.click()`, "command");
          addLog(`임시저장 버튼 클릭 전송 요청 중...`, "info");
          
          setTimeout(() => {
            addLog("[+] 임시저장 전송 성공! 백엔드 DB 데이터베이스 저장 완료.", "success");
            addLog("driver.quit()", "command");
            addLog("브라우저를 안전하게 닫고 셀레늄 프로세스를 완료했습니다.", "info");
            setStatus("completed");
          }, 1800);
          break;

        default:
          break;
      }
    };

    runCurrentStep();
  }, [currentStep, status]);

  const handleStart = () => {
    resetFormValues();
    setStatus("running");
    setCurrentStep(0);
    addLog("자동 입력 매크로 시뮬레이션을 시작합니다. 브라우저 및 드라이버 인스턴스를 기동합니다...", "info");
  };

  // Convert status label
  const getStatusBadge = () => {
    if (status === "running") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100 animate-pulse font-semibold">
          ● 매크로 실행 중 (Step {currentStep}/16)
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 임시저장 완료 (100%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full border border-slate-200/60 font-medium">
        ● 대기 상태
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Simulation Controller */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h3 className="font-sans font-bold text-slate-900 text-base">셀레늄 구동 실시간 시뮬레이터</h3>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            작성된 파이썬 스크립트가 실제 웹 브라우저에서 요소(Element)들을 어떻게 탐색하고 상호작용하는지 가상 돔(DOM)을 통해 테스트합니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-center">
          <button
            onClick={handleStart}
            disabled={status === "running"}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.8 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 ${
              status === "running"
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-100 active:scale-[0.98]"
            }`}
            id="start-simulation-btn"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>시뮬레이션 시작</span>
          </button>
          
          <button
            onClick={resetFormValues}
            className="p-2.8 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all duration-150 active:scale-95 shadow-sm"
            title="초기화"
            id="reset-simulation-btn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Left Form Sandbox, Right Console Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px]">
        {/* Form Sandbox Window */}
        <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col relative">
          {/* Mock Browser Title Bar */}
          <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 block"></span>
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-[10px] text-slate-400 font-mono ml-4 flex items-center gap-2 w-60 md:w-80 truncate shadow-inner">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{targetUrl}</span>
                <ExternalLink className="w-2.5 h-2.5 ml-auto text-slate-300" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold font-sans">신청서 웹 뷰 (샌드박스)</div>
          </div>

          {/* Simulated Web Application Form */}
          <div className="p-6 overflow-auto flex-1 bg-white space-y-6.5 relative max-h-[480px]">
            {/* Dynamic visual overlay for loading/idle states */}
            {currentStep === 0 && (
              <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-3 animate-pulse">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-700">driver.get() 대기 중...</p>
              </div>
            )}
            
            {currentStep === -1 && (
              <div className="absolute inset-0 bg-slate-50/70 z-10 flex flex-col items-center justify-center text-center p-6 backdrop-blur-[1px]">
                <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-100 mb-3 text-indigo-600 animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-slate-800 text-sm">상호작용 시뮬레이션</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed font-medium">
                  '시뮬레이션 시작'을 클릭하면 셀레늄 코드가 폼 필드를 순서대로 스캔하고 값을 자동으로 밀어 넣는 실시간 라이브 영상이 재생됩니다.
                </p>
              </div>
            )}

            {/* Step 2 Form Group - 상단 영역 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>1. 신청서 상단 기본 정보 (Step 2)</span>
                <span className="text-[9px] font-mono tracking-normal text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Selenium Section</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 계약일자 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 1 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>계약일자</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="contract_date"</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="YYYY-MM-DD"
                      value={simulatedForm.contract_date}
                      className="w-full pl-3 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none text-slate-800 font-mono font-medium"
                    />
                    <button className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Simulating Datepicker div inside the relative area for clear visual representation */}
                    {activeCalendar === "contract" && (
                      <div className="absolute left-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 w-56 text-xs animate-fade-in">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-indigo-700">
                          <span>{data.contract_date.split("-")[0]}년 {data.contract_date.split("-")[1]}월</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-2">
                          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 31 }, (_, i) => {
                            const dayNum = i + 1;
                            const isTarget = dayNum === parseInt(data.contract_date.split("-")[2]);
                            return (
                              <button
                                key={i}
                                className={`h-6.5 w-6.5 rounded-md flex items-center justify-center font-mono text-[10px] transition-colors ${
                                  isTarget ? "bg-indigo-600 text-white font-bold animate-ping-once" : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. 신청유형 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 2 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>신청유형</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="req_kind"</span>
                  </label>
                  <select
                    disabled
                    value={simulatedForm.req_kind}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none appearance-none"
                  >
                    <option value="">-- 선택 --</option>
                    <option value="P">개인 (P)</option>
                    <option value="B">개인사업자 (B)</option>
                    <option value="G">단체 (G)</option>
                  </select>
                </div>

                {/* 3. 성명 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 3 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>신청인 성명</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="req_nm"</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={simulatedForm.req_nm}
                    placeholder="성명을 기입하세요"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none font-semibold"
                  />
                </div>

                {/* 4. 생년월일 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 4 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>생년월일</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="birth_date"</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="YYYY-MM-DD"
                      value={simulatedForm.birth_date}
                      className="w-full pl-3 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none text-slate-800 font-mono font-medium"
                    />
                    <button className="absolute right-3 top-2.5 text-slate-400">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </button>

                    {activeCalendar === "birth" && (
                      <div className="absolute left-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 w-56 text-xs animate-fade-in">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-indigo-700">
                          <span>{data.birth_date.split("-")[0]}년 {data.birth_date.split("-")[1]}월</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-2">
                          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 31 }, (_, i) => {
                            const dayNum = i + 1;
                            const isTarget = dayNum === parseInt(data.birth_date.split("-")[2]);
                            return (
                              <button
                                key={i}
                                className={`h-6.5 w-6.5 rounded-md flex items-center justify-center font-mono text-[10px] transition-colors ${
                                  isTarget ? "bg-indigo-600 text-white font-bold animate-ping-once" : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. 성별 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 5 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                    <span>성별</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">name="req_sex"</span>
                  </label>
                  <div className="flex items-center gap-5 py-0.5 font-medium">
                    <label className="flex items-center gap-1.8 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        disabled
                        checked={simulatedForm.req_sex === "M"}
                        className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>남자 (M)</span>
                    </label>
                    <label className="flex items-center gap-1.8 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        disabled
                        checked={simulatedForm.req_sex === "F"}
                        className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>여자 (F)</span>
                    </label>
                  </div>
                </div>

                {/* 6. 신청차종 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 6 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>신청차종</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="model_cd"</span>
                  </label>
                  <select
                    disabled
                    value={simulatedForm.model_cd}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none appearance-none font-medium"
                  >
                    <option value="">-- 차종 선택 --</option>
                    {CAR_MODELS.map((car) => (
                      <option key={car.value} value={car.value}>
                        {car.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. 신청대수 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 7 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>신청대수 (대)</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="req_cnt"</span>
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={simulatedForm.req_cnt}
                    placeholder="대수"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none font-mono font-medium"
                  />
                </div>

                {/* 8. 출고예정일자 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 8 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>출고예정일자</span> <span className="text-rose-500">*</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="release_date"</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      placeholder="YYYY-MM-DD"
                      value={simulatedForm.release_date}
                      className="w-full pl-3 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs focus:outline-none text-slate-800 font-mono font-medium"
                    />
                    <button className="absolute right-3 top-2.5 text-slate-400">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </button>

                    {activeCalendar === "release" && (
                      <div className="absolute left-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 w-56 text-xs animate-fade-in">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 font-bold text-indigo-700">
                          <span>{data.release_date.split("-")[0]}년 {data.release_date.split("-")[1]}월</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-2">
                          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 31 }, (_, i) => {
                            const dayNum = i + 1;
                            const isTarget = dayNum === parseInt(data.release_date.split("-")[2]);
                            return (
                              <button
                                key={i}
                                className={`h-6.5 w-6.5 rounded-md flex items-center justify-center font-mono text-[10px] transition-colors ${
                                  isTarget ? "bg-indigo-600 text-white font-bold animate-ping-once" : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - 주소 영역 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>2. 주소 정보 입력 (Step 3)</span>
                <span className="text-[9px] font-mono tracking-normal text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Selenium Section</span>
              </h4>
              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                (currentStep === 9 || currentStep === 13) ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-slate-100 bg-slate-50/30"
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <span className="text-[9px] block font-mono text-slate-400/85 mb-1 bg-slate-100 px-1.5 py-0.5 rounded w-fit">XPATH: //button[contains(text(), '주소입력')]</span>
                    <button
                      type="button"
                      disabled
                      className="mt-1 flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 font-semibold rounded-lg text-xs transition-all shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      <span>주소입력</span>
                    </button>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                      검색 기본 주소
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="주소입력 버튼을 통해 검색하세요"
                      value={simulatedForm.search_address}
                      className="w-full px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-lg text-xs text-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                    <span>상세 주소 (동, 호수 등)</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="rtAddrDetail"</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="상세 주소가 자동으로 반영됩니다"
                    value={simulatedForm.detail_address}
                    className="w-full px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 - 하단 영역 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>3. 하단 상세 정보 및 제조사 담당 정보 (Step 4)</span>
                <span className="text-[9px] font-mono tracking-normal text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Selenium Section</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 휴대폰 / 이메일 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 13 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>신청인 연락처 (휴대폰)</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="mobile"</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={simulatedForm.mobile}
                    placeholder="010-XXXX-XXXX"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono font-medium"
                  />
                </div>

                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 13 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>이메일 주소</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="email"</span>
                  </label>
                  <input
                    type="email"
                    readOnly
                    value={simulatedForm.email}
                    placeholder="example@email.com"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono font-medium"
                  />
                </div>

                {/* 2. 신청조건 (지원여부) */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 md:col-span-2 ${
                  currentStep === 14 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-2.5 flex items-center gap-1">
                        <span>지원 조건 해당 여부</span>
                        <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">name="social_yn"</span>
                      </label>
                      <div className="flex items-center gap-4 py-0.5 font-medium">
                        <label className="flex items-center gap-1.8 text-xs text-slate-700">
                          <input
                            type="radio"
                            disabled
                            checked={simulatedForm.social_yn === "Y"}
                            className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>지원대상 해당 (Y)</span>
                        </label>
                        <label className="flex items-center gap-1.8 text-xs text-slate-700">
                          <input
                            type="radio"
                            disabled
                            checked={simulatedForm.social_yn === "N"}
                            className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>해당사항 없음 (N)</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                        <span>지원대상 상세 분류</span>
                        <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="social_kind"</span>
                      </label>
                      <select
                        disabled
                        value={simulatedForm.social_kind}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 appearance-none font-medium"
                      >
                        <option value="">-- 지원종류 선택 --</option>
                        <option value="다자녀가구">다자녀가구</option>
                        <option value="생애최초구매">생애최초 구매자</option>
                        <option value="장애인">장애인</option>
                        <option value="국가유공자">국가유공자</option>
                        <option value={data.social_kind}>{data.social_kind}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. 제조수입사 담당자 정보 */}
                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 15 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>제조/수입사 담당자명</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="contact_nm"</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={simulatedForm.contact_nm}
                    placeholder="담당자 이름"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                  />
                </div>

                <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  currentStep === 15 ? "bg-indigo-50/30 border-indigo-500 ring-4 ring-indigo-500/10 glow-active" : "border-transparent"
                }`}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <span>담당자 연락처 (휴대폰)</span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded">id="contact_mobile"</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={simulatedForm.contact_mobile}
                    placeholder="010-XXXX-XXXX"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Form Submissions */}
            <div className="flex justify-end pt-4 border-t border-slate-100 gap-2.5">
              <span className="text-[9px] font-mono text-slate-400 self-center mr-auto bg-slate-100 px-1.5 py-0.5 rounded">XPATH: //button[contains(text(), '임시저장')]</span>
              <button
                type="button"
                disabled
                className={`px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold`}
              >
                취소
              </button>
              <button
                type="button"
                disabled
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentStep === 16 
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 glow-active animate-bounce" 
                    : "bg-indigo-600/85 text-white"
                }`}
                id="temp-save-mock-btn"
              >
                임시저장
              </button>
            </div>
          </div>

          {/* SIMULATED FLOATING ADDRESS POPUP (STEP 3) */}
          {isPopupOpen && (
            <div className="absolute inset-0 bg-slate-900/60 z-30 flex items-center justify-center p-4 animate-fade-in backdrop-blur-[2px]">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md overflow-hidden glow-active ring-4 ring-indigo-500/20">
                {/* Popup Header */}
                <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold font-mono tracking-wide">address_popup.html (switch_to.window)</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">id="popup_window"</span>
                </div>

                {/* Popup Content */}
                <div className="p-5.5 space-y-4 bg-slate-50 text-slate-800">
                  <div className="bg-indigo-50 border border-indigo-100/60 rounded-xl p-3.5 text-[11px] text-indigo-900 flex items-start gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="font-medium">
                      <p className="font-bold text-indigo-950">주소 검색 전용 창 (동적 제어)</p>
                      <p className="text-indigo-700/85 mt-0.5 leading-relaxed">Selenium이 주소 검색창으로 포커스를 전환하여 검색어 입력 및 결과를 수집합니다.</p>
                    </div>
                  </div>

                  {/* 1. Keyword Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-600 flex justify-between">
                      <span>도로명주소/건물명 검색어</span>
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">id="keyword"</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          readOnly
                          value={popupStep !== "input" ? data.search_address : ""}
                          placeholder="도로명 또는 지번 주소 입력"
                          className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                      </div>
                      <button
                        type="button"
                        disabled
                        className="px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shrink-0 flex items-center shadow-sm"
                      >
                        검색
                      </button>
                    </div>
                  </div>

                  {/* 2. Results List (Triggered after 'searching') */}
                  {(popupStep === "results" || popupStep === "details" || popupStep === "submitting") && (
                    <div className="border border-slate-200 bg-white rounded-xl p-2.5 max-h-36 overflow-auto space-y-1.5 shadow-inner">
                      <div className="text-[10px] font-bold text-slate-400 px-1 pb-1 border-b border-slate-100">검색 결과 (1건)</div>
                      <div className="p-2.5 hover:bg-slate-50 rounded-lg text-xs cursor-pointer border border-indigo-200 bg-indigo-50/30">
                        <div className="font-bold text-indigo-900 flex items-center justify-between">
                          <span>{data.search_address} (세교동)</span>
                          <span className="text-[9px] bg-indigo-100/60 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-medium">roadAddrTd1</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">도로명: 경기도 평택시 세교공원로 33 | 우편번호: 17799</div>
                      </div>
                    </div>
                  )}

                  {/* 3. Detail Input & Blue Button */}
                  {(popupStep === "details" || popupStep === "submitting") && (
                    <div className="space-y-3 pt-3 border-t border-slate-200/60">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-600 flex justify-between">
                          <span>상세주소 입력</span>
                          <span className="font-mono text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">id="rtAddrDetail"</span>
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={data.detail_address}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-bold text-slate-800 animate-pulse"
                        />
                      </div>

                      <div className="flex justify-end gap-1.5 pt-1.5">
                        <span className="text-[9px] font-mono text-slate-400 self-center mr-auto bg-slate-100 px-1.5 py-0.5 rounded">CSS: button.btn-blue</span>
                        <button
                          type="button"
                          className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-1.5 animate-bounce"
                        >
                          주소입력
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Selenium CLI & Console Logs */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[550px] lg:h-auto">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4.5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-emerald-400" />
              <span className="text-[11px] font-mono text-slate-300 font-semibold uppercase tracking-wider">Selenium Execution CLI Logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-mono text-slate-500">SYSTEM.LOG</span>
            </div>
          </div>

          {/* Logs Area */}
          <div className="flex-1 overflow-auto p-4.5 font-mono text-xs space-y-3.5 bg-slate-950/80">
            {logs.map((log) => {
              let textClass = "text-slate-300";
              let label = "LOG";
              let labelClass = "bg-slate-800 text-slate-400";

              if (log.type === "success") {
                textClass = "text-emerald-400 font-medium";
                label = "SUCCESS";
                labelClass = "bg-emerald-950/80 text-emerald-400 border border-emerald-900/40";
              } else if (log.type === "command") {
                textClass = "text-indigo-300 font-mono";
                label = "SELENIUM";
                labelClass = "bg-indigo-950/80 text-indigo-400 border border-indigo-900/40";
              } else if (log.type === "window") {
                textClass = "text-fuchsia-400 font-bold";
                label = "HANDLE";
                labelClass = "bg-fuchsia-950/80 text-fuchsia-400 border border-fuchsia-900/40";
              }

              return (
                <div key={log.id} className="space-y-1.5 leading-relaxed border-b border-slate-900/40 pb-2.5 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 font-mono">{log.timestamp}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${labelClass}`}>
                      {label}
                    </span>
                  </div>
                  <div className={`pl-2 border-l border-slate-800 whitespace-pre-wrap break-all ${textClass}`}>
                    {log.message}
                  </div>
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>

          {/* Console Footer Info */}
          <div className="bg-slate-900 px-4.5 py-3.5 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between shrink-0 font-sans">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>예외처리 try-except-finally 감싸짐</span>
            </span>
            <span className="font-mono">Exit Code: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
