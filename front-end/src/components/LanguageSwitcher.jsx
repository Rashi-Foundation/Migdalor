import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "he", name: t("common.hebrew"), flag: "🇮🇱" },
    { code: "en", name: t("common.english"), flag: "🇺🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);

    // Update document direction for RTL support
    document.documentElement.dir = languageCode === "he" ? "rtl" : "ltr";
    document.documentElement.lang = languageCode;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        aria-label={t("common.language")}
      >
        <FaGlobe className="text-lg" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                    i18n.language === language.code
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {i18n.language === language.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
