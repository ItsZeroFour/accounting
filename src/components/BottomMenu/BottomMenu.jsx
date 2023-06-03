import React, { useState } from "react";
import style from "./BottomMenu.module.scss";
import { BsGrid, BsPlusCircleFill } from "react-icons/bs";
import { BiMenu, BiBarChart } from "react-icons/bi";
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { FaRegCommentAlt } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

const BottomMenu = ({ accounting, user }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openLinkMenu, setOpenLinkMenu] = useState(false);
  const [amount, setAmount] = useState("");
  const [commentary, setCommentary] = useState("");

  const valute = localStorage.getItem("changeValute");
  const language = localStorage.getItem("language");

  const usersCollectionRef = collection(db, "users");

  const updateUserData = async (id, docData) => {
    const getDoc = doc(usersCollectionRef, id);
    await setDoc(getDoc, docData, { merge: true });
  };

  /*
    format time
  */
  const formatToLocalTimeMonth = (secs, format = "LLL") =>
    DateTime.fromSeconds(secs).toFormat(format);

  const formatToLocalTimeDay = (secs, format = "dd") =>
    DateTime.fromSeconds(secs).toFormat(format);

  const formatToLocalTimeYear = (secs, format = "yyyy") =>
    DateTime.fromSeconds(secs).toFormat(format);

  /*
    Get current user accounting then add new fields to start accounting array
    Then the new accounting array maked string and add to the user document
    and clean up input value
  */
  const addNewTransaction = async (event) => {
    event.preventDefault();

    await accounting.unshift({
      amount: +amount,
      commentary: commentary,
      month: formatToLocalTimeMonth(Timestamp.fromDate(new Date()).seconds),
      day: formatToLocalTimeDay(Timestamp.fromDate(new Date()).seconds),
      year: formatToLocalTimeYear(Timestamp.fromDate(new Date()).seconds),
    });

    await updateUserData(user.id, { accounting: JSON.stringify(accounting) });

    setAmount("");
    setCommentary("");
    setOpenMenu(false);
  };

  const logOut = () => {
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  return (
    <div className={style.bottomMenu}>
      {openMenu && (
        <div className={style.bottomMenu__addmenu}>
          <form>
            <input
              type="number"
              onChange={(event) => setAmount(event.target.value)}
              placeholder={`1000 ${valute === "Rubles" ? "₽" : "$"}`}
            />
            <input
              type="text"
              onChange={(event) => setCommentary(event.target.value)}
              placeholder={
                language === "russian" ? "Покупка ноутбука" : "Bought a laptop"
              }
            />
            {amount === "" ? (
              <button type="submit" style={{ opacity: 0.6 }}>
                {language === "russian" ? "Добавить" : "Add"}
              </button>
            ) : (
              <button type="submit" onClick={addNewTransaction}>
                {language === "russian" ? "Добавить" : "Add"}
              </button>
            )}
          </form>
        </div>
      )}

      {openLinkMenu && (
        <div className={style.bottomMenu__link}>
          <ul className={style.bottomMenu__link__list}>
            {[
              {
                icon: <BsGrid />,
                title: language === "russian" ? "Обзор" : "Overview",
                href: "/accounting/",
              },
              {
                icon: <BiBarChart />,
                title:
                  language === "russian"
                    ? "Все транзакции"
                    : "All transactions",
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

          <ul className={style.bottomMenu__list__bottom}>
            <li onClick={logOut}>
              <MdOutlineLogout />{" "}
              <h3>{language === "russian" ? "Выйти" : "Log out"}</h3>
            </li>

            <li>
              <FaRegCommentAlt />{" "}
              <a
                href="https://vk.com/nullbebra"
                target="_blank"
                rel="noreferrer"
              >
                <h3>{language === "russian" ? "Нужна помощь" : "Need help"}</h3>
              </a>
            </li>
          </ul>
        </div>
      )}

      <ul className={style.bottomMenu__list}>
        <li className={style.bottomMenu__item}>
          <Link to="/accounting/">
            <BsGrid />
            <h6>{language === "russian" ? "Главная" : "Dashboard"}</h6>
          </Link>
        </li>
        <li
          className={style.bottomMenu__item__add}
          onClick={() => setOpenMenu(!openMenu)}
        >
          {!openMenu ? <BsPlusCircleFill /> : <IoMdCloseCircle />}
        </li>
        <li
          className={style.bottomMenu__item}
          onClick={() => setOpenLinkMenu(!openLinkMenu)}
        >
          {!openLinkMenu ? <BiMenu /> : <IoMdClose />}

          <h6>{language === "russian" ? "Меню" : "Menu"}</h6>
        </li>
      </ul>
    </div>
  );
};

export default BottomMenu;
