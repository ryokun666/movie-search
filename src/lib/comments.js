// src/lib/comments.js
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  increment,
  limit,
} from "firebase/firestore";
import _ from "lodash";
import { db } from "./firebase";
import axios from "axios";

const COMMENTS_COLLECTION = "comments";
const REPORTS_COLLECTION = "reports";

// コメントの取得
export async function getComments(movieId) {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where("movieId", "==", Number(movieId)), // 数値型に変換
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toLocaleString() || "不明",
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

// コメントの投稿
export async function addComment({
  movieId,
  nickname,
  rating,
  comment,
  movieData,
}) {
  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      movieId, // TMDb APIの映画ID
      tmdbMovieData: {
        title: movieData.title,
        posterPath: movieData.poster_path,
        releaseDate: movieData.release_date,
      },
      nickname,
      rating,
      comment,
      timestamp: new Date(),
      likes: 0,
      reportCount: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// いいねの更新
export async function updateLikes(commentId) {
  try {
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
    await updateDoc(commentRef, {
      likes: increment(1),
    });
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
}

// コメントの報告
export async function reportComment(commentId, reason) {
  try {
    // 報告を記録
    await addDoc(collection(db, REPORTS_COLLECTION), {
      commentId,
      reason,
      timestamp: new Date(),
    });

    // 報告回数を更新
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
    await updateDoc(commentRef, {
      reportCount: increment(1),
    });
  } catch (error) {
    console.error("Error reporting comment:", error);
    throw error;
  }
}

// ローカルストレージ用のヘルパー関数
export const likeStorage = {
  getLikedComments: () => {
    const likes = localStorage.getItem("likedComments");
    return likes ? JSON.parse(likes) : [];
  },

  addLikedComment: (commentId) => {
    const likes = likeStorage.getLikedComments();
    localStorage.setItem(
      "likedComments",
      JSON.stringify([...likes, commentId])
    );
  },

  hasLiked: (commentId) => {
    const likes = likeStorage.getLikedComments();
    return likes.includes(commentId);
  },
};

// 最近のコメントされた映画情報を取得する
export async function getRecentCommentedMovies() {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(30)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return []; // コメントがない場合は空配列を返す
    }

    const commentedMovies = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // 重複する映画IDを除去
    const uniqueMovies = _.uniqBy(commentedMovies, "movieId");

    try {
      // TMDBからの映画情報を取得
      const movieDetails = await Promise.all(
        uniqueMovies.slice(0, 10).map(async (comment) => {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${comment.movieId}`,
            {
              params: {
                api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
                language: "ja-JP",
              },
            }
          );

          return {
            ...response.data,
            poster_url: response.data.poster_path
              ? `https://image.tmdb.org/t/p/w500${response.data.poster_path}`
              : null,
            comment: comment, // コメント情報も保持
          };
        })
      );

      return movieDetails;
    } catch (error) {
      console.error("Error fetching movie details from TMDB:", error);
      return []; // TMDBからの取得に失敗した場合は空配列を返す
    }
  } catch (error) {
    console.error("Error fetching recent commented movies:", error);
    return []; // エラー時は空配列を返す
  }
}
