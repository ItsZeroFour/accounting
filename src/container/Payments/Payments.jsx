import React, { useEffect, useState } from "react";
import style from "./Payments.module.scss";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faCoins,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import Pagination from "../../components/Pagination/Pagination";

const Payments = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [accounting, setAccounting] = useState([]);
  const [openWindow, setOpenWindow] = useState(false);
  const [amount, setAmount] = useState("");
  const [commentary, setCommentary] = useState("");
  const [changeItemIndex, setChangeItemIndex] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [accountingsPerPage, setAccountingsPerPage] = useState(30);
  const usersCollectionRef = collection(db, "users");

  const lastCountryIndex = currentPage * accountingsPerPage;
  const firstCountryIndex = lastCountryIndex - accountingsPerPage;
  const currentAccountings = accounting.slice(
    firstCountryIndex,
    lastCountryIndex
  );
  const valute = localStorage.getItem("changeValute");
  const language = localStorage.getItem("language");

  const updateUserData = async (id, docData) => {
    const getDoc = doc(usersCollectionRef, id);
    await setDoc(getDoc, docData, { merge: true });
  };

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
          users.find((data) => data.email === localStorage.getItem("userEmail"))
        );
    }
  }, [users]);

  if (user === undefined) {
    window.location.href = "/accounting/accounting/registration";
  }

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
    Object.keys(users).length !== 0 &&
      setUser(
        users.find(
          (data) => data.doc.email === localStorage.getItem("userEmail")
        )
      );
  }, [users]);

  useEffect(() => {
    user &&
      user.doc &&
      user.doc.accounting !== undefined &&
      setAccounting(JSON.parse(user.doc.accounting));
  }, [user]);

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

  /*
    Open window with change form and set index element which need to change
    The check is amount or commentary not equal to empty string if his not empty -
    change accounting array and set new accounting array to firebase database
  */
  const changeParamsWindow = (index) => {
    setOpenWindow(true);
    setChangeItemIndex(index);
  };

  const changeParams = async (event) => {
    event.preventDefault();

    amount !== "" && (accounting[changeItemIndex].amount = +amount);
    commentary !== "" && (accounting[changeItemIndex].commentary = commentary);

    amount !== "" &&
      (await updateUserData(user.id, {
        accounting: JSON.stringify(accounting),
      }));

    commentary !== "" &&
      (await updateUserData(user.id, {
        accounting: JSON.stringify(accounting),
      }));

    setOpenWindow(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={style.payments}>
      {openWindow && (
        <div className={style.menu}>
          <div className={style.blur} />

          <form className={style.payments__changeform}>
            <FontAwesomeIcon
              icon={faClose}
              onClick={() => setOpenWindow(false)}
            />

            <div className={style.payments__inputs}>
              <input
                type="number"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Amount"
              />
              <input
                type="text"
                onChange={(event) => setCommentary(event.target.value)}
                placeholder="commentary"
              />
              <button type="submit" onClick={changeParams}>
                {language === "russian" ? "Сохранить" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <LeftMenu />

      <div className={style.payments__container}>
        <div className={style.payments__content}>
          <h1>{language === "russian" ? "Все платежи" : "All payments"}</h1>

          {Object.keys(user).length !== 0 && accounting.length !== 0 ? (
            <ul className={style.payments__list}>
              {currentAccountings.map(
                ({ amount, commentary, month, day, year }, index) => (
                  <li key={amount * Math.random()}>
                    <div className={style.payments__type}>
                      {amount > 0 ? "+" : "-"}{" "}
                      <FontAwesomeIcon icon={faCoins} />
                    </div>

                    <div className={style.payments__amount}>
                      <h2
                        style={
                          amount > 0
                            ? { color: "#38c1a7" }
                            : { color: "#f57676" }
                        }
                      >
                        {amount} {valute === "Rubles" ? "₽" : "$"}
                      </h2>

                      {commentary.length > 35 ? (
                        <p className={style.payments__commentary}>
                          {commentary.substring(0, 35)}...
                        </p>
                      ) : (
                        <p className={style.payments__commentary}>
                          {commentary}
                        </p>
                      )}
                    </div>

                    <div className={style.payments__date}>
                      <div>
                        <p>{day}</p>
                        <p>{month}</p>
                        <p>{year}</p>
                      </div>

                      <div>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => deleteItem(index)}
                        />
                      </div>
                    </div>

                    <FontAwesomeIcon
                      className={style.payments__change__parametrs}
                      onClick={() => changeParamsWindow(index)}
                      icon={faPen}
                    />
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className={style.payments__error}>
              {language === "russian"
                ? "Вы не имеете платежи :("
                : "You dont have payments :("}
            </p>
          )}
        </div>

        <Pagination
          accountingsPerPage={accountingsPerPage}
          totalAccountings={accounting.length}
          paginate={paginate}
        />
      </div>

      <BottomMenu />
    </div>
  );
};

export default Payments;
