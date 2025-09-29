import { FaArrowRight } from "react-icons/fa6";
import logo from "../assets/images/SyncSpace_logo.png"; // Make sure this path is correct

const Hero = () => {
  return (
    <>
      {/* Main container with relative positioning context for the logo */}
      <div className="relative min-h-screen flex items-center justify-center lg:justify-start overflow-hidden">
        {/* Text and CTA content block */}
        <div className="flex flex-col gap-6 p-6 text-center items-center lg:text-left lg:items-start lg:ml-20 z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            SyncSpace
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl w-full max-w-[600px]">
            A hub for your projects, notes and tasks, designed to make
            productivity simple, clear and fast.
          </p>
          <a
            href="#"
            className="group flex flex-row items-center bg-black w-56 rounded-md p-3 justify-around transition-transform duration-300 hover:scale-105"
          >
            <p className="text-white text-2xl">Get Started</p>
            <FaArrowRight className="text-white size-6 transition-transform duration-300 group-hover:translate-x-2" />
          </a>
        </div>

        {/* Background Logo Container */}
        {/* Hidden on mobile, appears on large screens. -z-10 places it behind all other content. */}
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
