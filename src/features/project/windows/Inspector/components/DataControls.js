import { SimpleAccordion } from "../../../../common/Accordion";

const controlMap = {
  longText: <></>,
  input: <></>,
  slider: <></>,
  dial: <></>,
};

const isEmpty = (obj) =>
  obj && Object.keys(obj).length === 0 && obj.constructor === Object;

const DataControls = ({
  dataControls,
  updateData,
  width,
  initialValue,
  data,
  ...props
}) => {
  if (!dataControls && isEmpty(dataControls)) return <p>Loading...</p>;

  return Object.entries(dataControls).map(([key, value]) => {
    // Default props to pass through to every data control
    const controlProps = {
      width,
      key,
      name: key,
      initialValue: data.data[key] || "",
      updateData,
    };

    const Component = controlMap[value.type] || <></>;

    return (
      <SimpleAccordion>
        <Component {...controlProps} />;
      </SimpleAccordion>
    );
  });
};

export default DataControls;
