import Panel from "../../common/Panel/Panel";
import Icon from "../../common/Icon/Icon";
import ProjectRow from "./ProjectRow";
import FileInput from "./FileInput";

import css from "../startScreen.module.css";

const AllProjects = ({ projects, setSelectedProject, selectedProject, loadFile }) => {
  return (
    <Panel shadow>
      <h1>
        <Icon name={"properties"} size={'var(--medium)'} style={{marginRight: 'var(--extraSmall)', top: '3px'}}/>
        All Projects
      </h1>
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
            onClick={() => {
              setSelectedProject(project.label);
            }}
          />
        ))}
      </Panel>

      <div className={css["button-row"]}>
        <button
          onClick={() => {
            window.history.back();
          }}
        >
          back
        </button>
        <FileInput loadFile={loadFile} />
        <button className={!selectedProject ? "disabled" : "primary"}>
            OPEN
          </button>
      </div>
    </Panel>
  );
};

export default AllProjects;
