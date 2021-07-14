import React from "react";

import { useRete } from "../../../contexts/Rete";
import { useSpell } from "../../../contexts/Spell";

import css from "./menuBar.module.css";
import thothlogo from "./thoth.png";

const MenuBar = ({ tabs }) => {
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

  return (
    <div className={css['menu-bar']}>
        <img className={css["thoth-logo"]} alt="Thoth logo" src={thothlogo} />
        {Object.keys(menuBarItems).map((item, index) => {
          return <div className={css['menu-bar-item']}> {item} </div>
        })}
    </div>
  );
};

export default MenuBar;
