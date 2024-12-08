// src/components/MovieCard.jsx
import React, { useState } from "react";
import {
  Star,
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

export default function MovieCard({ movie, viewMode, isDarkMode }) {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  // カスタムフックを使用してコメント機能を実装
  const { comments, isLoading, error, postComment, handleLike, handleReport } =
    useComments(movie.id);

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    try {
      await postComment({
        movieId: movie.id, // TMDb APIの映画ID
        nickname: nickname.trim() || `匿名${Math.floor(Math.random() * 1000)}`,
        rating,
        comment: comment.trim(),
        movieData: movie, // 映画情報も一緒に保存
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
      className={`
        ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:shadow-lg"
        }
        rounded-xl shadow transition-all duration-200 overflow-hidden cursor-pointer
      `}
    >
      <div className={`${viewMode === "grid" ? "flex-col" : "flex"}`}>
        {/* ポスター画像部分は変更なし */}
        <div className={viewMode === "grid" ? "w-full" : "w-48 flex-shrink-0"}>
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Info className="text-gray-400" size={48} />
            </div>
          )}
        </div>

        {/* 映画情報と感想 */}
        <div className="p-6 flex-1">
          <h2
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {movie.title}
          </h2>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {movie.release_date}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {movie.vote_average?.toFixed(1) || "N/A"}
            </div>
          </div>

          {/* コメントセクション */}
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredComment ? (
            <div
              className={`p-4 rounded-lg mb-4 comment-section ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {featuredComment.nickname}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < featuredComment.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button
                    onClick={(e) => onLikeClick(featuredComment.id, e)}
                    className={`flex items-center gap-1 ${
                      likeStorage.hasLiked(featuredComment.id)
                        ? "text-blue-500"
                        : ""
                    }`}
                  >
                    👍 {featuredComment.likes}
                  </button>
                  <button
                    onClick={(e) => onReportClick(featuredComment.id, e)}
                    className="hover:text-red-500"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  <span>{featuredComment.timestamp}</span>
                </div>
              </div>
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {featuredComment.comment}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 p-4">
              まだコメントはありません
            </p>
          )}

          <Collapsible className="comment-section">
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className={`w-full ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                すべての感想を見る・書く
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="space-y-4 mt-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
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
                    className={`w-full rounded-md border px-3 py-2 text-sm mb-2 ${
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
                    className={`min-h-[100px] mb-2 ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-600"
                        : "bg-white text-gray-900"
                    }`}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!comment.trim() || rating === 0}
                    className="w-full"
                  >
                    投稿する
                  </Button>
                </div>

                {/* 他のコメントを表示 */}
                {comments.slice(1).map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.nickname}
                        </p>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < item.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button
                          onClick={(e) => onLikeClick(item.id, e)}
                          className={`flex items-center gap-1 ${
                            likeStorage.hasLiked(item.id) ? "text-blue-500" : ""
                          }`}
                        >
                          👍 {item.likes}
                        </button>
                        <button
                          onClick={(e) => onReportClick(item.id, e)}
                          className="hover:text-red-500"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.comment}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* 報告モーダル */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 max-w-md w-full`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              コメントを報告
            </h3>
            <div className="space-y-2">
              {["不適切なコンテンツ", "スパム", "ネタバレ", "その他"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => submitReport(reason)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
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
              className="w-full mt-4"
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
