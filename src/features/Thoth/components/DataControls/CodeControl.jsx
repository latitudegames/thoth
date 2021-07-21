import { useLayout } from "../../../../contexts/LayoutProvider";

const CodeControl = ({
  initialValue,
  name,
  dataKey,
  nodeId,
  control,
  controls,
}) => {
  const { createOrFocus, windowTypes } = useLayout();

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, "Text Editor");
  };

  return <button onClick={onClick}>Edit code in editor</button>;
};

export default CodeControl;
