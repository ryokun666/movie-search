// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Heart,
  History,
  Settings,
  Sun,
  Moon,
} from "lucide-react";

export default function Header({ isDarkMode, setIsDarkMode, clearSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "ホーム", onClick: clearSearch, icon: Home },
    {
      label: "お気に入り",
      onClick: () => console.log("お気に入り"),
      icon: Heart,
    },
    {
      label: "視聴履歴",
      onClick: () => console.log("視聴履歴"),
      icon: History,
    },
    {
      label: isDarkMode ? "ライトモード" : "ダークモード",
      onClick: () => setIsDarkMode(!isDarkMode),
      icon: isDarkMode ? Sun : Moon,
    },
    { label: "設定", onClick: () => console.log("設定"), icon: Settings },
  ];

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow relative z-50`}
    >
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              clearSearch();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${
              isDarkMode
                ? "text-white hover:text-gray-200"
                : "text-gray-900 hover:text-gray-700"
            } transition-colors`}
          >
            #誰かの映画メモ
          </button>
          <div className="flex items-center gap-4" ref={menuRef}>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <div
                  className={`transform transition-transform duration-200 ${
                    isMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                >
                  {isMenuOpen ? (
                    <X className={isDarkMode ? "text-white" : ""} size={20} />
                  ) : (
                    <Menu
                      className={isDarkMode ? "text-white" : ""}
                      size={20}
                    />
                  )}
                </div>
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden
                  transform transition-all duration-200 origin-top-right
                  ${
                    isMenuOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }
                  ${isDarkMode ? "bg-gray-700" : "bg-white"}
                  border ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm
                        flex items-center gap-3
                        ${isDarkMode ? "text-gray-200" : "text-gray-700"}
                        hover:${isDarkMode ? "bg-gray-600" : "bg-gray-50"}
                        transition-colors duration-150
                        ${
                          index !== menuItems.length - 1
                            ? `border-b ${
                                isDarkMode
                                  ? "border-gray-600"
                                  : "border-gray-100"
                              }`
                            : ""
                        }`}
                    >
                      <Icon
                        size={18}
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
