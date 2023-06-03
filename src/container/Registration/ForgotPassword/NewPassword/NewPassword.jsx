import React, { useEffect, useState } from "react";
import style from "./NewPassword.module.scss";
import { db } from "../../../../firebase/firebase-config";
import { collection, getDocs, doc, setDoc } from "@firebase/firestore";
import logo from "../../../../images/logo.png";

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [codes, setCodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [code, setCode] = useState({});
  const [error, setError] = useState(false);

  const forgotPasswordCodeCollectionRef = collection(db, "forgotPasswordCode");
  const usersCollectionRef = collection(db, "users");

  // Get Codes
  useEffect(() => {
    const getCodes = async () => {
      const data = await getDocs(forgotPasswordCodeCollectionRef);
      setCodes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCodes();
  }, []);

  useEffect(() => {
    Object.keys(codes).length !== 0 &&
      setCode(
        codes.find(
          (data) => data.id === localStorage.getItem("forgotPasswordId")
        )
      );
  }, [codes]);

  // Get Users
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
      code !== undefined &&
      setUser(users.find((data) => data.email === code.email));
  }, [users]);

  const updateUserData = async (id, docData) => {
    const getCode = doc(usersCollectionRef, id);
    await setDoc(getCode, docData, { merge: true });
  };

  /*
    Check if code not equal undefined and reset password equal false
    if true, remove items to local storage and update password the go to home page
  */
  const resetPassword = async (event) => {
    event.preventDefault();

    if (
      code !== undefined &&
      code.email !== undefined &&
      code.resetPassword === false &&
      code.email === localStorage.getItem("forgotPasswordEmail")
    ) {
      localStorage.removeItem("forgotPasswordEmail");
      localStorage.removeItem("forgotPasswordId");
      await updateUserData(user.id, { password: newPassword });
      window.location.href = "/accounting/accounting";
    } else {
      setError(true);
    }
  };

  return (
    <div className={style.newpassword}>
      <div className={style.newpassword__content}>
        <img src={logo} alt="logo" />

        <form className={style.newpassword__form}>
          <p>
            Enter new password for your account{" "}
            {localStorage.getItem("forgotPasswordEmail")}
          </p>

          <label htmlFor="newpassword-pass">New Password</label>
          <input
            id="newpassword-pass"
            type="password"
            onChange={(event) => setNewPassword(event.target.value)}
          />

          {error && <p>Error! Please, try again later</p>}

          {newPassword.length > 7 && Object.keys(codes).length !== 0 ? (
            <button type="submit" onClick={resetPassword}>
              Reset Password
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.6 }}>
              Reset Password
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
