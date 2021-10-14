import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

const Paging = (props) => {
  const { totalNumbers, pageSize, onChangePage, currentPage } = props;
  const pageNumber = Math.ceil(totalNumbers / pageSize);
  if (pageNumber === 1) return null;

  const pages = _.range(1, pageNumber + 1);

  return (
    <nav aria-label="...">
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <a className="page-link" href="#home" onClick={() => onChangePage(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Paging.propTypes = {
  totalNumbers: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default Paging;
