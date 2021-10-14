import React from "react";
import { NavLink, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  return (
    <Navbar bg="light">
      <div className="container">
        <Link to="/">
          <Navbar.Brand style={{ fontWeight: "bold" }}>conFlix</Navbar.Brand>
        </Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <NavLink className="nav-item nav-link" to="/movies">
              Movies
            </NavLink>
            <NavLink className="nav-item nav-link" to="/players">
              Blog
            </NavLink>
            <NavLink className="nav-item nav-link" to="/login">
              Login
            </NavLink>
          </ul>
        </div>
      </div>
    </Navbar>
  );
};

export default NavBar;
