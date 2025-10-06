import { HiOutlineFolder } from "react-icons/hi";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* Big icon */}
      <HiOutlineFolder className="text-[8rem] text-gray-300 dark:text-gray-600 mb-6" />

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        Nothing here yet
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-500 dark:text-gray-400">
        You haven’t added any projects yet. Click “New Project” to get started!
      </p>
    </div>
  );
};

export default Home;
