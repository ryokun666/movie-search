"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Search,
  Calendar,
  Star,
  Info,
  Grid,
  List,
  Sun,
  Moon,
} from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { getRecentCommentedMovies } from "@/lib/comments";
import Header from "@/components/Header";

export default function Home() {
  // 検索フォームの参照を作成
  const searchInputRef = useRef(null);

  // 基本的な状態
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 新しい機能のための状態
  const [viewMode, setViewMode] = useState("grid");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // サジェスト関連の状態
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // 最近コメントされた映画情報
  const [recentMovies, setRecentMovies] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  // 最近コメントがついた映画を取得
  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        setIsLoadingRecent(true);
        const movies = await getRecentCommentedMovies();
        if (movies && movies.length > 0) {
          setRecentMovies(movies);
        }
      } catch (error) {
        console.error("Error fetching recent movies:", error);
        // エラー時の状態更新（必要に応じて）
        setRecentMovies([]);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentMovies();
  }, []);

  // クリック以外の場所をクリックしたときにサジェストを非表示にする
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // サジェストアイテムをクリックしたときのハンドラー
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    searchMovies(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // サジェスト検索のための遅延実行
  useEffect(() => {
    // 初期レンダリング時はサジェストを表示しない
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    // 入力が2文字未満の場合やクエリが空の場合は早期リターン
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
              query: query,
              language: "ja-JP",
              page: 1,
            },
          }
        );

        // 最大5件までのサジェストを表示
        const suggestedMovies = response.data.results
          .slice(0, 5)
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            releaseDate: movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : null,
            posterPath: movie.poster_path
              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
              : null,
          }));

        setSuggestions(suggestedMovies);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isInitialRender]); // isInitialRenderを依存配列に追加

  // キーボードナビゲーション用のハンドラー
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1) {
          const selected = suggestions[selectedIndex];
          setQuery(selected.title);
          searchMovies(selected.title);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        } else {
          searchMovies();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // フィルターオプション
  const genreOptions = [
    { id: "28", name: "アクション" },
    { id: "12", name: "アドベンチャー" },
    { id: "16", name: "アニメーション" },
    { id: "35", name: "コメディ" },
    { id: "80", name: "クライム" },
    { id: "99", name: "ドキュメンタリー" },
    { id: "18", name: "ドラマ" },
    { id: "10751", name: "ファミリー" },
    { id: "14", name: "ファンタジー" },
    { id: "36", name: "歴史" },
    { id: "27", name: "ホラー" },
    { id: "10402", name: "音楽" },
    { id: "9648", name: "ミステリー" },
    { id: "10749", name: "ロマンス" },
    { id: "878", name: "SF" },
    { id: "10770", name: "TV映画" },
    { id: "53", name: "スリラー" },
    { id: "10752", name: "戦争" },
    { id: "37", name: "西部劇" },
  ];

  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `${new Date().getFullYear() - i}`,
    label: `${new Date().getFullYear() - i}年`,
  }));

  const ratingOptions = [
    { value: "8", label: "8点以上" },
    { value: "7", label: "7点以上" },
    { value: "6", label: "6点以上" },
    { value: "5", label: "5点以上" },
  ];

  // 初期状態の復元
  useEffect(() => {
    const savedState = localStorage.getItem("movieSearchState");
    const savedHistory = localStorage.getItem("searchHistory");
    const savedViewMode = localStorage.getItem("viewMode");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedState) {
      const { savedQuery, savedMovies, savedFilters, savedSort, savedPage } =
        JSON.parse(savedState);
      setQuery(savedQuery || "");
      setMovies(savedMovies || []);
      setFilters(savedFilters || { genre: "", year: "", rating: "" });
      setSortBy(savedSort || "relevance");
      setPage(savedPage || 1);
    }

    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // 状態の保存
  useEffect(() => {
    if (query || movies.length > 0) {
      localStorage.setItem(
        "movieSearchState",
        JSON.stringify({
          savedQuery: query,
          savedMovies: movies,
          savedFilters: filters,
          savedSort: sortBy,
          savedPage: page,
        })
      );
    }
  }, [query, movies, filters, sortBy, page]);

  // 表示モードの保存
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // ダークモードの保存
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ソート機能
  const sortMovies = (movies) => {
    switch (sortBy) {
      case "date":
        return [...movies].sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      case "rating":
        return [...movies].sort((a, b) => b.vote_average - a.vote_average);
      case "title":
        return [...movies].sort((a, b) => a.title.localeCompare(b.title, "ja"));
      default:
        return movies;
    }
  };

  // フィルター機能
  const filterMovies = (movies) => {
    return movies.filter((movie) => {
      const genreMatch =
        !filters.genre || movie.genre_ids.includes(parseInt(filters.genre));
      const yearMatch =
        !filters.year || movie.release_date.startsWith(filters.year);
      const ratingMatch =
        !filters.rating || movie.vote_average >= parseFloat(filters.rating);
      return genreMatch && yearMatch && ratingMatch;
    });
  };

  // 検索機能
  const searchMovies = async (searchQuery = query, newPage = 1) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_MOVIE_API_KEY,
            query: searchQuery,
            language: "ja-JP",
            page: newPage,
          },
        }
      );

      const moviesWithFullPosterUrl = response.data.results.map((movie) => ({
        ...movie,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      if (newPage === 1) {
        setMovies(moviesWithFullPosterUrl);
      } else {
        setMovies((prev) => [...prev, ...moviesWithFullPosterUrl]);
      }

      setTotalPages(response.data.total_pages);
      setPage(newPage);
    } catch (error) {
      setError("映画の検索中にエラーが発生しました。もう一度お試しください。");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索のクリア
  const clearSearch = () => {
    setQuery("");
    setMovies([]);
    setPage(1);
    setFilters({ genre: "", year: "", rating: "" });
    setSortBy("relevance");
    setSuggestions([]);
    setShowSuggestions(false);
    localStorage.removeItem("movieSearchState");
  };

  // JSXの戻り値
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-slate-100"
      }`}
    >
      {/* ヘッダー */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        clearSearch={clearSearch}
      />

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="pt-[88px] sm:pt-[104px]">
          {/* 検索フォーム */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1" ref={searchInputRef}>
                <input
                  type="text"
                  placeholder="映画のタイトルを入力..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none transition duration-200
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <Search
                  className={`absolute left-3 top-2.5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  size={20}
                />

                {/* サジェストリスト */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`flex items-center p-3 cursor-pointer transition-colors
                          ${
                            index === selectedIndex
                              ? isDarkMode
                                ? "bg-gray-700"
                                : "bg-blue-50"
                              : isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          }
                          ${isDarkMode ? "border-gray-700" : "border-gray-100"}
                          ${
                            index !== suggestions.length - 1 ? "border-b" : ""
                          }`}
                      >
                        {suggestion.posterPath ? (
                          <img
                            src={suggestion.posterPath}
                            alt={suggestion.title}
                            className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-200 rounded mr-3 flex items-center justify-center flex-shrink-0">
                            <Info size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div
                            className={`font-medium ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {suggestion.title}
                          </div>
                          {suggestion.releaseDate && (
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {suggestion.releaseDate}年
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => searchMovies()}
                disabled={isLoading || !query.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 font-medium min-w-[100px]"
              >
                {isLoading ? "検索中..." : "検索"}
              </button>
            </div>
          </div>
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200">
              {error}
            </div>
          )}
          {/* 検索結果 */}
          {movies.length > 0 ? (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-4"
              }`}
            >
              {sortMovies(filterMovies(movies)).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  viewMode={viewMode}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            <>
              {!query && (
                <>
                  <h2
                    className={`text-xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    最近コメントがついた映画
                  </h2>
                  {isLoadingRecent ? (
                    <div className="flex justify-center mt-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div
                      className={`${
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                          : "space-y-4"
                      }`}
                    >
                      {recentMovies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          viewMode={viewMode}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
              {query && !isLoading && movies.length === 0 && (
                <div
                  className={`text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mt-8`}
                >
                  検索結果が見つかりませんでした。
                </div>
              )}
            </>
          )}
          {/* ローディング表示 */}
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* もっと読み込むボタン */}
          {movies.length > 0 && page < totalPages && !isLoading && (
            <div className="mt-8 text-center">
              <button
                onClick={() => searchMovies(query, page + 1)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                もっと見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
