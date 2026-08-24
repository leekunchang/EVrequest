export interface ScriptConfig {
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // HH:mm:ss
  targetMillis: number; // 0-999
  earlyOffsetMs: number; // e.g. 0, -30, -50
  rttSamples: number; // 3, 5, 10
  showFloatingHud: boolean;
  bypassConfirm: boolean;
  bypassAlert: boolean;
  playBeepOnTrigger: boolean;
  retryAttempts: number;
  retryIntervalMs: number;
  syncMethod: 'HEAD' | 'GET';
  targetFunction: string; // default: goApply('101', '지원신청서를 제출 하시겠습니까?')
  fallbackSelector: string; // default: .btn-blue.btn_step100, .btn_step100
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'sync';
  message: string;
}
