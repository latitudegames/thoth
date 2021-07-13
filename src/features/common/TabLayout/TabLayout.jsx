import css from "./TabLayout.module.css";
import Toolbar from "../Toolbar/Toolbar";

const TabLayout = ({ children, options, toolbar }) => {
  return (
    <>
      <div className={css["view-container"]}>
        <div style={{ position: "relative", height: "100%" }}>{children}</div>
      </div>
    </>
  );
};

export default TabLayout;
