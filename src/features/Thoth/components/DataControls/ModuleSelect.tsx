import Select from "../../../common/Select/Select";
import { useModule } from "../../../../contexts/ModuleProvider";

const ModuleSelect = () => {
  const { modules, newModule } = useModule();

  const optionArray = () => {
    return modules.map((module, index) => ({
      value: module.name,
      label: module.name,
    }));
  };

  const onChange = (value) => {
    console.log("on change", value);
  };

  const onCreateOption = (value) => {
    console.log("on create option", value);
  };

  const noOptionsMessage = (inputValue) => {
    return <span>Start typing to create a module</span>;
  };

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    return inputValue.length !== 0 && selectOptions.length === 0;
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
