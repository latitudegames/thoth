import { SimpleAccordion } from '../../../../common/Accordion'
import CodeControl from './CodeControl'
import css from './datacontrols.module.css'
import EnkiSelect from './EnkiSelect'
import Info from './Info'
import Input from './Input'
import InputGenerator from './InputGenerator'
import LongText from './LongTextControl'
import ModuleSelect from './ModuleSelect'
import OutputGenerator from './OutputGenerator'
import SocketGenerator from './SocketGenerator'
import PlaytestControl from './PlaytestControl'
import SwitchControl from './SwitchControl'

const StubComponent = props => <div>{props.name}</div>

const controlMap = {
  code: CodeControl,
  dial: StubComponent,
  enkiSelect: EnkiSelect,
  info: Info,
  input: Input,
  inputGenerator: InputGenerator,
  longText: LongText,
  moduleSelect: ModuleSelect,
  outputGenerator: OutputGenerator,
  slider: StubComponent,
  socketGenerator: SocketGenerator,
  playtest: PlaytestControl,
  switch: SwitchControl,
}

const DataControls = ({
  dataControls,
  updateData,
  updateControl,
  width,
  data,
  inspectorData,
  nodeId,
}) => {
  if (!dataControls)
    return <p className={css['message']}>No component selected</p>
  if (Object.keys(dataControls).length < 1)
    return (
      <p className={css['message']}>
        Selected component has nothing to inspect
      </p>
    )

  return (
    <>
      {Object.entries(dataControls).map(([key, control]) => {
        // Default props to pass through to every data control
        const controlProps = {
          nodeId,
          width,
          control,
          name: inspectorData.name,
          initialValue: data[control.dataKey] || '',
          updateData,
        }

        const Component = controlMap[control.component]

        if (!Component) return null

        const setExpanded = state => {
          control.expanded = state
          updateControl({ [control.dataKey]: control })
        }

        if (control.component === 'info' && !control?.data?.info) return null

        return (
          <SimpleAccordion
            heading={control.name || key}
            defaultExpanded={true}
            expanded={control.expanded}
            setExpanded={setExpanded}
            key={key}
            icon={control.icon}
          >
            <Component {...controlProps} />
          </SimpleAccordion>
        )
      })}
    </>
  )
}

export default DataControls
