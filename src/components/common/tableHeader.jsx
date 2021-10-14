import React, { Component } from "react";

class TableHeader extends Component {
  raiseSort = (path) => {
    const sortPath = { ...this.props.sortPath };
    if (sortPath.sort === path)
      sortPath.order = sortPath.order === "asc" ? "desc" : "asc";
    else {
      sortPath.order = "asc";
      sortPath.sort = path;
    }
    this.props.onSort(sortPath);
  };

  renderSortIcon = (column) => {
    const { sortPath } = this.props;
    if (column.path !== sortPath.sort) return;
    if (sortPath.order === "asc") return <i className="fa fa-sort-asc"></i>;
    return <i className="fa fa-sort-desc"></i>;
  };

  render() {
    const { columns } = this.props;
    return (
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              style={{ cursor: "pointer" }}
              key={column.path || column.key}
              onClick={() => this.raiseSort(column.path || column.key)}
            >
              {column.label} {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
