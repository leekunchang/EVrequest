export function formatTime2Digits(val: number): string {
  return String(val).padStart(2, '0');
}

export function formatTime3Digits(val: number): string {
  return String(val).padStart(3, '0');
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = formatTime2Digits(now.getMonth() + 1);
  const d = formatTime2Digits(now.getDate());
  return `${y}-${m}-${d}`;
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const y = tomorrow.getFullYear();
  const m = formatTime2Digits(tomorrow.getMonth() + 1);
  const d = formatTime2Digits(tomorrow.getDate());
  return `${y}-${m}-${d}`;
}

export function getPresetTarget(type: 'today-9am' | 'today-10am' | 'today-2pm' | 'plus-10s' | 'plus-30s' | 'plus-1m'): {
  date: string;
  time: string;
  millis: number;
} {
  const now = new Date();

  switch (type) {
    case 'today-9am':
      return {
        date: getTodayDateString(),
        time: '09:00:00',
        millis: 0,
      };
    case 'today-10am':
      return {
        date: getTodayDateString(),
        time: '10:00:00',
        millis: 0,
      };
    case 'today-2pm':
      return {
        date: getTodayDateString(),
        time: '14:00:00',
        millis: 0,
      };
    case 'plus-10s': {
      const target = new Date(now.getTime() + 10 * 1000);
      return {
        date: `${target.getFullYear()}-${formatTime2Digits(target.getMonth() + 1)}-${formatTime2Digits(target.getDate())}`,
        time: `${formatTime2Digits(target.getHours())}:${formatTime2Digits(target.getMinutes())}:${formatTime2Digits(target.getSeconds())}`,
        millis: 0,
      };
    }
    case 'plus-30s': {
      const target = new Date(now.getTime() + 30 * 1000);
      return {
        date: `${target.getFullYear()}-${formatTime2Digits(target.getMonth() + 1)}-${formatTime2Digits(target.getDate())}`,
        time: `${formatTime2Digits(target.getHours())}:${formatTime2Digits(target.getMinutes())}:${formatTime2Digits(target.getSeconds())}`,
        millis: 0,
      };
    }
    case 'plus-1m': {
      const target = new Date(now.getTime() + 60 * 1000);
      return {
        date: `${target.getFullYear()}-${formatTime2Digits(target.getMonth() + 1)}-${formatTime2Digits(target.getDate())}`,
        time: `${formatTime2Digits(target.getHours())}:${formatTime2Digits(target.getMinutes())}:${formatTime2Digits(target.getSeconds())}`,
        millis: 0,
      };
    }
  }
}
