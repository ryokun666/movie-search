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

          <h1
            className={`text-2xl sm:text-3xl mt-4 font-bold mb-6 sm:mb-8 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            『#誰かの映画メモ』ってなんだ？
          </h1>

          <div className="space-y-8 sm:space-y-12">
            <section>
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                🎬 このサービスについて
              </h2>
              <div
                className={`space-y-3 sm:space-y-4 text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
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
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                🔍 映画を探す
              </h2>
              <p
                className={`text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                トップページの検索フォームから気になる映画のタイトルを入力するだけ。シンプル
                イズ ベスト！
              </p>
            </section>

            <section>
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                📝 感想を書く
              </h2>
              <div
                className={`space-y-2 ml-4 text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <ol className="list-decimal space-y-2 sm:space-y-3">
                  <li>
                    映画を検索して表示された結果から、該当の映画をクリック
                  </li>
                  <li>「感想を書く」ボタンをクリック</li>
                  <li>5段階の星評価で点数をつける</li>
                  <li>お名前を入力（省略可能）</li>
                  <li>感想を自由に記入</li>
                  <li>投稿ボタンをクリック</li>
                </ol>
                <p className="mt-4 text-sm sm:text-base italic">
                  ※お名前を入力しない場合は「匿名希望くん」として投稿されます。匿名希望くんの正体は誰なんだ...？
                </p>
              </div>
            </section>

            <section>
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                👀 感想を読む
              </h2>
              <div
                className={`text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <p>
                  トップページには最近投稿された感想が新しい順に表示されます。映画カードには以下の情報が含まれています：
                </p>
                <ul className="list-disc ml-6 mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                  <li>映画のタイトルと公開年</li>
                  <li>あらすじ</li>
                  <li>ジャンル</li>
                  <li>キャスト情報</li>
                  <li>配信情報（Netflix等のサブスクリプションサービス）</li>
                </ul>
              </div>
            </section>

            <section>
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                🌓 ダークモード
              </h2>
              <p
                className={`text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                目に優しいダークモードも搭載！画面右上のアイコンをクリックで切り替えできます。夜遅くまで映画談義に花を咲かせたいあなたにおすすめ。
              </p>
            </section>

            <section>
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                ⚠️ 投稿時の注意点
              </h2>
              <ul
                className={`list-disc ml-6 space-y-2 sm:space-y-3 text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
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
              <h2
                className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                💡 活用例
              </h2>
              <ul
                className={`list-disc ml-6 space-y-2 sm:space-y-3 text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
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
              <p
                className={`text-base sm:text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                さぁ、あなたも誰かの映画の感想をのぞいてみましょう！
                <br />
                もしかしたら、素敵な映画との出会いが待っているかもしれません。
              </p>
            </section>

            <div className="flex justify-center mt-8 sm:mt-12">
              <Link
                href="/"
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                } shadow-sm`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                トップページへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
