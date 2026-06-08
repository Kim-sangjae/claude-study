import type { QuizResult } from '@/types';

const HISTORY_KEY = 'cs-quiz-history';
const MAX_ENTRIES = 20;

export function saveHistory(result: QuizResult): void {
  try {
    const existing = loadHistory();
    const updated = [result, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
}

export function loadHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : [];
  } catch {
    return [];
  }
}
