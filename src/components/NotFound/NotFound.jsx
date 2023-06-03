import React from "react";
import { Link } from "react-router-dom";
import style from "./NotFound.module.scss";

const NotFound = () => {
  const language = localStorage.getItem("language");

  return (
    <div className={style.error__page}>
      <div className={style.content}>
        <h2 className={style.header} data-text="404">
          404
        </h2>
        <h4 data-text="Opps! Page not found">Opps! Page not found.</h4>
        <p>
          {language === "russian"
            ? "Извините, страница, которую вы ищете, не существует. Если вы думаете, что что-то сломано, сообщите о проблеме."
            : "Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem."}
        </p>
        <div className={style.btns}>
          <Link to="/accounting/">
            {language === "russian" ? "Вурнутся домой" : "return home"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
