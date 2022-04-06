import { activeTabSelector, Tab } from '@/state/tabs'
import React, { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../contexts/ModalProvider'
import { usePubSub } from '../../contexts/PubSubProvider'
import css from './menuBar.module.css'
import thothlogo from './thoth.png'


const MenuBar = () => {
  const navigate = useNavigate()
  const { publish, events } = usePubSub()
  const activeTab = useSelector(activeTabSelector)

  const { openModal } = useModal()

  const activeTabRef = useRef<Tab | null>(null)

  useEffect(() => {
    if (!activeTab) return
    activeTabRef.current = activeTab
    console.log('changing current to ', activeTabRef.current)
  }, [activeTab])

  // grab all events we need
  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_ENT_MANAGER,
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
    return [value, toggle as () => void]
  }
  const [menuVisibility, togglemenuVisibility] = useToggle()

  const onSave = () => {
    if (!activeTabRef.current) return
    publish($SAVE_SPELL(activeTabRef.current.id))
  }

  const onSaveAs = () => {
    openModal({
      modal: 'saveAsModal',
      tab: activeTabRef.current,
    })
  }

  const onEdit = () => {
    if (!activeTabRef.current) return
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
    if (!activeTabRef.current) return
    publish($SERIALIZE(activeTabRef.current.id))
  }

  const onStateManagerCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_STATE_MANAGER(activeTabRef.current.id))
  }

  const onCreateSearchCorpus = () => {
    publish($CREATE_SEARCH_CORPUS(activeTabRef.current?.id))
  }

  const onEntityManagerCreate = () => {
    publish($CREATE_ENT_MANAGER(activeTabRef.current?.id))
  }

  const onPlaytestCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_PLAYTEST(activeTabRef.current.id))
  }

  const onInspectorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_INSPECTOR(activeTabRef.current.id))
  }

  const onTextEditorCreate = () => {
    if (!activeTabRef.current) return
    publish($CREATE_TEXT_EDITOR(activeTabRef.current.id))
  }

  const onExport = () => {
    if (!activeTabRef.current) return
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
    { enableOnTags: ['INPUT'] },
    [onSave]
  )

  useHotkeys(
    'option+n, crtl+n',
    event => {
      event.preventDefault()
      onNew()
    },
    { enableOnTags: ['INPUT'] },
    [onNew]
  )

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
            ent_manager: {
              onClick: onEntityManagerCreate,
            },
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
    let children
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
        {children || null}
      </li>
    )
  }

  const handleClick = func => {
    //Initially intended to control the visibility with a state, but this triggers a re-render and hides the menu anyway! :D
    //Keeping this intact just in case.
    ; (togglemenuVisibility as Function)(menuVisibility)
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
