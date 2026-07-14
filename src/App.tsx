/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MacroData, CAR_MODELS } from "./types";
import CodePane from "./components/CodePane";
import { 
  Compass, 
  HelpCircle, 
  CheckCircle, 
  User,
  MapPin,
  Mail,
  Smartphone,
  Tag,
  Calendar,
  Layers,
  Settings,
  X,
  FileSpreadsheet
} from "lucide-react";

export default function App() {
  // 1. 초기 입력 데이터셋 정의
  const [data, setData] = useState<MacroData>({
    contract_date: "2026-07-14",
    req_kind: "P",
    req_nm: "홍길동",
    birth_date: "1990-01-01",
    req_sex: "M",
    model_cd: "THENEW5_19_2",
    req_cnt: "1",
    release_date: "2026-08-30",
    search_address: "세교공원로 33",
    detail_address: "303동 1002호",
    mobile: "010-1234-5678",
    email: "hong@example.com",
    social_yn: "Y",
    social_kind: "다자녀가구",
    contact_nm: "이몽룡",
    contact_mobile: "010-9876-5432"
  });

  // 관리자용 탬퍼몽키 스크립트 모달 상태
  const [showAdminModal, setShowAdminModal] = useState(false);
  // 주입 시작 후 완료 피드백용 상태
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const handleDataChange = (field: keyof MacroData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 핵심 연동 및 자동 입력 시작 버튼 핸들러
  const handleStartAutoFill = async () => {
    try {
      // 1) 데이터를 탬퍼몽키가 식별 가능한 단 한 줄의 JSON 스트링으로 변환 및 압축
      const dataString = JSON.stringify(data);
      const encodedData = encodeURIComponent(dataString);

      // 2) 클립보드에 자동 복사 처리 (이원화 연동 fallback)
      await navigator.clipboard.writeText(dataString);

      // 3) 실제 무공해차 보조금 신청서 작성 페이지에 쿼리 파라미터로 데이터를 탑재한 타겟 주소 정의
      const targetUrl = `https://ev.or.kr/ev_ps/ps/seller/sellerApplyform?macro_data=${encodedData}`;

      // 4) 새 창/새 탭으로 사이트 실행
      window.open(targetUrl, "_blank", "noopener,noreferrer");

      // 5) 고령 직원 눈높이에 맞춘 친절한 성공 알림배너 트리거
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 8000);

    } catch (err) {
      // 클립보드 복사 실패 시에도 새 탭 이동 처리 보장
      const dataString = JSON.stringify(data);
      const encodedData = encodeURIComponent(dataString);
      const targetUrl = `https://ev.or.kr/ev_ps/ps/seller/sellerApplyform?macro_data=${encodedData}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 8500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 고령 친화적 고대비 고정 헤더 */}
      <header className="bg-emerald-700 text-white shadow-md border-b border-emerald-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-emerald-700 p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-tight">
                초간단 무공해차 보조금 신청서 자동 주입기
              </h1>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                사무실 전용 스마트 폼 자동 작성 보조 서비스
              </p>
            </div>
          </div>

          {/* 눈에 잘 안 띄는 미니멀한 관리자 설정 링크 */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 rounded-lg text-emerald-100 hover:text-white text-xs font-semibold transition-all duration-150 active:scale-95 border border-emerald-600/30 shadow-inner"
            title="최초 1회 탬퍼몽키 설정용"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">관리자 설정</span>
          </button>
        </div>
      </header>

      {/* 메인 본문 영역 (상/하 분할 없이 1열 구조로 배치해 가독성 극대화) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* 아주 친절하고 쉬운 한글 가이드보드 */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-1.5">
          <h2 className="text-sm font-extrabold text-emerald-900 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>이것만 따라해 주세요! (쉬운 2단계 사용법)</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            1. 아래 빈칸에 기입할 신청인과 차량 정보를 <strong className="text-emerald-700 font-bold">빠짐없이 입력</strong>해 주세요. <br />
            2. 아래에 있는 큰 초록색 <strong className="text-emerald-700 font-bold">[⚡ 신청서 자동 입력 시작]</strong> 버튼을 누르면 끝납니다!
          </p>
        </div>

        {/* 폼 카드: 모든 입력 필드는 큰 글씨와 충분한 높이, 여백을 적용해 터치 및 인지 극대화 */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 tracking-wider">신청서 기입 데이터 일괄 기재</span>
            <span className="text-[10px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full font-bold">16개 정보 자동 주입</span>
          </div>

          <div className="p-6 space-y-6">
            
            {/* 1. 신청 / 차종 정보 */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-500" /> 
                <span className="text-xs font-bold">1. 신청 및 차종 정보</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">계약일자</label>
                  <input
                    type="date"
                    value={data.contract_date}
                    onChange={(e) => handleDataChange("contract_date", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">신청유형 선택</label>
                  <select
                    value={data.req_kind}
                    onChange={(e) => handleDataChange("req_kind", e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold text-slate-800 transition-all"
                  >
                    <option value="P">개인 (P)</option>
                    <option value="B">개인사업자 (B)</option>
                    <option value="G">단체 (G)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">신청차종 지정</label>
                  <select
                    value={data.model_cd}
                    onChange={(e) => handleDataChange("model_cd", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold text-emerald-800 transition-all"
                  >
                    {CAR_MODELS.map((car) => (
                      <option key={car.value} value={car.value}>
                        {car.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">신청대수 (대)</label>
                  <input
                    type="number"
                    min="1"
                    value={data.req_cnt}
                    onChange={(e) => handleDataChange("req_cnt", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">출고예정일자</label>
                <input
                  type="date"
                  value={data.release_date}
                  onChange={(e) => handleDataChange("release_date", e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all"
                />
              </div>
            </div>

            {/* 2. 신청인 인적 사항 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg">
                <User className="w-4 h-4 text-slate-500" /> 
                <span className="text-xs font-bold">2. 신청인 개인정보 기입</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">성명 (이름)</label>
                  <input
                    type="text"
                    value={data.req_nm}
                    onChange={(e) => handleDataChange("req_nm", e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">생년월일</label>
                  <input
                    type="date"
                    value={data.birth_date}
                    onChange={(e) => handleDataChange("birth_date", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2">성별 구분</label>
                <div className="flex gap-8 items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-700 cursor-pointer font-bold group select-none">
                    <input
                      type="radio"
                      name="req_sex_config"
                      checked={data.req_sex === "M"}
                      onChange={() => handleDataChange("req_sex", "M")}
                      className="w-4.5 h-4.5 border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all cursor-pointer"
                    />
                    <span className="group-hover:text-slate-900">남자 (M)</span>
                  </label>
                  <label className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-700 cursor-pointer font-bold group select-none">
                    <input
                      type="radio"
                      name="req_sex_config"
                      checked={data.req_sex === "F"}
                      onChange={() => handleDataChange("req_sex", "F")}
                      className="w-4.5 h-4.5 border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all cursor-pointer"
                    />
                    <span className="group-hover:text-slate-900">여자 (F)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">휴대폰 번호</label>
                  <input
                    type="text"
                    value={data.mobile}
                    onChange={(e) => handleDataChange("mobile", e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">이메일 주소</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleDataChange("email", e.target.value)}
                    placeholder="예: email@example.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 3. 주소 정보 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-slate-500" /> 
                <span className="text-xs font-bold">3. 신청인 주소지 정보</span>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">검색용 대표 주소</label>
                <input
                  type="text"
                  value={data.search_address}
                  onChange={(e) => handleDataChange("search_address", e.target.value)}
                  placeholder="예: 세교공원로 33"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">동·호수 등 상세 주소</label>
                <input
                  type="text"
                  value={data.detail_address}
                  onChange={(e) => handleDataChange("detail_address", e.target.value)}
                  placeholder="예: 303동 1002호"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-semibold transition-all text-slate-800"
                />
              </div>
            </div>

            {/* 4. 지원 대상 상세 분류 및 제조사 담당자 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg">
                <Tag className="w-4 h-4 text-slate-500" /> 
                <span className="text-xs font-bold">4. 지원 자격 및 제조사 담당자 기입</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">우선 지원대상 여부</label>
                  <div className="flex gap-4 items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-bold group select-none">
                      <input
                        type="radio"
                        name="social_yn_config"
                        checked={data.social_yn === "Y"}
                        onChange={() => handleDataChange("social_yn", "Y")}
                        className="w-4 h-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900">대상임 (Y)</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-bold group select-none">
                      <input
                        type="radio"
                        name="social_yn_config"
                        checked={data.social_yn === "N"}
                        onChange={() => handleDataChange("social_yn", "N")}
                        className="w-4 h-4 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-900">해당없음 (N)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">지원 세부 종류 선택</label>
                  <select
                    disabled={data.social_yn === "N"}
                    value={data.social_kind}
                    onChange={(e) => handleDataChange("social_kind", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-300 disabled:border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold text-slate-800 transition-all"
                  >
                    <option value="다자녀가구">다자녀가구</option>
                    <option value="생애최초구매">생애최초 구매</option>
                    <option value="장애인">장애인</option>
                    <option value="국가유공자">국가유공자</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">제조수입사 담당자 이름</label>
                  <input
                    type="text"
                    value={data.contact_nm}
                    onChange={(e) => handleDataChange("contact_nm", e.target.value)}
                    placeholder="예: 이몽룡"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-bold transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">제조담당 연락처</label>
                  <input
                    type="text"
                    value={data.contact_mobile}
                    onChange={(e) => handleDataChange("contact_mobile", e.target.value)}
                    placeholder="예: 010-9876-5432"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 font-medium transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ⚡ 아주 크고 선명한 단 하나의 실행용 녹색 버튼 */}
        <div className="pt-2">
          <button
            onClick={handleStartAutoFill}
            className="w-full py-5.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-emerald-950/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2.5 border-2 border-emerald-700"
            id="btn-auto-fill-trigger"
          >
            <span className="text-xl sm:text-2xl animate-pulse">⚡</span>
            <span>신청서 자동 입력 시작 (실시간)</span>
          </button>
        </div>

        {/* 고령 직원을 위한 실시간 기입 안내 피드백 배너 */}
        {showSuccessBanner && (
          <div className="bg-emerald-800 text-white p-5 rounded-2xl border-2 border-emerald-900 shadow-2xl flex items-start gap-3.5 animate-fadeIn duration-300">
            <span className="text-2xl mt-0.5">🎉</span>
            <div className="space-y-1">
              <p className="font-extrabold text-sm sm:text-base">
                [자동 입력 신호 전송 완료]
              </p>
              <p className="text-xs text-emerald-100 leading-relaxed font-semibold">
                입력하신 소중한 직원 데이터 세트가 컴퓨터에 올바르게 동기화되었습니다.<br />
                새 창으로 열린 실제 신청서 화면에서 <strong className="text-white underline">탬퍼몽키(Tampermonkey) 매크로</strong>가 실행되어 모든 항목을 자동으로 작성합니다. 잠시만 기다려주세요!
              </p>
            </div>
          </div>
        )}

      </main>

      {/* 시스템 관리자용 스크립트 설치 팝업 모달 */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4.5 right-4.5 z-10 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <CodePane onClose={() => setShowAdminModal(false)} />
          </div>
        </div>
      )}

      {/* 극도로 가독성을 낮춘 심플한 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 shrink-0 font-medium">
        <p>© 2026 무공해차 보조금 신청서 자동 주입 웹 에디션. Google AI Studio Build Applet.</p>
        <p className="mt-1 font-mono text-[9.5px] text-slate-300">Target Environment: Tampermonkey Userscript v1.2 Standard</p>
      </footer>
    </div>
  );
}

