import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ onSort, columns, sortPath, movies, onLike, onDelete }) => {
  return (
    <table className="table table-hover">
      <TableHeader onSort={onSort} columns={columns} sortPath={sortPath} />

      <TableBody
        data={movies}
        onLike={onLike}
        onDelete={onDelete}
        columns={columns}
      />
    </table>
  );
};

export default Table;
