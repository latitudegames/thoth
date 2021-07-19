import { useState } from "react";

import css from "../startScreen.module.css";
import Panel from "../../common/Panel/Panel";
import ProjectRow from "./ProjectRow";
import thothBanner from "../version-banner-0.0.0beta.jpg";

const projects = [
  { label: "Lorem ipsum" },
  { label: "Dolor sit" },
  { label: "Taco Bell ad ambulat" },
  { label: "Candor umlaut" },
];

const OpenProject = ({ setNewVisible }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <Panel shadow unpadded>
      <div
        className={css["version-banner"]}
        style={{ backgroundImage: `url(${thothBanner})` }}
      />
      <div className={css["open-project-container"]}>
        <h1 style={{ marginLeft: 16 }}> Recent Projects </h1>

        <Panel
          style={{ width: "var(--c62)", backgroundColor: "var(--dark-1)" }}
          flexColumn
          gap={"var(--small)"}
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
          <button
            onClick={() => {
              setNewVisible(true);
            }}
          >
            {" "}
            Create new{" "}
          </button>
          <button> Browse </button>
          <button className={!selectedProject ? "disabled" : "primary"}>
            {" "}
            OPEN{" "}
          </button>
        </div>
      </div>
    </Panel>
  );
};

export default OpenProject;
