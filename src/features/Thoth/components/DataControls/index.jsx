import { SimpleAccordion } from "../../../common/Accordion";
import LongText from "./LongTextControl";
import Input from "./Input";
import OutputGenerator from "./OutputGenerator";
import InputGenerator from "./InputGenerator";
import EnkiSelect from "./EnkiSelect";
import css from "./datacontrols.module.css";
import CodeControl from "./CodeControl";

const StubComponent = (props) => <div>{props.name}</div>;

const controlMap = {
  enkiSelect: EnkiSelect,
  outputGenerator: OutputGenerator,
  inputGenerator: InputGenerator,
  longText: LongText,
  input: Input,
  slider: StubComponent,
  dial: StubComponent,
  code: CodeControl,
};

const DataControls = ({
  dataControls,
  updateData,
  width,
  data,
  inspectorData,
  nodeId,
  ...props
}) => {
  const icons = {
    "Data Inputs": "properties",
    "Data Outputs": "properties",
    Fewshot: "fewshot",
    Stop: "stop-sign",
    Temperature: "temperature",
    "Max Tokens": "moon",
  };

  if (!dataControls)
    return <p className={css["message"]}>No component selected</p>;
  if (Object.keys(dataControls).length < 1)
    return (
      <p className={css["message"]}>
        Selected component has nothing to inspect
      </p>
    );

  return (
    <>
      {Object.entries(dataControls).map(([key, control]) => {
        // Default props to pass through to every data control
        const controlProps = {
          nodeId,
          width,
          control,
          controls: dataControls,
          name: inspectorData.name,
          initialValue: data[control.dataKey] || "",
          updateData,
        };

        const Component =
          controlMap[control.controls.component] || StubComponent;

        return (
          <SimpleAccordion
            heading={control.name || key}
            key={key}
            icon={icons[control.name]}
          >
            <Component {...controlProps} />
          </SimpleAccordion>
        );
      })}
    </>
  );
};

export default DataControls;
