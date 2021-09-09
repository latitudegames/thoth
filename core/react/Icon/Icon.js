import React from "react";

import css from "./icon.module.css";

export const componentCategories = {
  "AI/ML": "play-print",
  "I/O": "water",
  Logic: "switch",
  State: "state",
  Module: "cup",
  Core: "ankh",
};

export const dataControlCategories = {
  "Data Inputs": "properties",
  "Data Outputs": "properties",
  Fewshot: "fewshot",
  Stop: "stop-sign",
  Temperature: "temperature",
  "Max Tokens": "moon",
};

const Icon = ({ name, size, style }) => {
  if (!size) size = 16;
  if (!name) name = "warn";
  return (
    <div
      className={`${css["icon"]} ${css[name]}`}
      style={{ height: size, width: size, ...style }}
    ></div>
  );
};

export default Icon;
