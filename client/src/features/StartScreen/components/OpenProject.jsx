import css from "../startScreen.module.css";
import Panel from "../../common/Panel/Panel";
import ProjectRow from "./ProjectRow";
import FileInput from "./FileInput";
import thothBanner from "../version-banner-0.0.0beta.jpg";
import Icon from "../../common/Icon/Icon";
import { useSpell } from "../../../contexts/SpellProvider";
import { useLocation } from "wouter";
import { useTabManager } from "../../../contexts/TabManagerProvider";

const OpenProject = ({projects, setSelectedProject, selectedProject, loadFile}) => {
  const { tabs } = useTabManager();
  const { getThothVersion } = useSpell();
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

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
        <h1 style={{marginLeft: 'var(--small)' }}> 
          Recent Projects
        </h1>

        <Panel
          style={{ width: "var(--c62)", backgroundColor: "var(--dark-1)" }}
          flexColumn
          gap={"var(--small)"}
          roundness="round"
          unpadded
        >
          {projects.map((project, i) => {
            if(i > 1) return (<></>)
            return (<ProjectRow
              key={i}
              setSelectedProject={setSelectedProject}
              selectedProject={selectedProject}
              label={project.label}
              onClick={() => {
                setSelectedProject(project.label);
              }}
            />)
          })}
          <ProjectRow
              label={"More..."}
              icon={"properties"}
              style={{fontFamily: 'IBM Plex Mono', textTransform: 'uppercase'}}
              onClick={() => {
                setLocation("/home/all-projects");
              }}
            />
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
