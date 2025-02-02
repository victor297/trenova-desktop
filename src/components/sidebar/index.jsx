/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import authImg from "@/assets/img/auth/auth.png";
import { routes } from "./../../routes";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = ({ open, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[16px] mt-[30px] flex items-center`}>
        <Link
          to="/"
          className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white"
        >
          LearnNova
          {/* <img alt="LearnNova" className="h-20 " src={authImg} /> */}
        </Link>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} onClose={onClose} />
      </ul>
    </div>
  );
};

export default Sidebar;
