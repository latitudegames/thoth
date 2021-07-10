import { SimpleAccordion } from "../../../../common/Accordion";

// const Textarea = (props) => {
//   const [value, setValue] = useState();

//   useEffect(() => {
//     setValue(props.initialValue);
//   }, [props.initialValue]);

//   const onChange = (e) => {
//     const update = {
//       [props.name]: e.target.value,
//     };
//     setValue(e.target.value);
//     props.updateData(update);
//   };

//   return (
//     <div></div>
//   );
// }

const StubComponent = (props) => <div>{props.name}</div>;

// const LongText = props => {
//   return (

//   )
// }

const controlMap = {
  longText: StubComponent,
  input: StubComponent,
  slider: StubComponent,
  dial: StubComponent,
};

const DataControls = ({ dataControls, updateData, width, data, ...props }) => {
  if (!dataControls) return <p>Select a component.</p>;

  return (
    <>
      {Object.entries(dataControls).map(([key, value]) => {
        // Default props to pass through to every data control
        const controlProps = {
          width,
          key,
          name: key,
          initialValue: data[key] || "",
          updateData,
        };

        const Component = controlMap[value.component] || StubComponent;

        return (
          <SimpleAccordion heading={key} key={key}>
            <Component {...controlProps} />
          </SimpleAccordion>
        );
      })}
    </>
  );
};

export default DataControls;
