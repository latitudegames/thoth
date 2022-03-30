import { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
// import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'

import css from './editorwindow.module.css'

import WindowToolbar from '@/components/Window/WindowToolbar'
import { SimpleAccordion } from '@/components/Accordion'
import Input from '@/components/Input/Input'
import Panel from '@/components/Panel/Panel'
import { useModal } from '@/contexts/ModalProvider'

import {
  useGetDeploymentsQuery,
  // selectSpellById,
  useDeploySpellMutation,
  useLazyGetDeploymentQuery,
  // useSaveSpellMutation,
} from '@/state/api/spells'
import { useEditor } from '@thoth/contexts/EditorProvider'
import { thothApiRootUrl } from '@/config'

const DeploymentView = ({ open, setOpen, spellId, close }) => {
  const [loadingVersion, setLoadingVersion] = useState(false)
  const { loadChain } = useEditor()
  const { openModal, closeModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const [deploySpell] = useDeploySpellMutation()
  // const [saveSpell] = useSaveSpellMutation()
  const [getDeplopyment, { data: deploymentData }] = useLazyGetDeploymentQuery()
  // const spell = useSelector(state => selectSpellById(spellId))
  const spell = spellId
  const { data: deployments, isLoading } = useGetDeploymentsQuery(spellId, {
    skip: !spell,
  })

  const deploy = data => {
    console.log(spell, data, 'data')
    if (!spell) return
    console.log("Version is", data.version)
    deploySpell({ spellId: spell, version: data.version, ...data })
    enqueueSnackbar('Spell deployed', { variant: 'success' })
  }

  const buildUrl = version => {
    return encodeURI(
      `${thothApiRootUrl}/game/spells/deployed/${spellId}/${version}`
    )
  }

  const loadVersion = async version => {
    // todo better confirmation popup
    if (
      confirm(
        'Are you sure you want to load this version? Any changes you have made since your most recent deploy will be lost.'
      )
    ) {
      setLoadingVersion(true)
      await getDeplopyment({
        spellId: spell as string,
        version,
      })
    }
  }

  useEffect(() => {
    if (!deploymentData || !loadingVersion) return
      ; (async () => {
        close()
        // await saveSpell({ ...spell, chain: deploymentData.chain })
        enqueueSnackbar(`version ${deploymentData.version} loaded!`, {
          variant: 'success',
        })
        setLoadingVersion(false)
        loadChain(deploymentData.chain)
      })()
  }, [deploymentData, loadingVersion])

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
                const v = deployments ? deployments?.length + 1 : 0;
                openModal({
                  modal: 'deployModal',
                  title: 'Deploy',
                  options: {
                    // todo find better way to get next version here
                    version: v,
                  },
                  onClose: data => {
                    data.version = v
                    closeModal()
                    deploy(data)
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
                    heading={`${deploy.version}${deploy.versionName ? ' - ' + deploy.versionName : ''
                      }`}
                    defaultExpanded={true}
                  >
                    <button
                      className={css['load-button'] + ' extra-small'}
                      onClick={() => {
                        loadVersion(deploy.version)
                      }}
                    >
                      Load
                    </button>
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
