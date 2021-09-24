import { useState } from "react";

import InputComponent from "../../../common/Input/Input";

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
      <InputComponent
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
