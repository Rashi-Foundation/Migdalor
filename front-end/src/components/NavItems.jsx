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
import LanguageSwitcher from "./LanguageSwitcher";

const NavItems = ({ isMobile, closeMenu }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  return (
    <>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/home"
          onClick={handleClick}
        >
          <RiHome4Line />
          <span>{t("navbar.home")}</span>
        </Link>
      </li>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/station"
          onClick={handleClick}
        >
          <PiClockClockwise />
          <span>{t("navbar.stationAssignment")}</span>
        </Link>
      </li>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/employees"
          onClick={handleClick}
        >
          <LuUsers />
          <span>{t("navbar.employees")}</span>
        </Link>
      </li>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/production"
          onClick={handleClick}
        >
          <AiOutlineProduct />
          <span>{t("navbar.production")}</span>
        </Link>
      </li>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/reports"
          onClick={handleClick}
        >
          <MdOutlineAssessment />
          <span>{t("navbar.reports")}</span>
        </Link>
      </li>
      <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
          to="/settings"
          onClick={handleClick}
        >
          <LuSettings />
          <span>{t("navbar.settings")}</span>
        </Link>
      </li>
      {isMobile && (
        <>
          <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
            <div className="px-3 py-2 flex items-center space-x-2">
              <LanguageSwitcher />
            </div>
          </li>
          <li className="theme-accent-hover rounded-[7px] hover:text-white transition-all duration-200">
            <Link
              className="px-3 py-2 rounded flex items-center space-x-2 theme-text-primary hover:theme-text-primary"
              to="/"
              onClick={handleClick}
            >
              <TbLogout2 />
              <span>{t("navbar.logout")}</span>
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default NavItems;
