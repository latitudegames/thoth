import { useEffect, useRef } from "react";
import { useLayout } from "../../contexts/LayoutProvider";
import { useRete } from "../../contexts/ReteProvider";
import { useSpell } from "../../contexts/SpellProvider";

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout();
  const { serialize } = useRete();
  const { saveCurrentSpell } = useSpell();

  const { events, subscribe } = pubSub;

  const {
    $SAVE_SPELL,
    $CREATE_STATE_MANAGER,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
  } = events;

  const saveSpell = async () => {
    const graph = serialize();
    await saveCurrentSpell({ graph });
  };

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, "State Manager");
  };

  const createPlaytest = () => {
    createOrFocus(windowTypes.PLAYTEST, "Playtest");
  };

  const createInspector = () => {
    createOrFocus(windowTypes.INSPECTOR, "Inspector");
  };

  const createTextEditor = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, "Text Editor");
  };

  const onSerialize = () => {
    console.log(serialize());
  };

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_STATE_MANAGER(tab.id)]: createStateManager,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$SERIALIZE(tab.id)]: onSerialize,
    [$EXPORT(tab.id)]: () => {},
  };

  useEffect(() => {
    if (!tab) return;

    const subscriptions = Object.entries(handlerMap).map(([event, handler]) => {
      return subscribe(event, handler);
    });

    // unsubscribe from all subscriptions on unmount
    return () => {
      subscriptions.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [tab]);

  return null;
};

export default EventHandler;
