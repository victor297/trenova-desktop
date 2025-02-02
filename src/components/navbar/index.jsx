import React from "react";
import Dropdown from "@/components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "@/assets/img/profile/avatar2.png";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux//features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getLocalGreeting } from "@/utils/helper";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutApi] = useLogoutMutation();

  const logoutHandler = () => {
    try {
      logOutApi();
      dispatch(logout());
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <p className="font-bold text-3xl">
      {getLocalGreeting()} {userInfo?.name}
      </p> 
      <div className="x relative mt-[3px] flex  h-[61px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800  dark:shadow-none md:flex-grow-0 md:gap-1 xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img className="h-10 w-10 rounded-full" src={avatar} alt="user" />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {/* 👋 Hey, {userInfo ? userInfo.user.name : null} */}
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <Link
                  to="/profile"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </Link>

                <Link
                  className="text-sm mt-3 font-medium text-red-500 transition duration-150 ease-out hover:text-red-500 hover:ease-in"
                  onClick={logoutHandler}
                >
                  Log Out
                </Link>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
