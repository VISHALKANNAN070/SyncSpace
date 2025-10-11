import { FaEllipsisV, FaPencilAlt, FaTrash } from "react-icons/fa";

const ProjectList = ({
  projects,
  optionsOpen,
  setOptionsOpen,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <ul className="flex flex-col gap-1">
        {projects &&
          projects.map((project, index) => (
            <li
              key={project._id} // Using a unique ID is better than index
              className="group w-full p-2 text-sm rounded-md hover:bg-gray-800 cursor-pointer transition-colors duration-200 flex justify-between items-center"
              title={project.name}
            >
              <span className="truncate">{project.name}</span>
              <div className="relative">
                <FaEllipsisV
                  className={`size-3 text-gray-400 cursor-pointer ${
                    optionsOpen === index ? "block" : "hidden group-hover:block"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOptionsOpen(index === optionsOpen ? null : index);
                  }}
                />
                {optionsOpen === index && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    <button
                      className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-200 hover:bg-gray-700"
                      onClick={() => handleEdit(project._id)}
                    >
                      <FaPencilAlt className="flex-shrink-0" />
                      Edit Project
                    </button>
                    <div className="border-t border-gray-700"></div>
                    <button
                      className="flex items-center gap-3 px-3 py-2 w-full text-sm text-red-400 hover:bg-gray-700"
                      onClick={() => handleDelete(project._id)}
                    >
                      <FaTrash className="flex-shrink-0" />
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProjectList;
