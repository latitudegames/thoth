import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";
import Chip from "@material-ui/core/Chip";

const EnkiDetails = () => {
  const [value, setValue] = useState("");
  const [activeEnki, selectEnki] = useState(undefined);
  const [taskList, updateTaskList] = useState(undefined);
  const activeTask = activeEnki?.taskName;
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onSearch = async () => {
    const taskName = value;
    const enkiData = await getEnkiPrompt(value);
    if (enkiData) {
      selectEnki({
        taskName,
        ...enkiData,
      });
    }
    setValue("");
  };

  useEffect(async ()=>{
    const list = await getEnkis()
    const parsedList = JSON.parse(list)
    const enkiTaskList = parsedList?.enkiTasks
    if (enkiTaskList){
        updateTaskList(enkiTaskList)
    }
  },[activeTask])

  return (
    <div style={{ flex: 1, display: "flex" }}>
      {activeTask ? (
        <Chip
          label={activeTask}
          onDelete={() => selectEnki(undefined)}
          color="white"
          variant="outlined"
        />
      ) : (
        <>
          <input
            style={{ flex: 6, padding: 0 }}
            value={value}
            type="text"
            onChange={onChange}
          />
          <button style={{ flex: 1 }} onClick={onSearch}>
            Search Enki by Name
          </button>
        </>
      )}
    </div>
  );
};

const EnkiSelect = ({ updateData, control, initialValue, ...props }) => {
  //   const { controls, dataKey } = control;

  //   const update = (update) => {
  //     updateData({ [dataKey]: update });
  //   };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <EnkiDetails />
    </div>
  );
};

export default EnkiSelect;
