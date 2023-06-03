import React, { useEffect, useState } from "react";
import style from "./Home.module.scss";
import { db } from "../../firebase/firebase-config";
import { collection, onSnapshot } from "@firebase/firestore";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import Loader from "../../components/Loader/Loader";
import BarChart from "./BarChart/BarChart";
import RightMenu from "./RightMenu/RightMenu";
import RadialChart from "./RadialChart/RadialChart";
import { months } from "../../data/Date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarChart, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import { Link } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [accounting, setAccounting] = useState("[]");
  const [amount, setAmount] = useState(0);
  const [profitAmounts, setProfitAmounts] = useState(0);
  const [subsidedAmounts, setSubsidedAmounts] = useState(0);

  const usersCollectionRef = collection(db, "users");

  const valute = localStorage.getItem("changeValute");
  const displayName = JSON.parse(localStorage.getItem("switchDisplayName"));
  const language = localStorage.getItem("language");

  /*
    Get real time data and found current user with his email
  */
  useEffect(() => {
    onSnapshot(usersCollectionRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setUsers((prev) => [...prev, { doc: doc.data(), id: doc.id }]);
      });
    });
  }, []);

  useEffect(() => {
    user &&
      user.doc &&
      user.doc.accounting !== undefined &&
      setAccounting(JSON.parse(user.doc.accounting));
  }, [user]);

  /*
    Check if user is not registered - navigate to registration page
    Else we have userEmail - check if user is already registered
    If he registered, don't do enything else navigate to registration page again
  */
  useEffect(() => {
    if (!localStorage.getItem("userEmail")) {
      window.location.href = "/accounting/accounting/registration";
    } else {
      Object.keys(users).length !== 0 &&
        setUser(
          users.find(
            (data) => data.doc.email === localStorage.getItem("userEmail")
          )
        );
    }
  }, [users]);

  if (user === undefined) {
    window.location.href = "/accounting/accounting/registration";
  }

  useEffect(() => {
    typeof accounting !== "string" &&
      setAmount(
        accounting
          .map((item) => item.amount)
          .reduce((prev, curr) => prev + curr, 0)
      );
  }, [accounting]);

  /*
    Get current month then find all values on this period
  */
  const currentMonth = new Date().getMonth();
  const year = new Date().getFullYear();

  const getMonthlyProfitValues =
    user !== undefined &&
    user !== null &&
    Object.keys(user).length !== 0 &&
    user.doc.accounting !== undefined
      ? JSON.parse(user.doc.accounting).filter(function (val) {
          return (
            val.month === months[currentMonth] &&
            val.year === String(year) &&
            val.amount > 0
          );
        })
      : 0;

  const getMonthlySubsidedValues =
    user !== undefined &&
    user !== null &&
    Object.keys(user).length !== 0 &&
    user.doc.accounting !== undefined
      ? JSON.parse(user.doc.accounting).filter(function (val) {
          return (
            val.month === months[currentMonth] &&
            val.year === String(year) &&
            val.amount < 0
          );
        })
      : 0;

  useEffect(() => {
    user !== undefined &&
      user !== null &&
      Object.keys(user).length !== 0 &&
      setProfitAmounts(
        getMonthlyProfitValues
          .map((item) => item.amount)
          .reduce((prev, curr) => prev + curr, 0)
      );
  }, [user]);

  useEffect(() => {
    user !== undefined &&
      user !== null &&
      Object.keys(user).length !== 0 &&
      setSubsidedAmounts(
        getMonthlySubsidedValues
          .map((item) => item.amount)
          .reduce((prev, curr) => prev + curr, 0)
      );
  }, [user]);

  const numberFormatter = (number) => {
    return Intl.NumberFormat("ru-RU").format(number);
  };

  return (
    <div className={style.home}>
      {user !== undefined &&
      user !== null &&
      Object.keys(user).length !== 0 &&
      typeof accounting !== "string" ? (
        <div className={style.home__content}>
          <LeftMenu />

          <div className={style.main__container}>
            <main className={style.home__main}>
              <div className={style.home__top}>
                <Link to="/accounting/settings">
                  <FontAwesomeIcon icon={faGear} />
                </Link>

                <h1 className={style.home__title}>
                  {language === "russian"
                    ? `Привет, ${
                        displayName ? user.doc.name : user.doc.userName
                      }!`
                    : `What's up, ${
                        displayName ? user.doc.name : user.doc.userName
                      }!`}
                </h1>

                <Link to="/accounting/account">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </div>

              <div className={style.home__total__value}>
                <h2>
                  {language === "russian" ? "Общая сумма" : "Total sum"}:{" "}
                </h2>
                <h2
                  className={style.home__total__amount}
                  style={
                    amount > 0 ? { color: "#38c1a7" } : { color: "#f57676" }
                  }
                >
                  {numberFormatter(amount)} {valute === "Rubles" ? "₽" : "$"}
                </h2>
              </div>

              <div className={style.home__mobile__total__value}>
                <h1>
                  <FontAwesomeIcon icon={faBarChart} />{" "}
                  {language === "russian"
                    ? "Доходы и потери"
                    : "Profit and Loss"}
                </h1>

                <h2
                  style={
                    amount > 0 ? { color: "#38c1a7" } : { color: "#f57676" }
                  }
                >
                  {numberFormatter(amount)} {valute === "Rubles" ? "₽" : "$"}
                </h2>
              </div>

              <BarChart />

              <div className={style.home__main__bottom}>
                <div className={style.home__monthly__values}>
                  <div className={style.home__monthly__values__block}>
                    <h2>
                      {language === "russian"
                        ? "Месячный доход"
                        : "Monthly profit"}
                    </h2>
                    <h2 style={{ color: "#38c1a7" }}>
                      {numberFormatter(profitAmounts)}{" "}
                      {valute === "Rubles" ? "₽" : "$"}
                    </h2>
                  </div>

                  <div className={style.home__monthly__values__block}>
                    <h2>
                      {language === "russian"
                        ? "Месячные потери"
                        : "Monthly subsided"}
                    </h2>
                    <h2 style={{ color: "#f57676" }}>
                      {numberFormatter(subsidedAmounts * -1)}{" "}
                      {valute === "Rubles" ? "₽" : "$"}
                    </h2>
                  </div>
                </div>

                <RadialChart
                  profitAmounts={profitAmounts}
                  subsidedAmounts={subsidedAmounts}
                />
              </div>

              <h4 className={style.rightmenu__modile__monthly__value__title}>
                {language === "russian"
                  ? "Месячные доходы и потери"
                  : "Monthly income and subsided"}
              </h4>

              <div className={style.rightmenu__modile__monthly__value}>
                <div className={style.rightmenu__modile__monthly__content}>
                  <div
                    className={style.rightmenu__modile__monthly__value__left}
                  >
                    <h3>{language === "russian" ? "Доход💰" : "Income💰"}</h3>
                    <h2 style={{ color: "#38c1a7" }}>
                      {numberFormatter(profitAmounts)}
                      {valute === "Rubles" ? "₽" : "$"}
                    </h2>
                  </div>

                  <div
                    className={style.rightmenu__modile__monthly__value__right}
                  >
                    <h3>
                      {language === "russian" ? "💸Расход" : "💸Subsided"}
                    </h3>
                    <h2 style={{ color: "#f57676" }}>
                      {numberFormatter(subsidedAmounts * -1)}
                      {valute === "Rubles" ? "₽" : "$"}
                    </h2>
                  </div>
                </div>

                <RadialChart
                  profitAmounts={profitAmounts}
                  subsidedAmounts={subsidedAmounts}
                />
              </div>
            </main>

            <RightMenu user={user} accounting={accounting} />

            <BottomMenu user={user} accounting={accounting} />
          </div>
        </div>
      ) : (
        <div className="box">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Home;
