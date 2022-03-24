import { usePubSub } from '@/contexts/PubSubProvider'
import { InspectorData } from '@latitudegames/thoth-core/types'
import { createContext, useContext, useEffect, useState } from 'react'

type InspectorContext = {}

const Context = createContext<InspectorContext>(undefined!)

export const useInspector = () => useContext(Context)

const InspectorProvider = ({ children, tab }) => {
  const { subscribe, publish, events } = usePubSub()

  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null)

  // inspector subscription
  useEffect(() => {
    return subscribe(
      events.$INSPECTOR_SET(tab.id),
      (event, data: InspectorData) => {
        if (data?.nodeId !== inspectorData?.nodeId) setInspectorData(null)
        setInspectorData(data)

        if (!data.dataControls) return

        // Handle components in a special way here.  Could probaby abstract this better

        Object.entries(data.dataControls).forEach(([, control]) => {
          if (control?.options?.editor) {
            // we relay data to the text editor component for display here as well.
            // const textData = {
            //   data: data.data[control.dataKey],
            //   nodeId: data.nodeId,
            //   name: data.name,
            //   control: control,
            //   options: control.options,
            // }
            // setTextEditorData(textData)
          }
        })
      }
    )
  }, [events, subscribe, publish])

  const publicInterface: InspectorContext = {}

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default InspectorProvider
