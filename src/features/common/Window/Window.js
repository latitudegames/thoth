import { Scrollbars } from "react-custom-scrollbars";
import css from "./window.module.css";

const WindowToolbar = (props) => {
  return <div className={css["window-toolbar"]}>{props.children}</div>;
};

const WindowLayout = (props) => {
  return <div className={css["window-layout"]}><Scrollbars>{props.children}</Scrollbars></div>;
};

const Window = ({border, dark, unpadded, ...props}) => {
  return (
    <div className={`${css["window"]} ${css[border && "bordered"]} ${css[dark && "darkened"]} ${css[dark && "unpadded"]}`}>
      <WindowToolbar>{props.toolbar}</WindowToolbar>
      <WindowLayout>{props.children}</WindowLayout>
    </div>
  );
};

export default Window;
