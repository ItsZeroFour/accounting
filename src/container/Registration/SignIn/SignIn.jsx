import React, { useEffect, useState } from "react";
import style from "./SignIn.module.scss";
import logo from "../../../images/logo.png";
import { Link } from "react-router-dom";
import { db } from "../../../firebase/firebase-config";
import { collection, getDocs } from "@firebase/firestore";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [uncorrect, setUncorrect] = useState(false);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUser();
  }, []);

  const continueButton = (event) => {
    event.preventDefault();

    Object.keys(users).length !== 0 &&
      setUser(users.find((data) => data.email === email));

    if (
      user !== undefined &&
      user.email === email &&
      user.password === password
    ) {
      localStorage.setItem("userEmail", email);
      setUncorrect(false);
      window.location.href = "/accounting/accounting";
    } else {
      setUncorrect(true);
    }
  };

  return (
    <div className={style.signin}>
      <div className={style.signin__left}>
        <img src={logo} alt="logo" />

        <div className={style.signin__text}>
          <h1>Accounting</h1>

          <p>Sign in to continue access</p>
        </div>
      </div>

      <form className={style.signin__form}>
        <div className={style.signin__form__content}>
          <h1>Sign in</h1>

          <input
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Addres"
          />
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <Link to="/acconting/forgot-password">Forgot password</Link>

          {email !== "" && password !== "" ? (
            <button type="submit" onClick={continueButton}>
              Continue
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.6, cursor: "auto" }}>
              Continue
            </button>
          )}

          {uncorrect && <p>Uncorrect email or password!</p>}
        </div>
      </form>
    </div>
  );
};

export default SignIn;
