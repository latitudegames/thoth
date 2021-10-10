import { Scrollbars } from 'react-custom-scrollbars'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import css from './editorwindow.module.css'

import WindowToolbar from '../../../common/Window/WindowToolbar'
import { SimpleAccordion } from '../../../common/Accordion'
import Input from '../../../common/Input/Input'
import Panel from '../../../common/Panel/Panel'
import { useModal } from '../../../../contexts/ModalProvider'

import {
  useGetDeploymentsQuery,
  selectSpellById,
  useDeploySpellMutation,
} from '../../../../state/spells'

const DeploymentView = ({ open, setOpen, spellId }) => {
  const { openModal, closeModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const [deploySpell] = useDeploySpellMutation()
  const spell = useSelector(state => selectSpellById(state, spellId))
  const name = spell?.name as string
  const { data: deployments, isLoading } = useGetDeploymentsQuery(name, {
    skip: !spell?.name,
  })

  const deploy = message => {
    if (!spell) return
    deploySpell({ spellId: spell.name, message })
    enqueueSnackbar('Spell deployed', { variant: 'success' })
  }

  const buildUrl = version => {
    return encodeURI(
      `${process.env.REACT_APP_API_URL}/games/spells/${spellId}/${version}`
    )
  }

  const copy = url => {
    const el = document.createElement('textarea')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    enqueueSnackbar('Url copied')
  }

  return (
    <div className={`${css['deploy-shield']} ${css[!open ? 'inactive' : '']}`}>
      <div
        className={`${css['deploy-window']} ${css[!open ? 'inactive' : '']}`}
      >
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
              className="primary"
              onClick={() => {
                openModal({
                  modal: 'deployModal',
                  title: 'Deploy',
                  options: {
                    // todo find better way to get next version here
                    version:
                      '0.0.' + (deployments ? deployments?.length + 1 : 0),
                  },
                  onClose: notes => {
                    closeModal()
                    deploy(notes)
                  },
                })
              }}
            >
              Deploy new
            </button>
          </WindowToolbar>
        </div>
        <Scrollbars>
          {isLoading || !deployments || deployments.length === 0 ? (
            <p className={css['message']}>
              No previous deployments. <br /> Press "Deploy new" to create a new
              deployment.
            </p>
          ) : (
            <>
              {deployments.map(deploy => {
                return (
                  <SimpleAccordion
                    key={deploy.version}
                    heading={deploy.version}
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
                        <Input
                          style={{ flex: 1 }}
                          value={buildUrl(deploy.version)}
                          readOnly
                        />
                        <button onClick={() => copy(buildUrl(deploy.version))}>
                          copy
                        </button>
                      </div>
                      <p> Change notes </p>
                      <Panel
                        style={{
                          sbackgroundColor: 'var(--dark-1)',
                          border: '1px solid var(--dark-3)',
                        }}
                      >
                        {deploy.message}
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
