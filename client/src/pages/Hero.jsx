import { FaArrowRight } from "react-icons/fa6";
import logo from "../assets/images/SyncSpace_logo.png";

const Hero = () => {
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  }
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center lg:justify-start overflow-hidden">
        <div className="flex flex-col gap-6 p-6 text-center items-center lg:text-left lg:items-start lg:ml-20 z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            SyncSpace
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl w-full max-w-[600px]">
            A hub for your projects, notes and tasks, designed to make
            productivity simple, clear and fast.
          </p>
          <button
            className="group flex flex-row items-center bg-black w-56 rounded-md p-3 justify-around transition-transform duration-300 hover:scale-105"
            onClick={login}
          >
            <p className="text-white text-2xl">Get Started</p>
            <FaArrowRight className="text-white size-6 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>

        <div className="hidden lg:block absolute top-0 right-0 h-full w-auto -z-10">
          <img
            src={logo}
            alt="Decorative background logo for SyncSpace"
            className="opacity-10 h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#d9d9d9] w-full py-4 px-4 flex items-center justify-center text-center">
        <p className="text-xs sm:text-sm">
          Contact us via vishalkannan070@gmail.com or dhinaprogrammer7@gmail.com
        </p>
      </footer>
    </>
  );
};

export default Hero;
