import React from "react";
import Profile from "./views/admin/profile";

// Import icons for the routes
import {
  MdGroup,
  MdOutlineShoppingCart,
  MdPerson,
  MdLock,
  MdWarning,
  MdDownloadForOffline,
} from "react-icons/md";
import SignIn from "@/views/auth/signIn/SignIn";
import AllCourse from "@/views/admin/courses/AllCourse";
import { BsBookFill, BsQuestionCircle } from "react-icons/bs";
import { RiBookOpenLine } from "react-icons/ri";
import Question from "./views/admin/questions/Question";
import CoursePage from "./views/admin/courses/CoursePage";

// Define your route configuration
export const routes = [
  {
    name: "Download-Courses",
    layout: "/admin",
    path: "download-course",
    icon: <RiBookOpenLine className="h-6 w-6" />,
    component: <CoursePage />,
    secondary: true,
  },
  {
    name: "Courses",
    layout: "/admin",
    path: "all-course",
    icon: <RiBookOpenLine className="h-6 w-6" />,
    component: <AllCourse />,
    secondary: true,
  },
  {
    name: "Questions",
    layout: "/admin",
    path: "questions",
    icon: <BsQuestionCircle className="h-6 w-6" />,
    component: <Question />,
    secondary: true,
  },
  {
    name: "Downloads",
    layout: "/admin",
    path: "downloads",
    icon: <MdDownloadForOffline className="h-6 w-6" />,
    component: <AllCourse />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "login",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
