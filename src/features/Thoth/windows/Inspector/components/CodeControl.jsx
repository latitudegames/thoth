import { usePubSub } from "../../../../../contexts/PubSubProvider";
import { useLayout } from "../../../../../contexts/LayoutProvider";

const CodeControl = ({
  initialValue,
  name,
  dataKey,
  nodeId,
  control,
  controls,
}) => {
  const { events, publish } = usePubSub();
  const { createOrFocus, windowTypes } = useLayout();

  const onClick = () => {
    const data = {
      data: initialValue,
      nodeId,
      dataKey,
      name,
      control,
    };

    publish(events.TEXT_EDITOR_SET, data);
    createOrFocus(windowTypes.TEXT_EDITOR, "Text Editor");
  };

  return <button onClick={onClick}>Edit code in editor</button>;
};

export default CodeControl;
