import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const EnkiDetails = ({ addInput, addOutput, update, throughput }) => {
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
      enkiData.data[0].inputs.forEach((_input, index) => {
        addInput(`${taskName} Input ${index + 1}`);
      });
      enkiData.data[0].outputs.forEach((_output, index) => {
        addOutput(`${taskName} Output ${index + 1}`);
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
      enkiData.data[0].inputs.forEach((_input, index) => {
        addInput(`Input ${index + 1}`);
      });
      enkiData.data[0].outputs.forEach((_output, index) => {
        addOutput(`Output ${index + 1}`);
      });
      selectEnki({
        taskName,
        ...enkiData,
      });
    }
  };

  const clearEnki = async () => {
    update(throughput);
    selectEnki(undefined);

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
      <div style={{ flex: 1, display: "flex" }}>
        {activeTask ? (
          <>
            <Chip
              label={activeTask}
              onDelete={clearEnki}
              color="default"
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
              Search
            </button>
          </>
        )}
      </div>
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
  const { inputs: initialInputs = [], outputs: initialOutputs = [] } =
    initialValue;

  const [inputs, setInputs] = useState([...initialInputs]);
  const [outputs, setOutputs] = useState([...initialOutputs]);

  const { controls, dataKey } = control;

  useEffect(() => {
    setInputs([...initialInputs]);
    setOutputs([...initialOutputs]);
  }, [initialValue]);
  const update = (update) => {
    updateData({ [dataKey]: update });
  };

  const addOutput = (output) => {
    const newOutput = {
      name: output,
      socketType: "stringSocket",
      taskType: controls.data.taskType || "output",
    };

    const newOutputs = [...outputs, newOutput];
    setOutputs(newOutputs);
    update({ inputs, outputs: newOutputs });
  };

  const addInput = (input) => {
    const newInput = {
      name: input,
      socketType: "stringSocket",
      taskType: controls.data.taskType || "output",
    };

    const newInputs = [...inputs, newInput];
    setInputs(newInputs);
    update({ inputs: newInputs, outputs });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <EnkiDetails addInput={addInput} addOutput={addOutput} update={update} throughput={{inputs,outputs}} />
    </div>
  );
};

export default EnkiSelect;
