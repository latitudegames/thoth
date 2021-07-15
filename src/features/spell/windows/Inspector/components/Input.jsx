import { useState } from "react";

const Input = ({ control, updateData, initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const { dataKey } = control;

  const onChange = (e) => {
    setValue(e.target.value);
    updateData({
      [dataKey]: e.target.value,
    });
  };

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <input
        style={{ flex: 6, padding: "5px 10px", color: "#fff" }}
        value={value}
        type="text"
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
