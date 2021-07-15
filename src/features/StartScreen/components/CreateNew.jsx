import { useState } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
} from "unique-names-generator";

import css from "../startScreen.module.css";
import Panel from "../../common/Panel/Panel";
import TemplatePanel from "./TemplatePanel";

import enkiImg from "../enki.png";
import emptyImg from "../empty.png";
import langImg from "../lang.png";
import { useSpell } from "../../../contexts/Spell/index";
import { useTabManager } from "../../../contexts/TabManager";

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: " ",
  length: 2,
};

const templates = [
  { label: "Empty", bg: emptyImg },
  { label: "Language example", bg: langImg },
  { label: "Enki example", bg: enkiImg },
];

const CreateNew = ({ setNewVisible }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { newSpell } = useSpell();
  const { openTab } = useTabManager();

  const onCreate = async () => {
    const placeholderName = uniqueNamesGenerator(customConfig);
    const spell = await newSpell({ graph: {}, name: placeholderName });
    const tab = await openTab({ name: spell.name, spellId: spell.name });

    console.log("Spell", spell);
    console.log("tab", tab);
    console.log("create", selectedTemplate);
  };

  return (
    <Panel shadow flexColumn>
      <h1> Create New </h1>
      <div
        style={{
          width: "var(--c62)",
          backgroundColor: "var(--dark-2)",
          display: "flex",
          flexDirection: "row",
          gap: "var(--extraSmall)",
        }}
      >
        {templates.map((template, i) => (
          <TemplatePanel
            setSelectedTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
            label={template.label}
            bg={template.bg}
            key={i}
          />
        ))}
      </div>
      <div className={css["button-row"]}>
        <button
          onClick={() => {
            setNewVisible(false);
          }}
        >
          {" "}
          cancel{" "}
        </button>
        <button
          className={!selectedTemplate ? "disabled" : "primary"}
          onClick={onCreate}
        >
          {" "}
          CREATE{" "}
        </button>
      </div>
    </Panel>
  );
};

export default CreateNew;
