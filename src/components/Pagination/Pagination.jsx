import React from "react";
import style from "./Pagination.module.scss";

const Pagination = ({ accountingsPerPage, totalAccountings, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAccountings / accountingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={style.pagination}>
      <ul className={style.pagination__list}>
        {pageNumbers.map((number) => (
          <li
            className={style.pagination__item}
            key={number}
            onClick={() => paginate(number)}
          >
            <h5>{number}</h5>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
