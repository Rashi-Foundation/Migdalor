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
import { BookOpen, Code } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const NavItems = ({
  isMobile,
  isTablet,
  closeMenu,
  showOnlyMainPages = false,
}) => {
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
      isMainPage: true,
    },
    {
      to: "/station",
      icon: PiClockClockwise,
      label: t("navbar.stationAssignment"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
      isMainPage: true,
    },
    {
      to: "/employees",
      icon: LuUsers,
      label: t("navbar.employees"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
      isMainPage: true,
    },
    {
      to: "/production",
      icon: AiOutlineProduct,
      label: t("navbar.production"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
      isMainPage: true,
    },
    {
      to: "/reports",
      icon: MdOutlineAssessment,
      label: t("navbar.reports"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
      isMainPage: true,
    },
    {
      to: "/settings",
      icon: LuSettings,
      label: t("navbar.settings"),
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true,
      isMainPage: true,
    },
  ];

  // Filter items based on screen size and main pages filter
  const visibleItems = navItems.filter((item) => {
    // First filter by screen size
    let showByScreen = false;
    if (isMobile) showByScreen = item.showOnMobile;
    else if (isTablet) showByScreen = item.showOnTablet;
    else showByScreen = item.showOnDesktop;

    // Then filter by main pages if needed
    if (showOnlyMainPages) {
      return showByScreen && item.isMainPage;
    }

    return showByScreen;
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
              className={`px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary touch-target ${
                isMobile || isTablet ? "w-full justify-start" : ""
              }`}
              to={item.to}
              onClick={handleClick}
            >
              <IconComponent className="text-sm flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default NavItems;
