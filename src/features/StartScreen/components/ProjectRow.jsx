import css from "../startScreen.module.css";

const ProjectRow = ({ label, setSelectedProject, selectedProject }) => {
  return (
    <div
      className={`${css["project-row"]} ${
        css[selectedProject === label ? "selected" : ""]
      }`}
      onClick={() => {
        setSelectedProject(label);
      }}
    >
      {label}
    </div>
  );
};

export default ProjectRow;
