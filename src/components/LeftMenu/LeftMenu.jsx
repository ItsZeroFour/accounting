import React from "react";
import style from "./LeftMenu.module.scss";
import logo from "../../images/logo.png";
import { BsGrid } from "react-icons/bs";
import { BiBarChart } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";

const LeftMenu = () => {
  const language = localStorage.getItem("language");

  const logOut = () => {
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  return (
    <div className={style.leftmenu}>
      <a href="https://t.me/ItsZeroFour" target="_blank" rel="noreferrer">
        <img src={logo} alt="logo" />
      </a>

      <ul className={style.leftmenu__list}>
        {[
          {
            icon: <BsGrid />,
            title: language === "russian" ? "Обзор" : "Overview",
            href: "/accounting/",
          },
          {
            icon: <BiBarChart />,
            title:
              language === "russian" ? "Все транзакции" : "All transactions",
            href: "/accounting/payments",
          },
          {
            icon: <FiUser />,
            title: language === "russian" ? "Аккаунт" : "Account",
            href: "/accounting/account",
          },
          {
            icon: <CiSettings />,
            title: language === "russian" ? "Настройки" : "Settings",
            href: "/accounting/settings",
          },
        ].map(({ icon, title, href }) => (
          <li className={style.leftmeni__item} key={title}>
            <Link to={href}>
              {icon} <h3>{title}</h3>
            </Link>
          </li>
        ))}
      </ul>

      <ul className={style.leftmenu__list__bottom}>
        <li onClick={logOut}>
          <MdOutlineLogout />{" "}
          <h3>{language === "russian" ? "Выйти" : "Log out"}</h3>
        </li>

        <li>
          <FaRegCommentAlt />{" "}
          <a href="https://vk.com/nullbebra" target="_blank" rel="noreferrer">
            <h3>{language === "russian" ? "Нужна помощь" : "Need help"}</h3>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LeftMenu;
