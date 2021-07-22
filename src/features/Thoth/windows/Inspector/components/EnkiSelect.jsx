import { useState, useEffect } from "react";
import { getEnkiPrompt, getEnkis } from "../../../../../services/game-api/enki";

import Select from "../../../../common/Select/Select";
import Chip from "../../../../common/Chip/Chip";

const EnkiDetails = ({ initialTask, addThroughput, update }) => {
  const [activeEnki, selectEnki] = useState(initialTask);
  const [taskList, updateTaskList] = useState(undefined);
  const activeTask = activeEnki?.taskName;

  const processThroughput = (taskName, enkiData) => {
    const throughput = {
      inputsToAdd: [],
      outputsToAdd: [],
      activeTask: {
        taskName,
        ...enkiData,
      },
    };

    enkiData.data[0].inputs.forEach((_input, index) => {
      throughput.inputsToAdd.push(`input${index + 1}`);
    });
    enkiData.data[0].outputs.forEach((_output, index) => {
      throughput.outputsToAdd.push(`output${index + 1}`);
    });
    selectEnki({
      taskName,
      ...enkiData,
    });
    addThroughput(throughput);
  };

  const listChange = async (event) => {
    const taskName = event.value;
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

  const optionArray = () => {
    let array = [];
    taskList.map((task, index) => {
      return array.push({ value: task.name, label: task.name });
    });

    return array;
  };

  return (
    <>
      {taskList?.length > 0 && !activeTask && (
        <Select
          searchable
          options={optionArray()}
          onChange={listChange}
          placeholder={"search enkis..."}
        />
      )}
      {!taskList && <Chip noEvents label={"loading..."} />}
      {/* {activeTask && (
        <div style={{ flex: 1, display: "flex" }}>
          {activeEnki.serialization.introduction}
        </div>
      )} */}
      {activeTask && <Chip label={activeTask} onClick={clearEnki} />}
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

  const addThroughput = ({ inputsToAdd, outputsToAdd, activeTask }) => {
    const throughput = {
      inputs: [
        {
          name: "data",
          socketType: "triggerSocket",
          taskType: "option",
        },
      ],
      outputs: [
        {
          name: "data",
          socketType: "triggerSocket",
          taskType: "option",
        },
      ],
      activeTask,
    };
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

    console.log("thoughputs", throughput);
    update(throughput);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <EnkiDetails
        addThroughput={addThroughput}
        update={update}
        throughput={{ inputs, outputs }}
        initialTask={initialValue.activeTask}
      />
    </div>
  );
};

export default EnkiSelect;
