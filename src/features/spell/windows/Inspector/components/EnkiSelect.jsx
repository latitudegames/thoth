import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const EnkiDetails = ({ addOutput }) => {
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
      enkiData.data[0].outputs.forEach((_output, index) => {
        console.log("adding output",`${taskName}:Output-${index}`)
        addOutput(`${taskName}:Output-${index}`);
      });
      selectEnki({
        taskName,
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
              Search Enki Name
            </button>
          </>
        )}
      </div>
      <br></br>
      {taskList?.length > 0 && !activeTask && (
        <div style={{ flex: 1, display: "flex", width: "100%" }}>
          <FormControl>
            <Select native onChange={listChange}>
              <option aria-label="None" disabled selected value="" />
              {taskList.map((task) => {
                return <option value={task.name}>{task.name}</option>;
              })}
            </Select>
            <FormHelperText margin={"dense"}>Select Enki</FormHelperText>
          </FormControl>
        </div>
      )}
      <br></br>
      {/* {activeTask && (
        <div style={{ flex: 1, display: "flex" }}>
          {activeEnki.serialization.introduction}
        </div>
      )} */}
    </>
  );
};

const EnkiSelect = ({ updateData, control, initialValue, ...props }) => {
  const [outputs, setOutputs] = useState([...initialValue]);

  const { controls, dataKey } = control;


  useEffect(() => {
    setOutputs([...initialValue]);
  }, [initialValue]);
  const update = (update) => {
    updateData({ [dataKey]: update });
  };

  const addOutput = (output) => {
    const newOutput = {
      name: output,
      socketType: "String",
      taskType: controls.data.taskType || "output",
    };

    const newOutputs = [...outputs, newOutput];
    console.log("newOutputs",newOutputs)
    setOutputs(newOutputs);
    update(newOutputs);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <EnkiDetails addOutput={addOutput} />
    </div>
  );
};

export default EnkiSelect;
