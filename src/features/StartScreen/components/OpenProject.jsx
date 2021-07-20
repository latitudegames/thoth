import { useState } from "react";

import css from "../startScreen.module.css";
import Panel from "../../common/Panel/Panel";
import ProjectRow from "./ProjectRow";
import FileInput from "./FileInput";
import thothBanner from "../version-banner-0.0.0beta.jpg";
import Icon from "../../common/Icon/Icon";
import { useSpell, getSpell } from "../../../contexts/SpellProvider";
import { useLocation } from "wouter";
import { useTabManager } from "../../../contexts/TabManagerProvider";

const projects = [
  { label: "Lorem ipsum" },
  { label: "Dolor sit" },
  { label: "Taco Bell ad ambulat" },
  { label: "Candor umlaut" },
];

const OpenProject = () => {
  const { tabs } = useTabManager();
  const [selectedProject, setSelectedProject] = useState(null);
  const { getThothVersion, newSpell, getSpell } = useSpell();
  const { openTab } = useTabManager();
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const onReaderLoad = async (event) => {
    const spellData = JSON.parse(event.target.result);
    // TODO check for proper values here and throw errors

    let existingSpell = await getSpell(spellData.name);
    const spell = existingSpell ? existingSpell : await newSpell(spellData);

    await openTab({ name: spell.name, spellId: spell.name });
  };

  const loadFile = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    console.log("selected file");
    reader.readAsText(selectedFile);
  };

  return (
    <Panel shadow unpadded>
      {tabs?.length < 1 && (
        <div
          className={css["version-banner"]}
          style={{ backgroundImage: `url(${thothBanner})` }}
        >
          {getThothVersion()}
        </div>
      )}
      <div className={css["open-project-container"]}>
        <h1 style={{ marginLeft: 16 }}> Recent Projects </h1>

        <Panel
          style={{ width: "var(--c62)", backgroundColor: "var(--dark-1)" }}
          flexColumn
          gap={"var(--small)"}
          roundness="round"
          unpadded
        >
          {projects.map((project, i) => (
            <ProjectRow
              key={i}
              setSelectedProject={setSelectedProject}
              selectedProject={selectedProject}
              label={project.label}
            />
          ))}
        </Panel>

        <div className={css["button-row"]}>
          {tabs?.length > 0 && (
            <button
              onClick={() => {
                window.history.back();
              }}
            >
              cancel
            </button>
          )}
          {tabs?.length < 1 && (
            <button
              onClick={() => {
                setLocation("/home/create-new");
              }}
            >
              <Icon name="add" style={{ marginRight: "var(--extraSmall)" }} />
              Create new
            </button>
          )}
          <FileInput loadFile={loadFile} />
          <button className={!selectedProject ? "disabled" : "primary"}>
            OPEN
          </button>
        </div>
      </div>
    </Panel>
  );
};

export default OpenProject;
