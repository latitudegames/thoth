import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";

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
      const totalInputs = enkiData.data[0].inputs.length;
      const totalOutputs = enkiData.data[0].outputs.length;
      selectEnki({
        taskName,
        totalInputs,
        totalOutputs,
        ...enkiData,
      });
    }
    setValue("");
  };

  const listChange = async (event) => {
    const taskName = event.target.value;
    const enkiData = await getEnkiPrompt(taskName);
    if (enkiData) {
      selectEnki({
        taskName,
        ...enkiData,
      });
    }
  };

  useEffect(async () => {
    const list = await getEnkis();
    const enkiTaskList = list?.enkiTasks;
    if (enkiTaskList) {
      updateTaskList(enkiTaskList);
    }
  }, [activeTask]);

  return (
    <>
      <div style={{ flex: 1, display: "flex" }}>
        {activeTask ? (
          <>
            <Chip
              label={activeTask}
              onDelete={() => selectEnki(undefined)}
              color="white"
              variant="outlined"
            />
          </>
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
      <br></br>
      {taskList?.length > 0 && !activeTask && (
         <div style={{ flex: 1, display: "flex" }}>
              <Select native onChange={listChange}>
                <option aria-label="None" disabled selected value="" />
                {taskList.map((task) => {
                  return <option value={task.name}>{task.name}</option>;
                })}
              </Select>
              </div>
            )}
      <br></br>
      {activeTask && (
        <div style={{ flex: 1, display: "flex" }}>
          {activeEnki.serialization.introduction}
        </div>
      )}
    </>
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
