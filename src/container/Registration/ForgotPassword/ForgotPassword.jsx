import React, { useEffect, useRef, useState } from "react";
import style from "./ForgotPassword.module.scss";
import forgotpasswordImg from "../../../images/forgotpassword/forgotpassword.svg";
import { Link } from "react-router-dom";
import { collection, getDocs, addDoc } from "@firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import { figures } from "../../../data/Registration";
import emailjs from "@emailjs/browser";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [isRegistered, setIsRegistered] = useState(true);
  const [wait, setWait] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const usersCollectionRef = collection(db, "users");
  const forgotPasswordCodeCollectionRef = collection(db, "forgotPasswordCode");

  const form = useRef();

  // Random code generator
  useEffect(() => {
    let randomCode = "";

    for (let i = 0; i < 5; i++) {
      let generateRandomIndex = Math.floor(Math.random() * figures.length);
      randomCode += figures[generateRandomIndex];
    }

    setRandomCode(randomCode);
  }, []);

  /*
    Get all users then add them to the useState. Then found current user
    if user found - set true else not - set false
  */
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
    Send to firebase code to reset password then send email with this code
  */
  const resetPasswordButton = async (event) => {
    event.preventDefault();

    setWait(true);

    await addDoc(forgotPasswordCodeCollectionRef, {
      email: email,
      code: randomCode,
      resetPassword: true,
    });

    emailjs
      .sendForm(
        "service_a6waexr",
        "template_kcrn6mh",
        form.current,
        "Bte1EjapjDkuVt8Kb"
      )
      .then(
        () => {
          setWait(false);
          localStorage.setItem("forgotPasswordEmail", email);
          window.location.href = "/accounting/accounting/forgot-password/code";
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className={style.forgotpassword}>
      <div className={style.forgotpassword__content}>
        <img src={forgotpasswordImg} alt="img forgot password" />

        <form className={style.forgotpassword__form} ref={form}>
          <h1>Forgot Your Password ?</h1>

          <input
            type="email"
            name="to_name"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Addres"
          />

          <input
            type="text"
            name="code"
            value={randomCode}
            style={{ display: "none" }}
          />

          {!isRegistered && (
            <p className={style.forgotpassword__error}>Account not found!</p>
          )}

          {users.length !== 0 && email !== "" && isRegistered ? (
            <button
              type="submit"
              onClick={!wait ? resetPasswordButton : console.log("wait")}
            >
              {!wait ? "Reset Password" : "Wait..."}
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.6 }}>
              Reset Password
            </button>
          )}

          <Link to="/accounting/signin">Back to Sign In</Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
