import React, { useState } from "react";

import CreateNew from "./components/CreateNew";
import OpenProject from "./components/OpenProject";
import AllProjects from "./components/AllProjects";
import { useTabManager } from "../../contexts/TabManagerProvider";

import css from "./startScreen.module.css";
import { useDB } from "../../contexts/DatabaseProvider";

//MAIN

const StartScreen = ({ createNew, allProjects, ...props }) => {
  const {
    models: { spells, modules },
  } = useDB();
  const { openTab } = useTabManager();

  const projects = [
    { label: "Lorem ipsum" },
    { label: "Dolor sit" },
    { label: "Taco Bell ad ambulat" },
    { label: "Candor umlaut" },
  ];

  const onReaderLoad = async (event) => {
    const spellData = JSON.parse(event.target.result);
    // TODO check for proper values here and throw errors

    let existingSpell = await spells.getSpell(spellData.name);
    const spell = existingSpell
      ? existingSpell
      : await spells.newSpell(spellData);

    // Load modules from the spell

    if (spellData?.modules && spellData.modules.length > 0)
      await Promise.all(
        spellData.modules.map((module) => {
          return modules.updateOrCreate(module);
        })
      );

    await openTab({ name: spell.name, spellId: spell.name, type: "spell" });
  };

  const loadFile = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    console.log("selected file");
    reader.readAsText(selectedFile);
  };

  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className={css["overlay"]}>
      <div className={css["center-container"]}>
        {createNew && <CreateNew />}
        {allProjects && (
          <AllProjects
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            loadFile={loadFile}
          />
        )}
        {!createNew && !allProjects && (
          <OpenProject
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            loadFile={loadFile}
          />
        )}
      </div>
    </div>
  );
};

export default StartScreen;
