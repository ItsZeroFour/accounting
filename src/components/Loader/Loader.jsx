import React from "react";
import style from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={style.box}>
      <div className={style.dots}></div>
    </div>
  );
};

export default Loader;
