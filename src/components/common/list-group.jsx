import React from "react";

const ListGroup = ({
  genres,
  onSelectGenre,
  selectedGenre,
  textProperty,
  valueProperty,
}) => {
  return (
    <ul className="list-group">
      {genres.map((genre) => (
        <li
          key={genre[valueProperty]}
          className={
            genre.name === selectedGenre.name
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={() => onSelectGenre(genre)}
          style={{ cursor: "pointer" }}
        >
          {genre[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
