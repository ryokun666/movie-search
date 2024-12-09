// src/components/MovieCard.jsx
import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  Calendar,
  Info,
  Flag,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "@/hooks/useComments";
import { likeStorage } from "@/lib/comments";
import { getRelativeTime } from "@/lib/utils";
import { useConfetti } from "@/hooks/useConfetti";

export default function MovieCard({ movie, viewMode, isDarkMode }) {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  // カスタムフックを使用してコメント機能を実装
  const { comments, isLoading, error, postComment, handleLike, handleReport } =
    useComments(movie.id);

  const { triggerConfetti } = useConfetti();

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    try {
      await postComment({
        movieId: movie.id,
        nickname: nickname.trim() || `匿名${Math.floor(Math.random() * 1000)}`,
        rating,
        comment: comment.trim(),
        movieData: movie,
      });

      triggerConfetti();
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

  const handleCardClick = (e) => {
    if (e.target.closest(".comment-section")) {
      e.stopPropagation();
      return;
    }
    window.location.href = `/movies/${movie.id}`;
  };

  // 最新のコメントを取得
  const featuredComment = comments && comments.length > 0 ? comments[0] : null;

  return (
    <div
      onClick={handleCardClick}
      className={`${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-white hover:shadow-lg"
      } rounded-xl shadow transition-all duration-200 overflow-hidden cursor-pointer`}
    >
      {/* カード全体をグリッドレイアウトに */}
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        {/* ポスター画像: モバイルでは4列、デスクトップでは5列 */}
        <div className="col-span-4 md:col-span-5">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover aspect-[2/3]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full aspect-[2/3] bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Info className="text-gray-400" size={48} />
            </div>
          )}
        </div>

        {/* コンテンツ部分: モバイルでは8列、デスクトップでは7列 */}
        <div className="col-span-8 md:col-span-7 p-3 md:p-4 flex flex-col">
          {/* ヘッダー部分 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h2
                className={`text-base md:text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } line-clamp-2`}
              >
                {movie.title}
              </h2>
            </div>
            <div className="text-xs text-gray-500">
              {movie.release_date?.split("-")[0]}
            </div>
          </div>

          {/* コメントセクション */}
          <div className="flex-1 mt-2">
            {isLoading ? (
              <div className="flex justify-center p-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : featuredComment ? (
              <div className="comment-section">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-medium text-sm truncate ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {featuredComment.nickname}
                    </span>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3 h-3 ${
                            index < featuredComment.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <button
                      onClick={(e) => onLikeClick(featuredComment.id, e)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        likeStorage.hasLiked(featuredComment.id)
                          ? "bg-blue-50 text-blue-500"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" /> {featuredComment.likes}
                    </button>
                    <button
                      onClick={(e) => onReportClick(featuredComment.id, e)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } line-clamp-2`}
                  >
                    {featuredComment.comment}
                  </p>
                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {getRelativeTime(featuredComment.timestamp)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500">
                まだコメントはありません
              </p>
            )}
          </div>

          {/* アクションボタン */}
          <div className="mt-3">
            <Collapsible className="comment-section">
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">感想を書く</span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-3 space-y-3">
                  {/* コメント入力フォーム */}
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
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
                      className={`w-full rounded-md border px-3 py-1.5 text-sm mb-2 ${
                        isDarkMode
                          ? "bg-gray-800 text-white border-gray-600 placeholder:text-gray-400"
                          : "bg-white text-gray-900 border-gray-200 placeholder:text-gray-500"
                      }`}
                      maxLength={20}
                    />

                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="映画の感想を共有しよう..."
                      className={`min-h-[80px] text-sm mb-2 ${
                        isDarkMode
                          ? "bg-gray-800 text-white border-gray-600"
                          : "bg-white text-gray-900"
                      }`}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={!comment.trim() || rating === 0}
                      variant="post"
                      size="sm"
                      className="w-full"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold">投稿する</span>
                        {rating > 0 && comment.trim() ? (
                          <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                            Ready!
                          </span>
                        ) : (
                          <span className="text-xs opacity-75">
                            {!rating ? "評価を選択" : "感想を入力"}
                          </span>
                        )}
                      </div>
                    </Button>
                  </div>

                  {/* 他のコメント */}
                  {comments.slice(1).map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.nickname}
                          </span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`w-3 h-3 ${
                                  index < item.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => onLikeClick(item.id, e)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              likeStorage.hasLiked(item.id)
                                ? "bg-blue-50 text-blue-500"
                                : "bg-gray-50 text-gray-500"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" /> {item.likes}
                          </button>
                          <button
                            onClick={(e) => onReportClick(item.id, e)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Flag className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.comment}
                        </p>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {getRelativeTime(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* 報告モーダルは変更なし */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-4 max-w-sm w-full mx-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              コメントを報告
            </h3>
            <div className="space-y-1">
              {["不適切なコンテンツ", "スパム", "ネタバレ", "その他"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => submitReport(reason)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
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
}
