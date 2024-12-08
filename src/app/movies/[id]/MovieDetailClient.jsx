"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, Star, Clock, Globe } from "lucide-react";

const MovieDetailClient = ({ movieId }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: "c3dda0e266ce91617479e207694a7bad",
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* バックドロップ画像 */}
      {movie.backdrop_url && (
        <div className="relative h-96 w-full">
          <div className="absolute inset-0 bg-black/50"></div>
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* 戻るボタン */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 inline-flex items-center text-white hover:text-blue-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          戻る
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="sm:flex">
            {/* ポスター画像 */}
            <div className="sm:w-1/3 flex-shrink-0">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-auto"
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
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{movie.runtime}分</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{movie.original_language.toUpperCase()}</span>
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

              {/* キャスト */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">キャスト</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.credits.cast.slice(0, 5).map((person) => (
                      <span
                        key={person.id}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {person.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailClient;
