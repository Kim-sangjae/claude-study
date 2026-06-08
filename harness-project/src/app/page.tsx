import Link from "next/link";
import { questions } from "@/data/questions";

const total = questions.length;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-white">CS Quiz</h1>
          <Link
            href="/mypage"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            마이페이지
          </Link>
        </div>
        <p className="text-neutral-400 mb-8">CS 기초 지식을 30문제로 점검하세요</p>
        <p className="text-sm text-neutral-500 mb-8">전체 {total}문제 중 30개 랜덤 출제</p>
        <Link
          href="/quiz"
          className="rounded-md bg-white text-black text-sm font-medium px-6 py-2.5 hover:bg-neutral-200 transition-colors inline-block"
        >
          문제 풀기 시작
        </Link>
      </div>
    </main>
  );
}
