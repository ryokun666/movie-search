"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Star,
  Clock,
  Globe,
  ThumbsUp,
  Flag,
  MessageCircle,
} from "lucide-react";
import { useComments } from "@/hooks/useComments"; // コメント機能用フック
import { likeStorage } from "@/lib/comments";
import { getRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { getBlurDataUrl } from "@/lib/imageUtils";
import Header from "@/components/Header";
import { useTheme } from "@/app/providers";

const MovieDetailClient = ({ movieId }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, setIsDarkMode } = useTheme();

  // コメント機能用のState
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);

  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
    postComment,
    handleLike,
    handleReport,
  } = useComments(movieId);

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
          {
            params: {
              api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
            },
          }
        );

        // 日本の配信情報（JP）を取得
        setWatchProviders(response.data.results.JP || null);
      } catch (error) {
        console.error("配信情報の取得に失敗しました:", error);
      }
    };

    fetchWatchProviders();
  }, [movieId]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
              language: "ja-JP",
              append_to_response: "credits,videos",
            },
          }
        );

        const movieData = {
          ...response.data,
          poster_url: response.data.poster_path
            ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}`
            : null,
          backdrop_url: response.data.backdrop_path
            ? `https://image.tmdb.org/t/p/original${response.data.backdrop_path}`
            : null,
        };

        setMovie(movieData);
      } catch (error) {
        setError("映画の詳細情報の取得中にエラーが発生しました。");
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    try {
      await postComment({
        movieId: movie.id,
        nickname: nickname.trim() || "匿名希望くん",
        rating,
        comment: comment.trim(),
        movieData: movie,
      });

      setComment("");
      setRating(0);
      setNickname("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const onLikeClick = async (commentId, e) => {
    e.stopPropagation();
    try {
      const success = await handleLike(commentId);
      if (!success) {
        alert("既にいいねしています");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const onReportClick = (commentId, e) => {
    e.stopPropagation();
    setSelectedCommentId(commentId);
    setIsReportModalOpen(true);
  };

  const submitReport = async (reason) => {
    try {
      await handleReport(selectedCommentId, reason);
      setIsReportModalOpen(false);
      setSelectedCommentId(null);
      alert("報告を受け付けました");
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  // 日本語の概要があるかチェック
  const isJapaneseOverview =
    movie.overview &&
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(movie.overview);
  const overview = isJapaneseOverview
    ? movie.overview
    : "日本語の概要は登録されていません。";

  // 言語コードと日本語名のマッピング
  const languageMap = {
    en: "英語",
    ja: "日本語",
    fr: "フランス語",
    de: "ドイツ語",
    zh: "中国語",
    ko: "韓国語",
    es: "スペイン語",
    it: "イタリア語",
    ru: "ロシア語",
    pt: "ポルトガル語",
    ar: "アラビア語",
    hi: "ヒンディー語",
    // 必要に応じて他の言語も追加
  };

  // 言語コードを日本語表記に変換する関数
  const getLanguageName = (code) => {
    return languageMap[code] || code.toUpperCase(); // マッピングがない場合はそのまま表示
  };

  // ブラーデータURLを生成
  const backdropBlurUrl = getBlurDataUrl(1920, 1080); // 背景用の大きいサイズ
  const posterBlurUrl = getBlurDataUrl(500, 750); // ポスター用のサイズ
  const logoBlurUrl = getBlurDataUrl(92, 92); // ロゴ用の小さいサイズ

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-slate-100"
      }`}
    >
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        clearSearch={() => (window.location.href = "/")}
      />
      {/* バックドロップ画像 */}
      {movie.backdrop_url && (
        <div className="relative h-72 w-full">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <Image
            src={movie.backdrop_url}
            alt={movie.title}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            placeholder="blur"
            blurDataURL={backdropBlurUrl}
          />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* 戻るボタン */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mb-4 inline-flex items-center text-white hover:text-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="sm:flex">
            {/* ポスター画像 */}
            <div className="sm:w-1/3 flex-shrink-0 relative aspect-[2/3]">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  placeholder="blur"
                  blurDataURL={posterBlurUrl}
                />
              ) : (
                <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* 映画情報 */}
            <div className="p-6 sm:p-8 flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {movie.title}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{movie.release_date}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{movie.runtime}分</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{getLanguageName(movie.original_language)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">概要</h2>
                <p className="text-gray-600 leading-relaxed">{overview}</p>
              </div>

              {/* ジャンル */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">ジャンル</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 配信情報 */}
              <div className="mt-8 mb-6">
                <h2 className="text-xl font-semibold mb-4">配信情報</h2>
                {watchProviders ? (
                  watchProviders.flatrate ? (
                    <div className="flex flex-wrap gap-4">
                      {watchProviders.flatrate.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="relative w-12 h-12"
                        >
                          <a
                            href={watchProviders.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt={provider.provider_name}
                              fill
                              className="rounded-lg object-cover transition-opacity duration-300"
                              placeholder="blur"
                              blurDataURL={logoBlurUrl}
                            />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      日本での配信情報はありません。
                    </p>
                  )
                ) : (
                  <p className="text-gray-500">配信情報を取得中...</p>
                )}
              </div>

              {/* キャスト */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">キャスト</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.credits.cast.slice(0, 5).map((person) => (
                      <a
                        key={person.id}
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          person.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-sm transition-colors"
                      >
                        {person.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* コメント一覧・フォーム */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  コメント一覧
                </h2>

                {/* コメント投稿フォーム */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 cursor-pointer ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>

                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="ニックネーム（省略可）"
                    className="w-full rounded-md border px-3 py-1.5 text-sm mb-2 border-gray-200"
                    maxLength={20}
                  />

                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="映画の感想を共有しよう..."
                    className="min-h-[80px] text-sm mb-2 bg-white border-gray-200"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim() || rating === 0}
                    variant="post"
                    size="sm"
                    className="w-full"
                  >
                    投稿する
                  </Button>
                </div>

                {/* コメント表示部分 */}
                {commentsLoading ? (
                  <div className="flex justify-center p-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : comments && comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((cmt) => (
                      <div
                        key={cmt.id}
                        className="p-3 border rounded-lg bg-white border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {cmt.nickname}
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={`w-3 h-3 ${
                                    index < cmt.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => onLikeClick(cmt.id, e)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                likeStorage.hasLiked(cmt.id)
                                  ? "bg-blue-50 text-blue-500"
                                  : "bg-gray-50 text-gray-500"
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" /> {cmt.likes}
                            </button>
                            <button
                              onClick={(e) => onReportClick(cmt.id, e)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">{cmt.comment}</p>
                          <div className="text-xs text-gray-500">
                            {getRelativeTime(cmt.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center text-gray-500">
                    まだコメントはありません
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 報告モーダル */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3 text-gray-900">
              コメントを報告
            </h3>
            <div className="space-y-1">
              {["不適切なコンテンツ", "スパム", "ネタバレ", "その他"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => submitReport(reason)}
                    className="w-full text-left p-3 rounded-lg text-sm hover:bg-gray-100 text-gray-700"
                  >
                    {reason}
                  </button>
                )
              )}
            </div>
            <Button
              onClick={() => setIsReportModalOpen(false)}
              variant="outline"
              size="sm"
              className="w-full mt-3"
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailClient;
