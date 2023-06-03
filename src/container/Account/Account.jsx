import React, { useEffect, useState } from "react";
import style from "./Account.module.scss";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Loader from "../../components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  const usersCollectionRef = collection(db, "users");
  const language = localStorage.getItem("language");

  useEffect(() => {
    onSnapshot(usersCollectionRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setUsers((prev) => [...prev, { doc: doc.data(), id: doc.id }]);
      });
    });
  }, []);

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

      if (user === undefined)
        window.location.href = "/accounting/accounting/registration";
    }
  }, [users]);

  const logOut = () => {
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  const userInfo = Object.keys(user).length !== 0 ? user.doc : null;

  return (
    <div className={style.account}>
      <LeftMenu />

      {userInfo ? (
        <div className={style.account__content}>
          <h1>{language === "russian" ? "Мой профиль" : "My profile"}</h1>

          <div className={style.account__info}>
            <img src={userInfo.avatar} alt="user avatar" />

            <div className={style.account__info__block}>
              <p>{language === "russian" ? "Полное имя" : "Full name"}</p>
              <h4>{userInfo.name}</h4>
            </div>

            <div className={style.account__info__block}>
              <p>{language === "russian" ? "Никнейм" : "User name"}</p>
              <h4>{userInfo.userName}</h4>
            </div>

            <div className={style.account__info__block}>
              <p>{language === "russian" ? "Gender" : "Пол"}</p>
              <h4>{userInfo.gender}</h4>
            </div>

            <div className={style.account__info__block}>
              <p>{language === "russian" ? "Email" : "Почта"}</p>
              <h4>{userInfo.email}</h4>
            </div>

            <div
              style={{ display: "flex", cursor: "pointer" }}
              onClick={logOut}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <h3 style={{ marginLeft: "0.5rem" }}>
                {language === "russian" ? "Выйти" : "Log out"}
              </h3>
            </div>
          </div>

          <BottomMenu />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Account;
