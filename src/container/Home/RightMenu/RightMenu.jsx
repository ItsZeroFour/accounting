import React, { useState } from "react";
import style from "./RightMenu.module.scss";
import {
  Timestamp,
  setDoc,
  doc,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const RightMenu = ({ user, accounting }) => {
  const [amount, setAmount] = useState("");
  const [commentary, setCommentary] = useState("");
  const usersCollectionRef = collection(db, "users");

  const valute = localStorage.getItem("changeValute");
  const language = localStorage.getItem("language");

  const updateUserData = async (id, docData) => {
    const getDoc = doc(usersCollectionRef, id);
    await setDoc(getDoc, docData, { merge: true });
  };

  /*
    Get index element which need to delete, the delete it with
    splice method. Then convert our accounting to string and
    update users collection
  */
  const deleteItem = async (index) => {
    accounting.splice(index, 1);

    await updateUserData(user.id, {
      accounting: JSON.stringify(accounting),
    });
  };

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
  };

  const numberFormatter = (number) => {
    return Intl.NumberFormat("ru-RU").format(number);
  };

  return (
    <section className={style.rightmenu}>
      {Object.keys(user).length !== 0 && (
        <div className={style.rightmenu__content}>
          <h3>
            {language === "russian"
              ? "Последнии транзакции💳"
              : "Recent Transaction 💳"}
          </h3>

          <form className={style.rightmenu__form}>
            <div className={style.form__block}>
              <label htmlFor="home-amount">
                <FontAwesomeIcon icon={faCoins} />{" "}
                {language === "russian" ? "Колличество" : "Amount"}
              </label>
              <input
                id="home-amount"
                type="number"
                onChange={(event) => setAmount(event.target.value)}
                value={amount}
                placeholder={`1000 ${valute === "Rubles" ? "₽" : "$"}`}
              />
            </div>

            <div className={style.form__block}>
              <label htmlFor="home-comment">
                <FontAwesomeIcon icon={faMessage} />{" "}
                {language === "russian" ? "Комментарий" : "Commentary"}
              </label>
              <input
                id="home-comment"
                type="text"
                onChange={(event) => setCommentary(event.target.value)}
                value={commentary}
                placeholder={
                  language === "russian"
                    ? "Покупка ноутбука"
                    : "Bought a laptop"
                }
              />
            </div>
            {amount !== null && amount !== "" ? (
              <button type="submit" onClick={addNewTransaction}>
                {language === "russian" ? "Добавить" : "Add"}
              </button>
            ) : (
              <button style={{ opacity: 0.6, cursor: "auto" }}>
                {language === "russian" ? "Добавить" : "Add"}
              </button>
            )}
          </form>

          {typeof accounting !== "string" && accounting.length !== 0 && (
            <section className={style.rightmenu__recent_amounts}>
              <ul className={style.rightmenu__list}>
                {accounting
                  .slice(0, 7)
                  .map(({ amount, commentary, month, day }, index) => (
                    <li
                      className={style.rightmenu__item}
                      key={amount + Math.random()}
                    >
                      <div className={style.rightmenu__item__block}>
                        {amount > 0 ? "💰" : "💸"}
                        <div className={style.rightmenu__info}>
                          <p>
                            {day} {month}
                          </p>
                          {commentary.length > 10 ? (
                            <p className={style.rightmenu__commentary}>
                              {commentary.substring(0, 10)}...
                            </p>
                          ) : (
                            <p className={style.rightmenu__commentary}>
                              {commentary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={style.rightmenu__amount__block}>
                        <span
                          style={
                            amount > 0
                              ? { color: "#38c1a7" }
                              : { color: "#f57676" }
                          }
                        >
                          {valute === "Rubles" ? "₽" : "$"}
                        </span>

                        <h3
                          style={
                            amount > 0
                              ? { color: "#38c1a7" }
                              : { color: "#f57676" }
                          }
                        >
                          {numberFormatter(amount)}
                        </h3>

                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => deleteItem(index)}
                        />
                      </div>
                    </li>
                  ))}
              </ul>

              <div className={style.rightmenu__link}>
                <Link to="/accounting/payments">
                  {language === "russian" ? "Смотреть все" : "See all"}
                </Link>
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};

export default RightMenu;
