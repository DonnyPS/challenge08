import React from "react";

const Search = ({ onSearch }) => {
  return (
    <input
      type="text"
      className="form-control my-3"
      placeholder="Search..."
      onChange={(e) => onSearch(e.currentTarget.value)}
    />
  );
};

export default Search;
