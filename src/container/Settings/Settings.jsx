import React, { useEffect, useRef, useState } from "react";
import style from "./Settings.module.scss";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import Loader from "../../components/Loader/Loader";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faDollar,
  faLanguage,
  faMoon,
  faRuble,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import emailjs from "@emailjs/browser";
import { figures } from "../../data/Registration";

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [sendCode, setSendCode] = useState(false);
  const [changeEmailWindow, setChangeEmailWindow] = useState(false);
  const [error, setError] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [codeIsCorrect, setCodeIsCorrect] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(false);
  const [completeChanges, setCompleteChanges] = useState(false);
  const [changeGenderWindow, setChangeGenderWindow] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");

  // Save useState value to local storage
  const [switchDisplayName, setSwitchDisplayName] = useState(() => {
    const getSavedValue = localStorage.getItem("switchDisplayName");
    const initialValue = JSON.parse(getSavedValue);
    return initialValue || false;
  });
  const [changeValute, setChangeValute] = useState(() => {
    const getSavedValue = localStorage.getItem("changeValute");
    const initialValue = getSavedValue;
    return initialValue || "Dollars";
  });
  const [changeTheme, setChangeTheme] = useState(() => {
    const getSavedValue = localStorage.getItem("darkTheme");
    const initialValue = JSON.parse(getSavedValue);
    return initialValue || false;
  });
  const [language, setLanguage] = useState(() => {
    const getSavedValue = localStorage.getItem("language");
    const initialValue = getSavedValue;
    return initialValue || "English";
  });

  useEffect(() => {
    localStorage.setItem("switchDisplayName", switchDisplayName);
  }, [switchDisplayName]);

  useEffect(() => {
    localStorage.setItem("changeValute", changeValute);
  }, [changeValute]);

  useEffect(() => {
    localStorage.setItem("darkTheme", changeTheme);
  }, [changeTheme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const form = useRef();

  const usersCollectionRef = collection(db, "users");
  const changeEmailCodeCollectionRef = collection(db, "changeEmailCode");

  const updateUserData = async (id, docData) => {
    const getDoc = doc(usersCollectionRef, id);
    await setDoc(getDoc, docData, { merge: true });
  };

  useEffect(() => {
    let randomCode = "";

    for (let i = 0; i < 5; i++) {
      let generateRandomIndex = Math.floor(Math.random() * figures.length);
      randomCode += figures[generateRandomIndex];
    }

    setRandomCode(randomCode);
  }, []);

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
    }
  }, [users]);

  if (user === undefined) {
    window.location.href = "/accounting/accounting/registration";
  }

  const userInfo =
    user !== undefined && Object.keys(user).length !== 0 ? user.doc : null;

  // Registration Code
  useEffect(() => {
    onSnapshot(changeEmailCodeCollectionRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        setCodes((prev) => [...prev, doc.data()]);
      });
    });
  }, []);

  /*
    Check if code is correct - set true else set false
  */
  const checkCode = (event) => {
    event.preventDefault();

    Object.keys(codes).length !== 0 &&
    codes.find(
      (data) => data.code === inputCode && data.email === user.doc.email
    ) !== undefined
      ? setCodeIsCorrect(true)
      : setCodeIsCorrect(false);
  };

  const changeEmailOpenWindow = (event) => {
    event.preventDefault();
    setChangeEmailWindow(!changeEmailWindow);
  };

  const sendCodeToChangeEmail = async (event) => {
    event.preventDefault();

    await addDoc(changeEmailCodeCollectionRef, {
      code: randomCode,
      email: user.doc.email,
    });

    await emailjs
      .sendForm(
        "service_a6waexr",
        "template_kcrn6mh",
        form.current,
        "Bte1EjapjDkuVt8Kb"
      )
      .then(
        () => {
          setSendCode(true);
          setError(false);
        },
        () => {
          setError(true);
        }
      );
  };

  /*
    If input not empty and input includes @ - update user Email and
    update local storage value else set error to true
  */
  const updateEmail = async (event) => {
    event.preventDefault();

    if (newEmail !== "" && newEmail.includes("@")) {
      await updateUserData(user.id, {
        email: newEmail,
      });
      localStorage.setItem("userEmail", newEmail);
      setChangeEmailWindow(false);
    } else {
      setError(true);
    }
  };

  /*
    Update user avatar
  */

  const fileReader = new FileReader();
  fileReader.onloadend = () => {
    setAvatar(fileReader.result);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    // If file size is larger than max file size
    if (file?.size < 1048487) {
      fileReader.readAsDataURL(file);
      setMaxFileSize(false);
    } else {
      setMaxFileSize(true);
    }
  };

  const updateUserDataOnClick = async () => {
    avatar !== "" &&
      (await updateUserData(user.id, {
        avatar: avatar,
      }));
    fullName !== "" &&
      (await updateUserData(user.id, {
        name: fullName,
      }));
    userName !== "" &&
      (await updateUserData(user.id, {
        userName: userName,
      }));
    gender !== "" &&
      (await updateUserData(user.id, {
        gender: gender,
      }));

    if (avatar !== "" || fullName !== "" || userName !== "" || gender !== "") {
      setCompleteChanges(true);
    }

    window.location.reload();
  };

  const changeGender = async (event) => {
    event.preventDefault();
    setChangeGenderWindow(true);
  };

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    setChangeTheme(true);
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    setChangeTheme(false);
  };

  const toggleTheme = (event) => {
    if (event.target.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  };

  return (
    <div className={style.settings}>
      <LeftMenu />
      {userInfo ? (
        <div className={style.settings__content}>
          {changeEmailWindow && (
            <div className={style.settings__change__email}>
              <div className={style.blur} />

              <form className={style.settings__change__email__form} ref={form}>
                <FontAwesomeIcon
                  icon={faClose}
                  onClick={() => setChangeEmailWindow(false)}
                />

                <input
                  type="text"
                  name="code"
                  value={randomCode}
                  style={{ display: "none" }}
                />

                <input
                  style={{ display: "none" }}
                  name="to_name"
                  type="email"
                  value={userInfo.email}
                />

                <div className={style.settings__change__email__inputs}>
                  {!codeIsCorrect && (
                    <div>
                      {sendCode && (
                        <input
                          type="number"
                          placeholder="Code"
                          onChange={(event) => setInputCode(event.target.value)}
                        />
                      )}
                      {!sendCode ? (
                        <button type="submit" onClick={sendCodeToChangeEmail}>
                          {language === "russian"
                            ? "Отправить код"
                            : "Send Code"}
                        </button>
                      ) : (
                        <button type="submit" onClick={checkCode}>
                          {language === "russian" ? "Далее" : "Next"}
                        </button>
                      )}

                      {error && (
                        <p>
                          {language === "russian"
                            ? "Введены неверные значение или повторите попытку позже"
                            : "Fields are not filled in correctly or try again later"}
                        </p>
                      )}
                    </div>
                  )}

                  {codeIsCorrect && (
                    <div>
                      <input
                        type="email"
                        placeholder="New email"
                        onChange={(event) => setNewEmail(event.target.value)}
                      />
                      <button onClick={updateEmail}>
                        {language === "russian"
                          ? "Изменить Email"
                          : "Change Email"}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className={style.settings__container}>
            <div className={style.settings__account}>
              <label htmlFor="settings-avatar">
                <img src={userInfo.avatar} alt="avatar" />
              </label>

              {maxFileSize && (
                <p>
                  {language === "russian"
                    ? "Лимит на размер файла!"
                    : "File size limit"}
                </p>
              )}

              <input
                id="settings-avatar"
                type="file"
                accept=".jpg, .png, .jpeg"
                onChange={handleSubmit}
                style={{ display: "none" }}
              />

              <form className={style.settings__form}>
                <div className={style.settings__form__block}>
                  <label htmlFor="user-name">
                    {language === "russian" ? "Полное имя" : "Full name"}
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={userInfo.name}
                  />
                </div>

                <div className={style.settings__form__block}>
                  <label htmlFor="user-name">
                    {language === "russian"
                      ? "Пользовательский ник"
                      : "User name"}
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    onChange={(event) => setUserName(event.target.value)}
                    placeholder={userInfo.userName}
                  />
                </div>

                <div className={style.settings__form__block}>
                  <label htmlFor="user-name">
                    {language === "russian" ? "Пароль" : "Password"}
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    disabled
                    placeholder="********"
                  />
                  <Link to="/acconting/forgot-password">
                    {language === "russian"
                      ? "Изменить пароль"
                      : "Change password"}
                  </Link>
                </div>

                <div className={style.settings__form__block}>
                  <label htmlFor="user-name">Email</label>
                  <input
                    id="user-name"
                    type="text"
                    disabled
                    placeholder={userInfo.email}
                  />
                  <button onClick={changeEmailOpenWindow}>
                    {language === "russian" ? "Изменить почту" : "Change Email"}
                  </button>
                </div>

                <div className={style.settings__form__block}>
                  <label htmlFor="user-name">
                    {language === "russian" ? "Пол" : "Gender"}
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    disabled
                    placeholder={userInfo.gender}
                  />
                  <button onClick={changeGender}>
                    {language === "russian" ? "Изменить пол" : "Change gender"}
                  </button>
                </div>

                {changeGenderWindow && (
                  <div className={style.settings__change__gender}>
                    <h3>
                      {language === "russian"
                        ? "Выбирите пол"
                        : "Choose gender"}
                    </h3>

                    <ul className={style.settings__gender__list}>
                      <li>
                        <input
                          id="details-male"
                          type="radio"
                          name="gender"
                          onChange={() => setGender("Male")}
                        />
                        <label htmlFor="details-male">
                          {language === "russian" ? "Мужский" : "Male"}
                        </label>
                      </li>

                      <li>
                        <input
                          id="details-female"
                          type="radio"
                          name="gender"
                          onChange={() => setGender("Female")}
                        />
                        <label htmlFor="details-female">
                          {language === "russian" ? "Женский" : "Femele"}
                        </label>
                      </li>
                    </ul>
                  </div>
                )}
              </form>
              {(avatar !== "" ||
                fullName !== "" ||
                userName !== "" ||
                gender !== "") && (
                <button
                  className={style.settings__update__data}
                  onClick={updateUserDataOnClick}
                >
                  {language === "russian" ? "Обновить" : "Update"}
                </button>
              )}

              {completeChanges && (
                <p>
                  {language === "russian"
                    ? "Все изменения были сохранены!"
                    : "All changes has been complete!"}
                </p>
              )}
            </div>

            <div className={style.settings__global__settings}>
              <ul>
                <li>
                  {language === "russian"
                    ? "Отоброжаемое имя в главном меню"
                    : "Name display in the main menu"}
                  <div>
                    <FontAwesomeIcon icon={faSignature} />
                    <input
                      type="checkbox"
                      onClick={() => setSwitchDisplayName(!switchDisplayName)}
                      checked={switchDisplayName ? true : false}
                    />
                  </div>
                </li>

                <li>
                  {language === "russian" ? "Изменить валюту" : "Change valute"}
                  <div>
                    <FontAwesomeIcon
                      icon={changeValute === "Rubles" ? faRuble : faDollar}
                    />
                    <select
                      onChange={(event) => setChangeValute(event.target.value)}
                    >
                      <option
                        value="Dollars"
                        selected={changeValute === "Dollars"}
                      >
                        {language === "russian" ? "Доллары" : "Dollars"}
                      </option>
                      <option
                        value="Rubles"
                        selected={changeValute === "Rubles"}
                      >
                        {language === "russian" ? "Рубли" : "Rubles"}
                      </option>
                    </select>
                  </div>
                </li>

                <li>
                  {language === "russian" ? "Изменить язык" : "Change language"}
                  <div>
                    <FontAwesomeIcon icon={faLanguage} />
                    <select
                      onChange={(event) => setLanguage(event.target.value)}
                    >
                      <option value="english" selected={language === "English"}>
                        Ensglish
                      </option>
                      <option value="russian" selected={language === "Русский"}>
                        Русский
                      </option>
                    </select>
                  </div>
                </li>

                <li>
                  {language === "russian" ? "Темная тема" : "Dark theme"}
                  <div>
                    <FontAwesomeIcon icon={faMoon} />
                    <input
                      type="checkbox"
                      checked={changeTheme === true}
                      onChange={toggleTheme}
                    />
                  </div>
                </li>
              </ul>
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

export default Settings;
