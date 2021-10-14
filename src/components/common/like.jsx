import React from "react";

const Like = (props) => {
  let heart = "fa fa-heart";
  if (!props.liked) heart += "-o";
  return (
    <i
      style={{ cursor: "pointer" }}
      onClick={props.onLiked}
      className={heart}
      aria-hidden="true"
    ></i>
  );
};

export default Like;
