"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import { loadHistory } from "@/lib/history";
import type { QuizResult, Category } from "@/types";

const CATEGORY_LABELS: Record<Category, string> = {
  ds: "자료구조",
  algo: "알고리즘",
  os: "OS",
  network: "네트워크",
  db: "DB",
  arch: "컴퓨터구조",
};

const CATEGORY_ORDER: Category[] = ["ds", "algo", "os", "network", "db", "arch"];

type BadgeTier = "bronze" | "silver" | "gold";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  );
}

function getLevel(total: number): number {
  if (total >= 300) return 4;
  if (total >= 150) return 3;
  if (total >= 50) return 2;
  return 1;
}

function getBadge(accuracy: number, total: number): BadgeTier | null {
  if (total === 0 || accuracy < 30) return null;
  if (accuracy >= 90) return "gold";
  if (accuracy >= 60) return "silver";
  return "bronze";
}

function BadgePill({ tier }: { tier: BadgeTier }) {
  const styles: Record<BadgeTier, string> = {
    bronze: "bg-amber-950/60 text-amber-600 border border-amber-800/60",
    silver: "bg-slate-800/60 text-slate-300 border border-slate-600/60",
    gold: "bg-yellow-950/60 text-yellow-400 border border-yellow-700/60",
  };
  const labels: Record<BadgeTier, string> = {
    bronze: "BRONZE",
    silver: "SILVER",
    gold: "GOLD",
  };
  return (
    <span className={`text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded ${styles[tier]}`}>
      {labels[tier]}
    </span>
  );
}

function computeProfileStats(history: QuizResult[]) {
  const map = new Map<Category, { total: number; correct: number }>();

  for (const result of history) {
    for (const q of result.questions) {
      const entry = map.get(q.category) ?? { total: 0, correct: 0 };
      entry.total++;
      const ans = result.answers.find((a) => a.questionId === q.id);
      if (ans?.selected === q.answer) entry.correct++;
      map.set(q.category, entry);
    }
  }

  return CATEGORY_ORDER.map((cat) => {
    const { total, correct } = map.get(cat) ?? { total: 0, correct: 0 };
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      cat,
      label: CATEGORY_LABELS[cat],
      total,
      accuracy,
      level: getLevel(total),
      badge: getBadge(accuracy, total),
    };
  });
}

function getCategoryStats(
  result: QuizResult
): Array<{ cat: Category; label: string; correct: number; total: number }> {
  const map = new Map<Category, { correct: number; total: number }>();

  for (const q of result.questions) {
    const entry = map.get(q.category) ?? { correct: 0, total: 0 };
    entry.total++;
    const ans = result.answers.find((a) => a.questionId === q.id);
    if (ans?.selected === q.answer) entry.correct++;
    map.set(q.category, entry);
  }

  return Array.from(map.entries()).map(([cat, stats]) => ({
    cat,
    label: CATEGORY_LABELS[cat],
    ...stats,
  }));
}

export default function MyPage() {
  const router = useRouter();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedWrongId, setExpandedWrongId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const profileStats = computeProfileStats(history);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/")}
          className="text-neutral-400 hover:text-white text-sm transition-colors"
        >
          ← 홈
        </button>
        <h1 className="text-xl font-semibold text-white">마이페이지</h1>
      </div>

      {/* 카테고리별 프로필 */}
      <div className="bg-[#111111] border border-neutral-800 rounded-lg p-5 mb-6">
        <p className="text-xs text-neutral-500 mb-4">카테고리별 현황</p>
        <div className="space-y-2.5">
          {profileStats.map(({ cat, label, total, accuracy, level, badge }) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-sm text-neutral-300 w-16 flex-shrink-0">{label}</span>
              <span className="text-[10px] text-neutral-600 border border-neutral-800 rounded px-1.5 py-0.5 flex-shrink-0">
                Lv.{level}
              </span>
              {badge ? (
                <BadgePill tier={badge} />
              ) : (
                <span className="w-[46px]" />
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-neutral-600">{total}문제</span>
                <span className="text-xs text-neutral-400 w-8 text-right">
                  {total > 0 ? `${accuracy}%` : "–"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-sm mb-4">
            아직 풀이 기록이 없습니다.
          </p>
          <button
            onClick={() => router.push("/quiz")}
            className="rounded-md bg-white text-black text-sm font-medium px-6 py-2.5 hover:bg-neutral-200 transition-colors"
          >
            첫 문제 풀기
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-3">풀이 기록</p>
          <div className="space-y-3">
            {history.map((entry, idx) => {
              const isExpanded = expandedId === entry.submittedAt;
              const scoreColor =
                entry.score >= 27
                  ? "text-green-400"
                  : entry.score >= 21
                  ? "text-yellow-400"
                  : "text-red-400";
              const catStats = getCategoryStats(entry);
              const wrongItems = entry.questions
                .map((q, i) => ({
                  question: q,
                  questionNumber: i + 1,
                  userAnswer: entry.answers.find((a) => a.questionId === q.id),
                }))
                .filter(
                  ({ question, userAnswer }) =>
                    !!userAnswer && userAnswer.selected !== question.answer
                );

              return (
                <div
                  key={entry.submittedAt}
                  className="bg-[#111111] border border-neutral-800 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full text-left px-5 py-4 hover:bg-[#161616] transition-colors"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : entry.submittedAt)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-neutral-500">
                        #{history.length - idx}회 · {formatDate(entry.submittedAt)}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className={`text-xl font-bold ${scoreColor}`}>
                          {entry.score}
                          <span className="text-neutral-500 text-sm font-normal">
                            {" "}
                            / 30
                          </span>
                        </span>
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className={`text-neutral-600 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {catStats.map(({ cat, label, correct, total }) => (
                        <span
                          key={cat}
                          className="text-xs text-neutral-500 border border-neutral-800 rounded px-2 py-0.5"
                        >
                          {label} {correct}/{total}
                        </span>
                      ))}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-neutral-800 px-5 py-5">
                      {wrongItems.length === 0 ? (
                        <p className="text-green-400 text-sm text-center py-4">
                          모든 문제를 맞혔습니다!
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-neutral-500 mb-3">
                            오답 {wrongItems.length}문제
                          </p>
                          <div className="space-y-1">
                            {wrongItems.map((item) => {
                              const wrongKey = `${entry.submittedAt}-${item.question.id}`;
                              const isWrongExpanded = expandedWrongId === wrongKey;
                              return (
                                <div key={item.question.id}>
                                  <button
                                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-[#1a1a1a] transition-colors flex items-center justify-between gap-3"
                                    onClick={() =>
                                      setExpandedWrongId(
                                        isWrongExpanded ? null : wrongKey
                                      )
                                    }
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-xs text-neutral-600 flex-shrink-0">
                                        {item.questionNumber}.
                                      </span>
                                      <span className="text-xs text-neutral-600 border border-neutral-800 rounded px-1.5 py-0.5 flex-shrink-0">
                                        {item.question.category}
                                      </span>
                                      <span className="text-sm text-neutral-400 truncate">
                                        {item.question.question}
                                      </span>
                                    </div>
                                    <svg
                                      width={12}
                                      height={12}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      className={`text-neutral-600 flex-shrink-0 transition-transform ${
                                        isWrongExpanded ? "rotate-180" : ""
                                      }`}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                  {isWrongExpanded && (
                                    <div className="mt-2 mb-2">
                                      <ResultCard
                                        questionNumber={item.questionNumber}
                                        question={item.question}
                                        userSelected={item.userAnswer!.selected}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
