/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MacroData {
  contract_date: string;
  req_kind: "P" | "B" | "G"; // 개인(P), 개인사업자(B), 단체(G)
  req_nm: string;
  birth_date: string;
  req_sex: "M" | "F"; // 남자(M), 여자(F)
  model_cd: string;
  req_cnt: string;
  release_date: string;
  search_address: string;
  detail_address: string;
  mobile: string;
  email: string;
  social_yn: "Y" | "N"; // Y 또는 N
  social_kind: string;
  contact_nm: string;
  contact_mobile: string;
}

export interface MacroSettings {
  headless: boolean;
  noSandbox: boolean;
  disableGpu: boolean;
  timeout: number;
  targetUrl: string;
}

export interface SimulationStep {
  id: number;
  stepName: string;
  title: string;
  description: string;
  codeSnippet: string;
  status: "idle" | "running" | "completed" | "error";
  targetField?: keyof MacroData | string;
}

export const CAR_MODELS = [
  { value: "GV60_2WD_19", label: "GV60 스탠다드 2WD 19인치 / 일반승용" },
  { value: "GV60_4WD_19", label: "GV60 스탠다드 AWD 19인치 / 일반승용" },
  { value: "GV60_4WD_20", label: "GV60 스탠다드 AWD 20인치 / 일반승용" },
  { value: "KONA_2WD_S17", label: "코나 일렉트릭 2WD 스탠다드 17인치 / 일반승용" },
  { value: "KONA_2WD_L17", label: "코나 일렉트릭 2WD 롱레인지 17인치 / 일반승용" },
  { value: "IONIQ6N", label: "아이오닉6 N / 일반승용" },
  { value: "CONA_ELEC_1", label: "코나 일렉트릭 2WD 롱레인지 17인치 빌트인 캠 미적용 / 일반승용" },
  { value: "CONA_ELEC_2", label: "코나 일렉트릭 2WD 롱레인지 19인치 / 일반승용" },
  { value: "GV70_1", label: "ELECTRIFIED GV70 AWD 19인치 / 일반승용" },
  { value: "GV70_2", label: "ELECTRIFIED GV70 AWD 20인치 / 일반승용" },
  { value: "ELECTRIFIED_G80", label: "ELECTRIFIED G80 / 일반승용" },
  { value: "THENEW5_19_1", label: "더 뉴 아이오닉5 2WD 스탠다드 19인치 / 일반승용" },
  { value: "THENEW5_19_2", label: "더 뉴 아이오닉5 2WD 롱레인지 19인치 / 일반승용" },
  { value: "THENEW5_19_3", label: "더 뉴 아이오닉5 2WD 롱레인지 19인치 빌트인 캠 미적용 / 일반승용" },
  { value: "THENEW5_20_1", label: "더 뉴 아이오닉5 2WD 롱레인지 20인치 / 일반승용" },
  { value: "THENEW5_20_2", label: "더 뉴 아이오닉5 2WD 롱레인지 N라인 20인치 / 일반승용" },
  { value: "THENEW5_19_4", label: "더 뉴 아이오닉5 AWD 롱레인지 19인치 / 일반승용" },
  { value: "THENEW5_20_3", label: "더 뉴 아이오닉5 AWD 롱레인지 20인치 / 일반승용" },
  { value: "THENEW5_20_4", label: "더 뉴 아이오닉5 AWD 롱레인지 N라인 20인치 / 일반승용" },
  { value: "THENEW6_18_1", label: "더 뉴 아이오닉6 2WD 스탠다드 18인치 / 일반승용" },
  { value: "THENEW6_18_2", label: "더 뉴 아이오닉6 2WD 롱레인지 18인치 / 일반승용" },
  { value: "THENEW6_20_1", label: "더 뉴 아이오닉6 2WD 롱레인지 20인치 / 일반승용" },
  { value: "THENEW6_20_2", label: "더 뉴 아이오닉6 2WD 롱레인지 N라인 20인치 / 일반승용" },
  { value: "THENEW6_18_3", label: "더 뉴 아이오닉6 AWD 롱레인지 18인치 / 일반승용" },
  { value: "THENEW6_20_3", label: "더 뉴 아이오닉6 AWD 롱레인지 20인치 / 일반승용" },
  { value: "THENEW6_20_4", label: "더 뉴 아이오닉6 AWD 롱레인지 N라인 20인치 / 일반승용" },
  { value: "IONIQ9_STD_AWD", label: "아이오닉9 성능형 AWD / 일반승용" },
  { value: "IONIQ9_ACT_2WD", label: "아이오닉9 항속형 2WD / 일반승용" },
  { value: "IONIQ9_ACT_AWD", label: "아이오닉9 항속형 AWD / 일반승용" },
  { value: "STARL_PE_EV_6", label: "스타리아 리무진 일렉트릭 6인승 / 일반승용" },
  { value: "STARR_PE_EV_7", label: "스타리아 라운지 일렉트릭 7인승 / 일반승용" },
  { value: "CASPER_L17", label: "캐스퍼 일렉트릭 항속형 17인치(라운지포함) / 경·소형" },
  { value: "CASPER_L15", label: "캐스퍼 일렉트릭 항속형 15인치 / 경·소형" },
  { value: "CASPER_S15", label: "캐스퍼 일렉트릭 기본형 15인치 / 경·소형" },
  { value: "CASPER_C17", label: "캐스퍼 일렉트릭 크로스 17인치 / 경·소형" }
];
