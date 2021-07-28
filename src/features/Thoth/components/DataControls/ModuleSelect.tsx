import { useSnackbar } from "notistack";

import Select from "../../../common/Select/Select";
import { useModule } from "../../../../contexts/ModuleProvider";
import { useTabManager } from "../../../../contexts/TabManagerProvider";

const ModuleSelect = ({ control, updateData, initialValue }) => {
  const { modules, newModule, findOneModule } = useModule();
  const { openTab } = useTabManager();
  const { enqueueSnackbar } = useSnackbar();
  const { dataKey } = control;

  const optionArray = () => {
    return modules.map((module, index) => ({
      value: module.name,
      label: module.name,
    }));
  };

  const onChange = async ({ value }) => {
    const _module = await findOneModule({ name: value });
    if (!_module) {
      enqueueSnackbar("No module found", {
        variant: "error",
      });
      return;
    }
    update(value);

    const module = _module.toJSON();

    await openTab({
      name: value,
      type: "module",
      moduleId: module.id,
    });
  };

  const update = (update) => {
    updateData({ [dataKey]: update });
  };

  const onCreateOption = async (value) => {
    try {
      const module = await newModule({ name: value });
      await openTab({
        name: value,
        type: "module",
        moduleId: module.id,
      });

      // todo better naming for rete modules.
      // Handle displaying name as using ID for internal mapping
      update(value);

      // add data to node
      //
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
    return (
      inputValue.length !== 0 &&
      selectOptions.some((option) => option.value !== inputValue)
    );
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
        defaultInputValue={initialValue}
        onCreateOption={onCreateOption}
        placeholder="select module"
      />
    </div>
  );
};

export default ModuleSelect;
