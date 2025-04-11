import React, { useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer/Footer";
import ViewCourse from "@/views/admin/courses/ViewCourse";
import { routes } from "./../../routes";
import QuestionList from "@/views/admin/questions/QuestionList";
import QuestionDetail from "@/views/admin/questions/QuestionDetail";
import { useSelector } from "react-redux";
import LearnerQuestionDetail from "@/views/admin/questions/LearnerQuestionDetail";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
    const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
    const { questions } = useSelector((state) => state.auth);

  const { userInfo } = useSelector((state) => state.auth);
console.log(userInfo)
  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={handleClose} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[255px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"LearnNova"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="mx-auto mb-auto h-full min-h-[74vh] p-2 pt-5 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route path="/viewcoursedetails/:id" element={<ViewCourse />} />
                {/* <Route path="/questions" element={<QuestionList questions={questionData.data} />} /> */}
                {
  userInfo?.role === "schoolAdmin" ? (
    <Route path="/question/:questionId" element={<QuestionDetail questions={questions} />} />
  ) : (
    <Route path="/question/:questionId" element={<LearnerQuestionDetail questions={questions} />} />
  )
}

                <Route
                  path="/"
                  element={<Navigate to="/all-course" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
