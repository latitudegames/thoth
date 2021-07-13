import { Scrollbars } from "react-custom-scrollbars";
import css from "./window.module.css";

const WindowToolbar = (props) => {
  return <div className={css["window-toolbar"]}>{props.children}</div>;
};

const WindowLayout = (props) => {
  return <div className={css["window-layout"]}>{props.children}</div>;
};

const Window = (props) => {
  return (
    <div className={css["window"]}>
      <WindowToolbar>{props.toolbar}</WindowToolbar>
      <Scrollbars>
        <WindowLayout>{props.children}</WindowLayout>
      </Scrollbars>
    </div>
  );
};

export default Window;
