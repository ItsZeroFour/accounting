import React, { useEffect, useRef, useState } from "react";
import style from "./Registration.module.scss";
import { quotes } from "../../data/Registration";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { figures } from "../../data/Registration";
import emailjs from "@emailjs/browser";
import { db } from "../../firebase/firebase-config";
import { collection, addDoc, getDocs } from "@firebase/firestore";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [users, setUsers] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [wait, setWait] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const registrationCodeCollectionRef = collection(db, "registrationCode");
  const tempUserDataCollectionRef = collection(db, "tempUserData");
  const usersCollectionRef = collection(db, "users");

  const form = useRef();

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * quotes.length));
  }, []);

  // Random code generator
  useEffect(() => {
    let randomCode = "";

    for (let i = 0; i < 5; i++) {
      let generateRandomIndex = Math.floor(Math.random() * figures.length);
      randomCode += figures[generateRandomIndex];
    }

    setRandomCode(randomCode);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
    users.find((data) => data.email === email) === undefined
      ? setIsRegistered(false)
      : setIsRegistered(true);
  }, [email]);

  /*
    Send to firebase registration code and user email then add to
    tempUserData user email, password and authorization check
    The send to user email letter with his code for authorization
  */
  const sendEmail = async (event) => {
    event.preventDefault();
    setWait(true);

    await addDoc(registrationCodeCollectionRef, {
      email: email,
      code: randomCode,
    });

    await addDoc(tempUserDataCollectionRef, {
      email: email,
      password: password,
      codeIsTyped: false,
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
          setWait(false);
          localStorage.setItem("userEmail", email);
          window.location.href = "/accounting/accounting/registration/code";
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className={style.registration}>
      <div className={style.registration__content}>
        <div className={style.registration__content__left}>
          <h1 className={style.registration__title}>Signin</h1>
          <form className={style.registration__form} ref={form}>
            <div className={style.registration__form__block}>
              <label htmlFor="reg-email">
                <FontAwesomeIcon icon={faEnvelope} />
              </label>
              <input
                id="reg-email"
                type="email"
                name="to_name"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                placeholder="Enter your email"
              />
            </div>

            <input
              type="text"
              name="code"
              value={randomCode}
              style={{ display: "none" }}
            />

            <div className={style.registration__form__block}>
              <label htmlFor="reg-password">
                <FontAwesomeIcon icon={faLock} />
              </label>
              <input
                id="reg-password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
            </div>

            {isRegistered && (
              <p className={style.registration__error}>
                Account has been already registered, please{" "}
                <Link to="/accounting/signin">Log in</Link>
              </p>
            )}
          </form>

          {password.length > 7 && email !== "" && !isRegistered ? (
            <button
              type="submit"
              onClick={!wait ? sendEmail : console.log("please wait")}
              style={wait ? { opacity: 0.8 } : { opacity: 1 }}
            >
              {wait ? "Wait..." : "Signin"}
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.8, cursor: "auto" }}>
              Signin
            </button>
          )}

          <p className={style.registration__text}>
            Already have an Account? <Link to="/accounting/signin">Log in</Link>
          </p>
        </div>

        <div className={style.registration__content__right}>
          <div className={style.registration__mask}>
            <h2>{quotes[randomNumber].quote}</h2>
            <p>- {quotes[randomNumber].author}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
