import React, { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavItems from "./NavItems";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
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

  return (
    <nav className="bg-gray-100 p-2">
      <div className="flex items-center justify-between">
        <img
          src="/migdalorLogo.png"
          alt="logo"
          height={60}
          width={60}
          className="ml-4"
        />
        {isMobile ? (
          <button onClick={toggleMenu} className="text-2xl">
            <IoMdMenu />
          </button>
        ) : (
          <ul className="flex justify-center space-x-4 list-none">
            <NavItems isMobile={isMobile} />
          </ul>
        )}
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link
              className="px-3 py-2 flex items-center space-x-2 hover:bg-[#246B35] rounded-[7px] hover:text-white"
              to="/"
            >
              <TbLogout2 />
              <span>{t("navbar.logout")}</span>
            </Link>
          </div>
        )}
      </div>
      {isMobile && isOpen && (
        <div className="mt-4">
          <ul className="space-y-2 list-none">
            <NavItems isMobile={isMobile} closeMenu={closeMenu} />
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
