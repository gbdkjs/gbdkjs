import React from "react";
import "./Button.css";

export default ({ children, onClick }) =>
  <div className="Button" onClick={onClick} children={children} />;
