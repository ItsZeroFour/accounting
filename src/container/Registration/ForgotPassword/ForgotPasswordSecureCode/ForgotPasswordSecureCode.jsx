import React, { useEffect, useState } from "react";
import style from "./ForgotPasswordSecureCode.module.scss";
import { collection, getDocs, doc, setDoc } from "@firebase/firestore";
import { db } from "../../../../firebase/firebase-config";

const ForgotPasswordSecureCode = () => {
  const [inputCode, setInputCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [code, setCode] = useState({});
  const [uncorrectCode, setUncorrectCode] = useState(false);

  const forgotPasswordCodeCollectionRef = collection(db, "forgotPasswordCode");

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
          (data) =>
            data.email === localStorage.getItem("forgotPasswordEmail") &&
            data.code === inputCode
        )
      );
  }, [inputCode]);

  // Update data
  const updateUserData = async (id, docData) => {
    const getCode = doc(forgotPasswordCodeCollectionRef, id);
    await setDoc(getCode, docData, { merge: true });
  };

  /*
    Check correct code. If correct - update state to false then set to
    localStorage id of the code and go to set new password.
    If code is not correct - set uncorrectCode to true
  */
  const resetPassword = async (event) => {
    event.preventDefault();

    if (
      code !== undefined &&
      code.email === localStorage.getItem("forgotPasswordEmail") &&
      code.code === inputCode
    ) {
      await updateUserData(code.id, { resetPassword: false });
      localStorage.setItem("forgotPasswordId", code.id);
      window.location.href =
        "/accounting/accounting/reset-password/new-password";
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
          <span>{localStorage.getItem("forgotPasswordEmail")}</span>
        </p>
        <form className={style.secure__code__form}>
          <input
            type="text"
            onChange={(event) => setInputCode(event.target.value)}
            placeholder="Enter code"
          />
          {uncorrectCode && <p>Uncorrect code!</p>}

          {inputCode !== "" ? (
            <button type="submit" onClick={resetPassword}>
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

export default ForgotPasswordSecureCode;
