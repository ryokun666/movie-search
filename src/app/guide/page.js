"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useTheme } from "../providers";

export default function GuidePage() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  console.log(isDarkMode);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-slate-100"
        }`}
      >
        <Header
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          clearSearch={() => (window.location.href = "/")}
        />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップページに戻る
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            #誰かの映画メモの使い方
          </h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                🎬 このサービスについて
              </h2>
              <div className="space-y-4 text-gray-800 dark:text-gray-100">
                <p>「あー、日曜日暇だから映画でも見るかー」</p>
                <p>「でも何見ようかなぁ...」</p>
                <p>「Netflixのおすすめもなんかイマイチピンとこないなぁ...」</p>
                <p>そんな悩みを持つ全国のソファでダラダラしているあなたへ。</p>
                <p className="mt-4">
                  #誰かの映画メモは、ログイン不要・完全匿名で映画の感想を共有できるサービスです。どこかの誰かが「最近見た！」という生の声を参考に、次の映画との出会いを見つけませんか？
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                🔍 映画を探す
              </h2>
              <p className="text-gray-800 dark:text-gray-100">
                トップページの検索フォームから気になる映画のタイトルを入力するだけ。シンプル
                イズ ベスト！
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                📝 感想を書く
              </h2>
              <div className="space-y-2 ml-4 text-gray-800 dark:text-gray-100">
                <ol className="list-decimal space-y-2">
                  <li>
                    映画を検索して表示された結果から、該当の映画をクリック
                  </li>
                  <li>「感想を書く」ボタンをクリック</li>
                  <li>5段階の星評価で点数をつける</li>
                  <li>お名前を入力（省略可能）</li>
                  <li>感想を自由に記入</li>
                  <li>投稿ボタンをクリック</li>
                </ol>
                <p className="mt-4 text-sm italic">
                  ※お名前を入力しない場合は「匿名希望くん」として投稿されます。匿名希望くんの正体は誰なんだ...？
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                👀 感想を読む
              </h2>
              <div className="text-gray-800 dark:text-gray-100">
                <p>
                  トップページには最近投稿された感想が新しい順に表示されます。映画カードには以下の情報が含まれています：
                </p>
                <ul className="list-disc ml-6 mt-4 space-y-2">
                  <li>映画のタイトルと公開年</li>
                  <li>あらすじ</li>
                  <li>ジャンル</li>
                  <li>キャスト情報</li>
                  <li>配信情報（Netflix等のサブスクリプションサービス）</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                🌓 ダークモード
              </h2>
              <p className="text-gray-800 dark:text-gray-100">
                目に優しいダークモードも搭載！画面右上のアイコンをクリックで切り替えできます。夜遅くまで映画談義に花を咲かせたいあなたにおすすめ。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                ⚠️ 投稿時の注意点
              </h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-100">
                <li>
                  ネタバレは控えめに！驚きの展開は、次に観る人のためにそっと胸にしまっておきましょう
                </li>
                <li>誹謗中傷はNG！建設的な意見や感想をシェアしましょう</li>
                <li>
                  一言感想でもOK！「良かった！」だけでも誰かの参考になるかも？
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                💡 活用例
              </h2>
              <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-100">
                <li>「日曜の昼間、なんとなく映画を観たい気分...」</li>
                <li>
                  「この監督の新作が気になるんだけど、みんなどう思ってるんだろう？」
                </li>
                <li>「最近話題の映画、本当に面白いのかな？」</li>
                <li>
                  「夜中に目が覚めちゃった...誰かの映画の感想でも読もうかな」
                </li>
              </ul>
            </section>

            <section className="mt-12">
              <p className="text-lg text-gray-800 dark:text-gray-100">
                さぁ、あなたも誰かの映画の感想をのぞいてみましょう！
                <br />
                もしかしたら、素敵な映画との出会いが待っているかもしれません。
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
