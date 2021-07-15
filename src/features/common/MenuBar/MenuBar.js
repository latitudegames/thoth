import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useRete } from "../../../contexts/Rete";
import { useSpell } from "../../../contexts/Spell";
import { useLayout } from "../../../contexts/Layout";

import css from "./menuBar.module.css";
import thothlogo from "./thoth.png";

const MenuBar = ({ tabs }) => {
  //Menu bar functions

  const { serialize } = useRete();
  const { saveCurrentSpell } = useSpell();
  const { componentTypes, createOrFocus } = useLayout();

  const onSave = () => {
    const serialized = serialize();
    saveCurrentSpell({ graph: serialized });
  };

  const onSerialize = () => {
    const serialized = serialize();
    console.log(JSON.stringify(serialized));
  };

  const onStateManager = () => {
    createOrFocus(componentTypes.STATE_MANAGER, "State Manager");
  };

  const onPlaytest = () => {
    createOrFocus(componentTypes.PLAYTEST, "Playtest");
  };

  const onInspector = () => {
    createOrFocus(componentTypes.INSPECTOR, "Inspector");
  };

  const onTextEditor = () => {
    createOrFocus(componentTypes.TEXT_EDITOR, "Text Editor");
  };

  //Menu bar hotkeys

  useHotkeys(
    "cmd+s, crtl+s",
    (event) => {
      event.preventDefault();
      onSave();
    },
    { enableOnTags: "INPUT" },
    [onSave]
  );

  //Menu bar entries

  const menuBarItems = {
    file: {
      items: {
        new: {
          onClick: () => {
            alert("you clicked new!");
          },
        },
        save: {
          onClick: onSave,
        },
        serialize: {
          onClick: onSerialize,
        },
        load: {
          onClick: () => {
            alert("you clicked load!");
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
    studio: {
      items: {
        tools: {
          items: {
            text_editor: {
              onClick: onTextEditor,
            },
            inspector: {
              onClick: onInspector,
            },
            state_manager: {
              onClick: onStateManager,
            },
            playtest: {
              onClick: onPlaytest,
            },
            enki: {
              items: {
                fewshots: {},
                serialization: {},
                preamble: {},
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
  };

  //Menu bar rendering

  const ListItem = ({ item, label, topLevel, onClick }) => {
    label = label.replace(/_/g, " ");
    let children = null;
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul className={css["menu-panel"]}>
          {Object.keys(item.items).map((i, x) => {
            return (
              <ListItem
                item={item?.items[i]}
                label={Object.keys(item.items)[x]}
                topLevel={false}
                key={x}
                onClick={item?.items[i].onClick}
              />
            );
          })}
        </ul>
      );
    }

    return (
      <li
        className={`${css[topLevel ? "menu-bar-item" : "list-item"]}`}
        onClick={onClick}
      >
        {label}
        {children && <div className={css["folder-arrow"]}> ❯ </div>}
        {!topLevel && <br />}
        {children}
      </li>
    );
  };

  return (
    <ul className={css["menu-bar"]}>
      <img className={css["thoth-logo"]} alt="Thoth logo" src={thothlogo} />
      {Object.keys(menuBarItems).map((item, index) => (
        <ListItem
          item={menuBarItems[item]}
          label={Object.keys(menuBarItems)[index]}
          topLevel={true}
          key={index}
          onClick={menuBarItems[item].onClick}
        />
      ))}
    </ul>
  );
};

export default MenuBar;
