import React from "react";

import { useRete } from "../../../contexts/Rete";
import { useSpell } from "../../../contexts/Spell";

import css from "./menuBar.module.css";
import thothlogo from "./thoth.png";

const MenuBar = ({ tabs }) => {

  //Menu bar functions

  const { serialize } = useRete();
  const { saveCurrentSpell } = useSpell();

  const onSave = () => {
    const serialized = serialize();
    saveCurrentSpell({ graph: serialized });
  };

  const onSerialize = () => {
    const serialized = serialize();
    console.log(JSON.stringify(serialized));
  };


  //Menu bar entries


  const menuBarItems = {
    save: {
      onClick: onSave
    },
    load: {},
    export: {
      onClick: onSerialize,
    },
    studio: {
      items: {
        text_editor: {
          onClick: null
        },
        state_manager: {
          onClick: null
        },
        playtest: {
          onClick: null
        },
        inspector: {
          onClick: null
        },
        enki: {
          items: {
            serialization: {
              onClick: null
            },
            preamble: {
              onClick: null
            },
            fewshot_data: {
              onClick: null
            },
          }
        }
      }
    }
  }

  //Menu bar rendering

  const ListItem = ({ item, label }) => {
    // console.log(Object.keys(item.items)[index])
    let children = null;
    if (item.items && Object.keys(item.items)) {
      children = (
        <ul>
          {Object.keys(item.items).map((i, x) => {
            return <ListItem item={item?.items[i]} label={Object.keys(item.items)[x]}/>
          })}
        </ul>
      );
    }

    return (
      <li>
        {label && label}
        {children}
      </li>
    );
  }

  return (
    <ul className={css['menu-bar']}>
        <img className={css["thoth-logo"]} alt="Thoth logo" src={thothlogo} />
          {
            Object.keys(menuBarItems).map((item, index) => <ListItem item={menuBarItems[item]} label={Object.keys(menuBarItems)[index]}/>)
          }
    </ul>
  );
};

export default MenuBar;
