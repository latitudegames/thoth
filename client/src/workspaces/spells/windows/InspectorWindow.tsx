import { useEffect, useState } from 'react'

import { useModal } from '@/contexts/ModalProvider'
import Icon, { componentCategories } from '../../../components/Icon/Icon'
import Window from '../../../components/Window/Window'
import DataControls from '../DataControls'
import WindowMessage from '../components/WindowMessage'
import { useInspector } from '@/workspaces/contexts/InspectorProvider'
import { InspectorData } from '@latitudegames/thoth-core/types'
import SwitchComponent from '@/components/Switch/Switch'
import css from '../../../components/Icon/icon.module.css'

const Inspector = props => {
  const { inspectorData, saveInspector } = useInspector()
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
    if (!inspectorData) return
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
    if (!inspectorData) return
    const newData = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...update,
      },
    }

    saveInspector(newData)
  }

  const onLock = () => {
    const data = {
      nodeLocked: !inspectorData?.data.nodeLocked,
    }

    updateData(data)
  }

  const toolbar = (
    <>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Icon
          name={componentCategories[inspectorData?.category || 0]}
          style={{ marginRight: 'var(--extraSmall)' }}
        />
        {inspectorData?.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>Node Lock</div>
      <SwitchComponent
        label={inspectorData?.data.nodeLocked ? 'Locked' : 'Unlocked'}
        checked={inspectorData?.data.nodeLocked ? true : false}
        onChange={onLock}
      />
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

  const DeprecationMessage = (inspectorData: InspectorData) => {
    if (!inspectorData.deprecated) return <></>
    return (
      <div style={{ padding: 'var(--c1) var(--c2)' }}>
        <h2 style={{ color: 'var(--red)' }}>WARNING</h2>
        <p>{inspectorData.deprecationMessage}</p>
      </div>
    )
  }

  const LockedOverlay = ({ isLocked }) => {
    return (
      <>
        {isLocked && (
          <>
            <div
              style={{
                backgroundColor: 'var(--dark-1)',
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 10,
                opacity: '0.7',
              }}
            />
            <div
              className={`${css['node-lock']} ${css['icon']}`}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: 1,
                zIndex: 11,
                backgroundPosition: '0 18vh',
              }}
            />
          </>
        )}
      </>
    )
  }

  if (!inspectorData) return <WindowMessage />

  return (
    <Window toolbar={toolbar} darker outline borderless>
      {DeprecationMessage(inspectorData)}
      <LockedOverlay isLocked={inspectorData?.data.nodeLocked} />
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
