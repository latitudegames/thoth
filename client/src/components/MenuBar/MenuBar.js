import React, { useState, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import { useTabManager } from '../../contexts/TabManagerProvider'
import css from './menuBar.module.css'
import thothlogo from './thoth.png'
import { useNavigate, useLocation } from 'react-router-dom'

const MenuBar = () => {
  const navigate = useNavigate()
  const { publish, events } = usePubSub()
  const { activeTab } = useTabManager()
  const { openModal } = useModal()

  const activeTabRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    activeTabRef.current = activeTab
    console.log('changing current to ', activeTabRef.current)
  }, [activeTab])

  // grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_AGENT_MANAGER,
    $CREATE_ENT_MANAGER,
    $CREATE_CONFIG_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_SEARCH_CORPUS,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
  } = events

  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue)
    const toggle = React.useCallback(() => {
      setValue(v => !v)
    }, [])
    return [value, toggle]
  }
  const [menuVisibility, togglemenuVisibility] = useToggle()

  const onSave = () => {
    publish($SAVE_SPELL(activeTabRef.current.id))
  }

  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    })
  }

  const onEdit = () => {
    openModal({
      modal: 'editSpellModal',
      content: 'This is an example modal',
      tab: activeTabRef.current,
      spellId: activeTabRef.current.spell,
      name: activeTabRef.current.spell,
    })
  }

  const onNew = () => {
    navigate('/home/create-new')
  }
  const onOpen = () => {
    navigate('/home/all-projects')
  }

  const onSerialize = () => {
    publish($SERIALIZE(activeTabRef.current.id))
  }

  const onStateManagerCreate = () => {
    publish($CREATE_STATE_MANAGER(activeTabRef.current.id))
  }

  const onCreateSearchCorpus = () => {
    publish($CREATE_SEARCH_CORPUS(activeTabRef.current.id))
  }

  const onAgentManagerCreate = () => {
    publish($CREATE_AGENT_MANAGER(activeTabRef.current.id))
  }

  const onEntityManagerCreate = () => {
    publish($CREATE_ENT_MANAGER(activeTabRef.current.id))
  }

  const onPlaytestCreate = () => {
    publish($CREATE_PLAYTEST(activeTabRef.current.id))
  }

  const onInspectorCreate = () => {
    publish($CREATE_INSPECTOR(activeTabRef.current.id))
  }

  const onTextEditorCreate = () => {
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id))
  }

  const onExport = () => {
    publish($EXPORT(activeTabRef.current.id))
  }

  const onModal = () => {
    openModal({ modal: 'example', content: 'This is an example modal' })
  }

  //Menu bar hotkeys
  useHotkeys(
    'cmd+s, crtl+s',
    event => {
      event.preventDefault()
      onSave()
    },
    { enableOnTags: 'INPUT' },
    [onSave]
  )

  useHotkeys(
    'option+n, crtl+n',
    event => {
      event.preventDefault()
      onNew()
    },
    { enableOnTags: 'INPUT' },
    [onNew]
  )

  const agentMenuItems =
    process.env.REACT_APP_USE_AGENTS === 'true'
      ? {
        agent_manager: {
          onClick: onAgentManagerCreate,
        },
        ent_manager: {
          onClick: onEntityManagerCreate,
        }
      }
      : {}

  //Menu bar entries
  const menuBarItems = {
    file: {
      items: {
        new_project: {
          onClick: onNew,
        },
        open_project: {
          onClick: onOpen,
        },
        edit_project: {
          onClick: onEdit,
        },
        save: {
          items: {
            save_project: {
              onClick: onSave,
            },
            save_project_as: {
              onClick: onSaveAs,
            },
            export_project: {
              onClick: onExport,
            },
          },
        },
      },
    },
    edit: {
      items: {
        undo: {},
        redo: {},
        copy: {},
        paste: {},
      },
    },
    dev: {
      items: {
        serialize: {
          onClick: onSerialize,
        },
      },
    },
    studio: {
      items: {
        tools: {
          items: {
            text_editor: {
              onClick: onTextEditorCreate,
            },
            inspector: {
              onClick: onInspectorCreate,
            },
            state_manager: {
              onClick: onStateManagerCreate,
            },
            search_corpus: {
              onClick: onCreateSearchCorpus,
            },
            ...agentMenuItems,
            playtest: {
              onClick: onPlaytestCreate,
            },
            enki: {
              items: {
                fewshots: {},
                serialization: {},
                preamble: {},
              },
            },
            test: {
              items: {
                'open modal ...': {
                  onClick: onModal,
                },
              },
            },
          },
        },
        change_layout: {
          items: {
            multishot_editing: {},
            enki_fewshot_editing: {},
            node_editing: {},
          },
        },
      },
    },
  }

  //Menu bar rendering
  const ListItem = ({ item, label, topLevel, onClick }) => {
    label = label ? label.replace(/_/g, ' ') : label
    let children = null
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css['menu-panel']}>
          {Object.keys(item.items).map((i, x) => {
            return (
              <ListItem
                item={item?.items[i]}
                label={Object.keys(item.items)[x]}
                topLevel={false}
                key={x}
                onClick={item?.items[i].onClick}
              />
            )
          })}
        </ul>
      )
    }

    return (
      <li
        className={`${css[topLevel ? 'menu-bar-item' : 'list-item']}`}
        onClick={onClick}
      >
        {label}
        {children && <div className={css['folder-arrow']}> ❯ </div>}
        {!topLevel && <br />}
        {children}
      </li>
    )
  }

  const handleClick = func => {
    //Initially intended to control the visibility with a state, but this triggers a re-render and hides the menu anyway! :D
    //Keeping this intact just in case.
    togglemenuVisibility(menuVisibility)
    // eslint-disable-next-line no-eval
    eval(func)
  }

  return (
    <ul className={css['menu-bar']}>
      <img className={css['thoth-logo']} alt="Thoth logo" src={thothlogo} />
      {Object.keys(menuBarItems).map((item, index) => (
        <ListItem
          item={menuBarItems[item]}
          label={Object.keys(menuBarItems)[index]}
          topLevel={true}
          key={index}
          onClick={() => {
            handleClick(menuBarItems[item].onClick)
          }}
        />
      ))}
    </ul>
  )
}

export default MenuBar
