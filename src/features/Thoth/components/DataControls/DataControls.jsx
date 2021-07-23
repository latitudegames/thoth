import { SimpleAccordion } from "../../../common/Accordion";
import LongText from "./LongTextControl";
import Input from "./Input";
import Info from "./Info";
import OutputGenerator from "./OutputGenerator";
import InputGenerator from "./InputGenerator";
import EnkiSelect from "./EnkiSelect";
import css from "./datacontrols.module.css";
import CodeControl from "./CodeControl";
import SocketGenerator from "./SocketGenerator";

const StubComponent = (props) => <div>{props.name}</div>;

const controlMap = {
  enkiSelect: EnkiSelect,
  socketGenerator: SocketGenerator,
  outputGenerator: OutputGenerator,
  inputGenerator: InputGenerator,
  longText: LongText,
  input: Input,
  slider: StubComponent,
  dial: StubComponent,
  code: CodeControl,
  info: Info,
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
          name: inspectorData.name,
          initialValue: data[control.dataKey] || "",
          updateData,
        };

        const Component = controlMap[control.component] || StubComponent;

        if (control.component === "info" && !control?.data?.info) return null;

        return (
          <SimpleAccordion
            heading={control.name || key}
            key={key}
            icon={control.icon}
          >
            <Component {...controlProps} />
          </SimpleAccordion>
        );
      })}
    </>
  );
};

export default DataControls;
