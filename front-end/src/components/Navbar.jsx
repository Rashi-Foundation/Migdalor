import React, { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import NavItems from "./NavItems";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

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
      <nav className="theme-bg-secondary theme-shadow-md p-2 sm:p-3 lg:p-4 transition-colors duration-300 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/migdalorLogo.png"
              alt="logo"
              height={isMobile ? 50 : isTablet ? 55 : 60}
              width={isMobile ? 50 : isTablet ? 55 : 60}
              className="ml-2 sm:ml-4"
            />
          </div>

          {/* Desktop Navigation */}
          {!isMobile && !isTablet && (
            <ul className="flex justify-center space-x-2 lg:space-x-4 list-none">
              <NavItems isMobile={false} isTablet={false} />
            </ul>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile/Tablet menu button */}
            {(isMobile || isTablet) && (
              <button
                onClick={toggleMenu}
                className="text-2xl theme-text-primary hover:theme-text-secondary transition-colors duration-200 touch-target"
                aria-label="Toggle menu"
              >
                {isOpen ? <IoMdClose /> : <IoMdMenu />}
              </button>
            )}

            {/* Desktop controls */}
            {!isMobile && !isTablet && (
              <>
                <ThemeToggle />
                <LanguageSwitcher />
                <button
                  onClick={logout}
                  className="responsive-button flex items-center space-x-1 sm:space-x-2 theme-accent theme-accent-hover rounded-[7px] text-white transition-all duration-200 hover:scale-105 touch-target"
                >
                  <TbLogout2 className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">{t("navbar.logout")}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {(isMobile || isTablet) && isOpen && (
          <div className="absolute top-full left-0 right-0 theme-bg-secondary theme-shadow-lg border-t theme-border-primary z-40">
            <div className="px-4 py-4">
              <ul className="space-y-2 list-none">
                <NavItems
                  isMobile={isMobile}
                  isTablet={isTablet}
                  closeMenu={closeMenu}
                />
              </ul>
              <div className="flex items-center justify-center mt-6 space-x-4">
                <ThemeToggle />
                <LanguageSwitcher />
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 theme-accent theme-accent-hover rounded-[7px] text-white transition-all duration-200 touch-target"
                >
                  <TbLogout2 />
                  <span>{t("navbar.logout")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile/Tablet menu overlay */}
      {(isMobile || isTablet) && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
