import React, { useEffect, useState } from "react";
import style from "./Details.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../../firebase/firebase-config";
import { collection, getDocs, addDoc } from "@firebase/firestore";

const Details = () => {
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [maxFileSize, setMaxFileSize] = useState(false);
  const [user, setUser] = useState([]);
  const [passwordAndEmail, setPasswordAndEmail] = useState({});
  const [wait, setWait] = useState(false);
  // * Доставать из tempUserData все данные пользователя (ищя их по userEmail) и добавлять в новый общий массив пользователей

  const tempUserDataCollectionRef = collection(db, "tempUserData");
  const usersCollectionRef = collection(db, "users");

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

  // Found current user
  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(tempUserDataCollectionRef);
      setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUser();
  }, []);

  useEffect(() => {
    Object.keys(user).length !== 0 &&
      setPasswordAndEmail(
        user.find((data) => data.email === localStorage.getItem("userEmail"))
      );
  }, [user]);

  // Create user
  const registerUser = async (event) => {
    event.preventDefault();
    setWait(true);

    await addDoc(usersCollectionRef, {
      email: passwordAndEmail.email,
      password: passwordAndEmail.password,
      name: name,
      gender: gender,
      userName: username,
      avatar: avatar,
      accounting: "[]",
    });

    setWait(false);
    window.location.href = "/accounting/accounting";
  };

  return (
    <div className={style.details}>
      <div className={style.details__content}>
        <h1>Registration</h1>

        <form className={style.details__form}>
          <div className={style.details__form__block}>
            <label
              className={style.details__file__label}
              htmlFor="details-file"
            >
              {avatar ? (
                <img
                  className={style.details__avatar}
                  src={avatar}
                  alt="your avatar"
                />
              ) : (
                <FontAwesomeIcon icon={faCamera} />
              )}
            </label>
            <input
              id="details-file"
              type="file"
              accept=".jpg, .png, .jpeg"
              onChange={handleSubmit}
              style={{ display: "none" }}
            />

            {maxFileSize && <p>The file is too big!</p>}
          </div>

          <div className={style.details__form__block}>
            <label htmlFor="details-fullname">Full Name</label>
            <input
              id="details-fullname"
              type="text"
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className={style.details__form__block}>
            <label htmlFor="details-name">Username</label>
            <input
              id="details-name"
              type="text"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className={style.details__gender}>
            <h2>Gender</h2>

            <ul className={style.details__gender__list}>
              <li>
                <input
                  id="details-male"
                  type="radio"
                  name="gender"
                  onChange={() => setGender("Male")}
                />
                <label htmlFor="details-male">Male</label>
              </li>

              <li>
                <input
                  id="details-female"
                  type="radio"
                  name="gender"
                  onChange={() => setGender("Female")}
                />
                <label htmlFor="details-female">Female</label>
              </li>
            </ul>
          </div>

          {name !== "" &&
          gender !== "" &&
          username !== "" &&
          avatar !== "" &&
          !maxFileSize &&
          passwordAndEmail.codeIsTyped ? (
            <button
              type="submit"
              onClick={!wait ? registerUser : console.log("wait")}
            >
              {!wait ? "Register" : "Wait..."}
            </button>
          ) : (
            <button type="submit" style={{ opacity: 0.6, cursor: "auto" }}>
              Register
            </button>
          )}

          {!passwordAndEmail.codeIsTyped && (
            <p className={style.details__error}>
              You don't typed code witch we were send to you email
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Details;
