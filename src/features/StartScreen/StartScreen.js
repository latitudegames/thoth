import CreateNew from "./components/CreateNew";
import OpenProject from "./components/OpenProject";

import css from "./startScreen.module.css";

//MAIN

const StartScreen = ({ createNew, ...props }) => {
  return (
    <div className={css["overlay"]}>
      <div className={css["center-container"]}>
        {createNew && <CreateNew />}
        {!createNew && <OpenProject />}
      </div>
    </div>
  );
};

export default StartScreen;
