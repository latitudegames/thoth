import { useSnackbar } from "notistack";

import Select from "../../../common/Select/Select";
import { useModule } from "../../../../contexts/ModuleProvider";
import { useTabManager } from "../../../../contexts/TabManagerProvider";

const ModuleSelect = () => {
  const { modules, newModule } = useModule();
  const { openTab } = useTabManager();
  const { enqueueSnackbar } = useSnackbar();

  const optionArray = () => {
    return modules.map((module, index) => ({
      value: module.name,
      label: module.name,
    }));
  };

  const onChange = (value) => {
    // change values here for pre-existing modules.
    // This would be an "updat data" situation
    console.log("on change", value);
  };

  const onCreateOption = async (value) => {
    try {
      const module = await newModule({ name: value });
      await openTab({
        name: value,
        type: "module",
        moduleId: module.id,
      });
    } catch (err) {
      console.log("Error creating module", err);
      enqueueSnackbar("Error creating module", {
        variant: "error",
      });
    }
  };

  const noOptionsMessage = (inputValue) => {
    return <span>Start typing to create a module</span>;
  };

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return inputValue.length !== 0;
  };

  return (
    <div style={{ flex: 1 }}>
      <Select
        searchable
        creatable
        createOptionPosition="top"
        isValidNewOption={isValidNewOption}
        noOptionsMessage={noOptionsMessage}
        options={optionArray()}
        onChange={onChange}
        onCreateOption={onCreateOption}
        placeholder="search modules"
      />
    </div>
  );
};

export default ModuleSelect;
