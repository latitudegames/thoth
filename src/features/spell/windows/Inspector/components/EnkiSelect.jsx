import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";
import Chip from "@material-ui/core/Chip";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const EnkiDetails = ({ addThroughput, update }) => {
  const [value, setValue] = useState("");
  const [activeEnki, selectEnki] = useState(undefined);
  const [taskList, updateTaskList] = useState(undefined);
  const activeTask = activeEnki?.taskName;
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const processThroughput = (taskName, enkiData) => {
    const throughput = { inputsToAdd: [], outputsToAdd: [] };
    enkiData.data[0].inputs.forEach((_input, index) => {
      throughput.inputsToAdd.push(`${taskName} Input ${index + 1}`);
    });
    enkiData.data[0].outputs.forEach((_output, index) => {
      throughput.outputsToAdd.push(`${taskName} Output ${index + 1}`);
    });
    selectEnki({
      taskName,
      ...enkiData,
    });
    addThroughput(throughput);
  };

  const onSearch = async () => {
    const taskName = value;
    const enkiData = await getEnkiPrompt(value);
    if (enkiData) {
      processThroughput(taskName, enkiData);
    }
    setValue("");
  };

  const listChange = async (event) => {
    const taskName = event.target.value;
    const enkiData = await getEnkiPrompt(taskName);
    if (enkiData) {
      processThroughput(taskName, enkiData);
    }
  };

  const clearEnki = async () => {
    update({ inputs: [], outputs: [] });
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

  const addThroughput = ({ inputsToAdd, outputsToAdd }) => {
    const throughput = { inputs: [], outputs: [] };
    inputsToAdd.forEach((input) => {
      const newInput = {
        name: input,
        socketType: "stringSocket",
        taskType: controls.data.taskType || "output",
      };
      throughput.inputs.push(newInput);
    });
    outputsToAdd.forEach((output) => {
      const newOutput = {
        name: output,
        socketType: "stringSocket",
        taskType: controls.data.taskType || "output",
      };
      throughput.outputs.push(newOutput);
    });
    setInputs(throughput.inputs);
    setOutputs(throughput.outputs);
    update(throughput);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <EnkiDetails
        addThroughput={addThroughput}
        update={update}
        throughput={{ inputs, outputs }}
      />
    </div>
  );
};

export default EnkiSelect;
