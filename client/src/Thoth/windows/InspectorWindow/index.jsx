import { useEffect, useState } from 'react'

import { useLayout } from '@/Thoth/contexts/LayoutProvider'
import { useModal } from '@/contexts/ModalProvider'
import Icon, { componentCategories } from '@/components/Icon/Icon'
import Window from '@/components/Window/Window'
import DataControls from './DataControls'
import WindowMessage from '@/Thoth/components/WindowMessage'

const Inspector = props => {
  const { inspectorData, saveInspector } = useLayout()
  const [width, setWidth] = useState()
  const { openModal } = useModal()

  useEffect(() => {
    if (props?.node?._rect?.width) {
      setWidth(props.node._rect.width)
    }

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener('resize', data => {
      setTimeout(() => {
        setWidth(data.rect.width)
      }, 0)
    })

    return () => {
      props.node.removeEventListener('resize')
    }
  }, [props])

  const updateControl = control => {
    const newData = {
      ...inspectorData,
      dataControls: {
        ...inspectorData.dataControls,
        ...control,
      },
    }

    saveInspector(newData)
  }

  const updateData = update => {
    const newData = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...update,
      },
    }

    saveInspector(newData)
  }

  const toolbar = (
    <>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Icon
          name={componentCategories[inspectorData?.category]}
          style={{ marginRight: 'var(--extraSmall)' }}
        />
        {inspectorData?.name}
      </div>
      {/* I would like to make an "icon button" for this instead of "Help." Leaving it as help just for the function for now.*/}
      {inspectorData?.info && (
        <button
          onClick={() =>
            openModal({
              modal: 'infoModal',
              content: inspectorData?.info,
              title: inspectorData?.name,
            })
          }
        >
          Help
        </button>
      )}
    </>
  )

  if (!inspectorData) return <WindowMessage />

  return (
    <Window toolbar={toolbar} darker outline borderless>
      {inspectorData.deprecated && (
        <div style={{ padding: 'var(--c1) var(--c2)' }}>
          <h2 style={{ color: 'var(--red)' }}>WARNING</h2>
          <p>{inspectorData.deprecationMessage}</p>
        </div>
      )}
      <DataControls
        inspectorData={inspectorData}
        nodeId={inspectorData.nodeId}
        dataControls={inspectorData.dataControls}
        data={inspectorData.data}
        width={width}
        updateData={updateData}
        updateControl={updateControl}
      />
    </Window>
  )
}

export default Inspector
