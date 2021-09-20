import { useState } from "react";

const NumberSockets = ({ control, updateData, initialValue }) => {
  const [value, setValue] = useState(Array.isArray(initialValue) ? initialValue.length : initialValue);
  const { data, dataKey } = control;

  const onChange = (e) => {
    const numSockets = parseInt(e.target.value);
    const sockets:any[] = []
    for (let i = 0; i < numSockets; i++) {
      sockets.push({
        name: i.toString(),
        taskType: data.taskType,
        // might also want to camel case any spacing here too
        socketKey: i.toString(),
        connectionType: data.connectionType,
        socketType: data.socketType,
      });
    }
    setValue(e.target.value);
    updateData({[dataKey]: sockets});
  };

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <input
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
      />
    </div>
  );
};

export default NumberSockets;