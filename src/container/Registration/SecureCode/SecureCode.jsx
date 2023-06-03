import React, { useEffect, useState } from "react";
import style from "./SecureCode.module.scss";
import { db } from "../../../firebase/firebase-config";
import { collection, getDocs, doc, setDoc } from "@firebase/firestore";

const SecureCode = () => {
  const [codes, setCodes] = useState([]);
  const [codeAndEmail, setCodeAndEmail] = useState({});
  const [inputCode, setInputCode] = useState("");
  const [uncorrectCode, setUncorrectCode] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  const registrationCodeCollectionRef = collection(db, "registrationCode");
  const tempUserDataCollectionRef = collection(db, "tempUserData");

  // Registration Code
  useEffect(() => {
    const getCodes = async () => {
      const data = await getDocs(registrationCodeCollectionRef);
      setCodes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCodes();
  }, []);

  useEffect(() => {
    Object.keys(codes).length !== 0 &&
      setCodeAndEmail(codes.find((data) => data.code === inputCode));
  }, [inputCode]);

  // User
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(tempUserDataCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
      localStorage.getItem("userEmail") &&
      setUser(
        users.find((data) => data.email === localStorage.getItem("userEmail"))
      );
  }, [users]);

  // Update data
  const updateUserData = async (id, docData) => {
    const getUser = doc(tempUserDataCollectionRef, id);
    await setDoc(getUser, docData, { merge: true });
  };

  const submitCode = async (event) => {
    event.preventDefault();

    if (
      codeAndEmail !== undefined &&
      codeAndEmail.code === inputCode &&
      codeAndEmail.email === localStorage.getItem("userEmail")
    ) {
      await updateUserData(user.id, { codeIsTyped: true });
      setCodeAndEmail(false);
      localStorage.setItem("codeAuthIsTyped", true);
      window.location.href = "/accounting/accounting/registration/details";
    } else {
      setUncorrectCode(true);
    }
  };

  return (
    <div className={style.secure__code}>
      <div className={style.secure__code__content}>
        <h1>Welcome to Accounting</h1>
        <p>
          We just send a confirmation code over to{" "}
          <span>{localStorage.getItem("userEmail")}</span>
        </p>
        <form className={style.secure__code__form}>
          <input
            type="text"
            onChange={(event) => setInputCode(event.target.value)}
            placeholder="Enter code"
          />
          {uncorrectCode && <p>Uncorrect code!</p>}

          {inputCode !== "" ? (
            <button type="submit" onClick={submitCode}>
              Login
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.8, cursor: "auto" }}>
              Log in
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SecureCode;
