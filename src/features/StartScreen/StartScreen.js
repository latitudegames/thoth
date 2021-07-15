import React, { useState } from "react";

import CreateNew from "./components/CreateNew";
import OpenProject from "./components/OpenProject";

import css from "./startScreen.module.css";

//MAIN

const StartScreen = ({ ...props }) => {
  const [newVisible, setNewVisible] = useState(false);

  return (
    <div className={css["overlay"]}>
      <div className={css["center-container"]}>
        {newVisible && <CreateNew setNewVisible={setNewVisible} />}
        {!newVisible && <OpenProject setNewVisible={setNewVisible} />}
      </div>
    </div>
  );
};

export default StartScreen;
