import { Routes, Route, Navigate } from "react-router-dom";
// import { routes } from "routes.js";
import authImg from "@/assets/img/auth/auth.png";
import Footer from "@/components/footer/Footer";
import { routes } from "./../../routes";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <div className="mx-auto mt-[5%] flex  w-full   flex-col items-center justify-center pt-12 md:max-w-[75%]  lg:max-w-[1013px] lg:px-8 lg:pt-0  xl:max-w-[1383px] ">
      <img alt="LearnNova" className="h-20 " src={authImg} />
      <div className="mx-auto  mb-auto flex flex-col pl-5 pr-5 md:pl-12 md:pr-0 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
