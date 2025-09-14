import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RiHome4Line } from "react-icons/ri";
import { PiClockClockwise } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { MdOutlineAssessment } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const NavItems = ({ isMobile, isTablet, closeMenu }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleClick = () => {
    if ((isMobile || isTablet) && closeMenu) {
      closeMenu();
    }
  };

  const handleLogout = () => {
    if ((isMobile || isTablet) && closeMenu) {
      closeMenu();
    }
    logout();
  };

  // Navigation items configuration
  const navItems = [
    {
      to: "/home",
      icon: RiHome4Line,
      label: t("navbar.home"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
    {
      to: "/station",
      icon: PiClockClockwise,
      label: t("navbar.stationAssignment"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
    {
      to: "/employees",
      icon: LuUsers,
      label: t("navbar.employees"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
    {
      to: "/production",
      icon: AiOutlineProduct,
      label: t("navbar.production"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
    {
      to: "/reports",
      icon: MdOutlineAssessment,
      label: t("navbar.reports"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
    {
      to: "/settings",
      icon: LuSettings,
      label: t("navbar.settings"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
    },
  ];

  // Filter items based on screen size
  const visibleItems = navItems.filter((item) => {
    if (isMobile) return item.showOnMobile;
    if (isTablet) return item.showOnTablet;
    return item.showOnDesktop;
  });

  return (
    <>
      {visibleItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <li
            key={index}
            className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200"
          >
            <Link
              className={`px-2 sm:px-3 py-2 rounded flex items-center space-x-1 sm:space-x-2 theme-text-primary hover:theme-text-primary touch-target ${
                isMobile || isTablet ? "w-full justify-start" : ""
              }`}
              to={item.to}
              onClick={handleClick}
            >
              <IconComponent className="text-sm sm:text-base flex-shrink-0" />
              <span
                className={`${
                  isTablet ? "text-base" : isMobile ? "text-base" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}

      {/* Mobile/Tablet-only items (moved to navbar) */}
      {(isMobile || isTablet) && (
        <>
          <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
            <div className="px-3 py-2 flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
          </li>
          <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
            <button
              className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary w-full text-left touch-target"
              onClick={handleLogout}
            >
              <TbLogout2 />
              <span>{t("navbar.logout")}</span>
            </button>
          </li>
        </>
      )}
    </>
  );
};

export default NavItems;
