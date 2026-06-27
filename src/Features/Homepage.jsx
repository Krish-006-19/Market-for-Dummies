import { useContext } from "react";
import { CursorContext } from "../contextAPI/Cursorcontext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Homepage() {
  const { cursorPos } = useContext(CursorContext);
  return (
    <div className="relative spg min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 font-sans transition duration-500">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(200px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59,130,246,0.25), transparent 80%)`,
        }}
      ></div>

      <Navbar />

      <section className="relative z-1 text-center py-14 sm:py-20 md:py-24 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r to-green-400 bg-clip-text text-transparent drop-shadow-lg">
          Invest Smarter, Grow Faster
        </h2>
        <p className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10">
          A next-gen mutual fund investing app for beginners. Clean, transparent, and easy to
          use. Learn, practice, and master the markets without losing a penny
          and gaining experience.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
          <Link
            to="/trade"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-xl hover:scale-105 transition cursor-pointer"
          >
            Start Trading
          </Link>
          <Link
            to="/lessons"
            className="bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/40 px-8 py-3 rounded-xl font-medium hover:scale-105 transition shadow-md cursor-pointer"
          >
            Take Lessons
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
