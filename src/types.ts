export type TimeMode = 'server' | 'browser';
export type SelectorStrategy = 'combined' | 'text' | 'onclick' | 'custom';

export interface ScriptConfig {
  targetDate: string; // YYYY-MM-DD
  targetTime: string; // HH:mm:ss
  milliseconds: number; // 0-999
  timeMode: TimeMode;
  selectorStrategy: SelectorStrategy;
  customText: string;
  customOnclick: string;
  customSelector: string;
  checkIntervalMs: number; // e.g., 10ms
  offsetMs: number; // e.g., 0ms or -20ms
  retryCount: number; // 1-5
  retryIntervalMs: number; // e.g. 50ms
  playBeep: boolean;
  autoReloadIfNotFound: boolean;
}

export interface PresetTime {
  label: string;
  getDateTime: () => { date: string; time: string; ms: number };
}
