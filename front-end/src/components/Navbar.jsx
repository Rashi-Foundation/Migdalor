import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import NavItems from "./NavItems";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { BookOpen, Code } from "lucide-react";

const Navbar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest("nav")) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Page background effect for mobile/tablet when menu is open */}
      {(isMobile || isTablet) && isOpen && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-20 z-20" />
      )}

      <nav className="theme-bg-secondary theme-shadow-md p-3 transition-colors duration-300 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/migdalorLogo.png"
              alt="logo"
              height={50}
              width={50}
              className="ml-2"
            />
          </div>

          {/* Desktop Navigation - Only main pages */}
          {!isMobile && !isTablet && (
            <ul className="flex justify-center space-x-2 lg:space-x-4 list-none">
              <NavItems
                isMobile={false}
                isTablet={false}
                showOnlyMainPages={true}
              />
            </ul>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Hamburger menu button - Always visible */}
            <button
              onClick={toggleMenu}
              className="text-2xl theme-text-primary hover:theme-text-secondary transition-colors duration-200 touch-target"
              aria-label="Toggle menu"
            >
              {isOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>

        {/* Expanded Menu - Different behavior for desktop vs mobile/tablet */}
        {isOpen && (
          <div
            className={`absolute top-full right-0 theme-bg-secondary theme-shadow-lg border-t theme-border-primary z-40 ${
              isMobile || isTablet ? "left-0" : "w-80"
            }`}
          >
            <div className="px-4 py-4">
              {/* Mobile/Tablet: Show all navigation items */}
              {(isMobile || isTablet) && (
                <ul className="space-y-2 list-none mb-4">
                  <NavItems
                    isMobile={isMobile}
                    isTablet={isTablet}
                    closeMenu={closeMenu}
                    showOnlyMainPages={false}
                  />
                </ul>
              )}

              {/* Desktop: Show only additional items (manuals and settings) */}
              {!isMobile && !isTablet && (
                <>
                  {/* Manuals Section */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold theme-text-tertiary mb-2 px-2">
                      Documentation
                    </h3>
                    <ul className="space-y-1 list-none">
                      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
                        <Link
                          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary w-full touch-target"
                          to="/manual"
                          onClick={closeMenu}
                        >
                          <BookOpen className="text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {t("navbar.userManual")}
                          </span>
                        </Link>
                      </li>
                      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
                        <Link
                          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary w-full touch-target"
                          to="/dev-manual"
                          onClick={closeMenu}
                        >
                          <Code className="text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {t("navbar.developerManual")}
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Settings and Controls */}
                  <div className="border-t theme-border-primary pt-4">
                    <h3 className="text-sm font-semibold theme-text-tertiary mb-2 px-2">
                      Settings
                    </h3>
                    <div className="flex items-center justify-between px-2">
                      <ThemeToggle />
                      <LanguageSwitcher />
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          closeMenu();
                          logout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 theme-accent theme-accent-hover rounded-[7px] text-white transition-all duration-200 touch-target"
                      >
                        <TbLogout2 />
                        <span>{t("navbar.logout")}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile/Tablet: Show manuals and settings sections */}
              {(isMobile || isTablet) && (
                <>
                  {/* Manuals Section */}
                  <div className="border-t theme-border-primary pt-4 mb-4">
                    <h3 className="text-sm font-semibold theme-text-tertiary mb-2 px-2">
                      Documentation
                    </h3>
                    <ul className="space-y-1 list-none">
                      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
                        <Link
                          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary w-full touch-target"
                          to="/manual"
                          onClick={closeMenu}
                        >
                          <BookOpen className="text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {t("navbar.userManual")}
                          </span>
                        </Link>
                      </li>
                      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
                        <Link
                          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary w-full touch-target"
                          to="/dev-manual"
                          onClick={closeMenu}
                        >
                          <Code className="text-sm flex-shrink-0" />
                          <span className="text-sm">
                            {t("navbar.developerManual")}
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Settings and Controls */}
                  <div className="border-t theme-border-primary pt-4">
                    <h3 className="text-sm font-semibold theme-text-tertiary mb-2 px-2">
                      Settings
                    </h3>
                    <div className="flex items-center justify-between px-2">
                      <ThemeToggle />
                      <LanguageSwitcher />
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          closeMenu();
                          logout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 theme-accent theme-accent-hover rounded-[7px] text-white transition-all duration-200 touch-target"
                      >
                        <TbLogout2 />
                        <span>{t("navbar.logout")}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Menu overlay - Only for mobile/tablet */}
      {isOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
