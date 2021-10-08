import { useState } from 'react'
import WindowToolbar from '../../../common/Window/WindowToolbar'
import { SimpleAccordion } from '../../../common/Accordion'
import { Scrollbars } from 'react-custom-scrollbars'
import Icon from '../../../common/Icon/Icon'
import css from './editorwindow.module.css'
import { useModal } from '../../../../contexts/ModalProvider'
import Input from '../../../common/Input/Input'
import Panel from '../../../common/Panel/Panel'

const DeploymentView = ({ open, setOpen }) => {
  const [list, setList] = useState({})
  const { openModal, closeModal } = useModal()
  return (
    <div className={`${css['deploy-shield']} ${css[!open && 'inactive']}`}>
      <div className={`${css['deploy-window']} ${css[!open && 'inactive']}`}>
        <div
          style={{
            backgroundColor: 'var(--dark-3)',
            padding: 'var(--c1)',
            paddingBottom: 0,
            borderBottom: '1px solid var(--dark-2)',
          }}
        >
          <WindowToolbar>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Deployments
            </div>
            <button
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </button>
            <button
              class="primary"
              onClick={() => {
                openModal({
                  modal: 'deployModal',
                  title: 'Deploy',
                  onClose: notes => {
                    closeModal()
                    setList({
                      ...{
                        version: '0.0.' + Object.keys(list).length,
                        message: notes,
                      },
                    })
                  },
                })
              }}
            >
              Deploy new
            </button>
          </WindowToolbar>
        </div>
        <Scrollbars>
          {Object.keys(list).length === 0 ? (
            <p className={css['message']}>
              No previous deployments. <br /> Press "Deploy new" to create a new
              deployment.
            </p>
          ) : (
            <>
              {Object.keys(list).map(key => {
                return (
                  <SimpleAccordion
                    heading={list[key].version}
                    defaultExpanded={true}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <p> Endpoint URL </p>
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          gap: 'var(--c1)',
                          width: '100%',
                        }}
                      >
                        <Input style={{ flex: 1 }} />
                        <button>copy</button>
                      </div>
                      <p> Change notes </p>
                      <Panel
                        style={{
                          backgroundColor: 'var(--dark-1)',
                          border: '1px solid var(--dark-3)',
                        }}
                      >
                        {list[key].message}
                      </Panel>
                    </div>
                  </SimpleAccordion>
                )
              })}
            </>
          )}
        </Scrollbars>
      </div>
    </div>
  )
}

export default DeploymentView
