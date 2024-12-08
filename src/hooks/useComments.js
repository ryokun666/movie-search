// src/hooks/useComments.js
import { useState, useEffect } from "react";
import {
  getComments,
  addComment,
  updateLikes,
  reportComment,
  likeStorage,
} from "@/lib/comments";

export function useComments(movieId) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // コメントを取得
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await getComments(movieId);
      setComments(fetchedComments);
    } catch (err) {
      setError("コメントの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // コメントを投稿
  const postComment = async (commentData) => {
    try {
      await addComment({ movieId, ...commentData });
      await fetchComments(); // コメントを再取得
    } catch (err) {
      setError("コメントの投稿に失敗しました");
      throw err;
    }
  };

  // いいねを更新
  const handleLike = async (commentId) => {
    if (likeStorage.hasLiked(commentId)) {
      return false; // 既にいいね済み
    }

    try {
      await updateLikes(commentId);
      likeStorage.addLikedComment(commentId);
      await fetchComments(); // コメントを再取得
      return true;
    } catch (err) {
      setError("いいねの更新に失敗しました");
      throw err;
    }
  };

  // コメントを報告
  const handleReport = async (commentId, reason) => {
    try {
      await reportComment(commentId, reason);
      return true;
    } catch (err) {
      setError("報告の送信に失敗しました");
      throw err;
    }
  };

  // 初回マウント時にコメントを取得
  useEffect(() => {
    fetchComments();
  }, [movieId]);

  return {
    comments,
    isLoading,
    error,
    postComment,
    handleLike,
    handleReport,
  };
}
