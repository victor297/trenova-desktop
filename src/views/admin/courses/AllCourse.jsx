import NFt3 from "@/assets/img/nfts/Nft3.png";
import { useGetCoursesQuery } from "../../../redux/api/CoursesApiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useGetUsersQuery } from "../../../redux/api/usersApiSlice";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import CourseCard from "@/components/card/CourseCard";
import Banner from "./Banner";
import { courseData } from "@/assets/img/data";
const AllCourse = () => {
  const [findClass, setfindClass] = useState("KG 1");
  const [id, setId] = useState("6603e6e06e7e286c38da1ea1");
  const [term, setTerm] = useState(7);
  const classOptions = [
    "KG 1",
    "KG 2",
    "Nursery 1",
    "Nursery 2",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "JSS 1",
    "JSS 2",
    "JSS 3",
    "SSS 1",
    "SSS 2",
    "SSS 3",
  ];

  const termOptions = ["1", "2", "3"];
  const { userInfo } = useSelector((state) => state.auth);
  console.log("userInfouserInfo", userInfo);
  console.log("userInfouserInfo", userInfo?.termAccess);
  useEffect(() => {
    if (userInfo.role === "schoolAdmin") {
      setId(userInfo._id);
    } else if (userInfo.role === "learner") {
      setId(userInfo.schoolID);
    }
  }, []);

  const {
    data: courses = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useGetCoursesQuery({
    class: `${ userInfo.role === "schoolAdmin" || userInfo.role === "admin"
    ? findClass
    : userInfo?.class}`,
    term: `${term}`,
    school: `${
      userInfo.role === "schoolAdmin"
        ? userInfo._id
        : userInfo.role === "learner"
        ? userInfo.schoolID
        : id
    }`,      name: userInfo?.subjectAccess,

  });
  console.log("userInfo", userInfo);
  // console.log("courses", courses);
  if (isLoading) {
    <Loader />;
  }
  if (isError) {
    toast.error(error.error || error?.data?.message);
  }
  return (
    // <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
    <div className="mt-3 grid h-full grid-cols-1 gap-5">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* NFt Banner */}
        <Banner />

        {/* Course Header */}
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="text-2xl ml-1 font-bold text-navy-700 dark:text-white">
            Filter Courses{" "}
          </h4>
          <div className="mb-4 flex gap-3">
          
            <div>
              <label
                htmlFor="name"
                className="text-sm block font-medium text-gray-700"
              >
                Term
              </label>
              <select
                id="term"
                name="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
              >
                <option value="7">Select Term</option>
                {userInfo?.termAccess?.map((option, index) => (
                <option key={index} value={option}>
                {option === 1
                  ? "First Term"
                  : option === 2
                  ? "Second Term"
                  : option === 3
                  ? "Third Term"
                  : option === 4
                  ? "Summer School"
                  : "Demo Term"}
              </option>
                ))}
              </select>
            </div>
          {userInfo.role === "schoolAdmin" || userInfo.role === "admin" ? <div>
              <label
                htmlFor="name"
                className="text-sm block font-medium text-gray-700"
              >
                Class
              </label>
              <select
                id="class"
                name="class"
                value={findClass}
                onChange={(e) => setfindClass(e.target.value)}
                className="mt-1 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
              >
                <option value="none">Select Class</option>
                {classOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>:null}
          </div>
        </div>

        {/* Course card */}
        <div className="z-20 grid grid-cols-1  gap-5 md:grid-cols-3 xl:grid-cols-4">
          {courses.data ? (
            courses.data.map((course, index) => (
              <CourseCard
                key={course._id}
                title={course.name}
                classFor={`${course.class}`}
                term={`${course.term}`}
                image={NFt3}
                id={course._id}
                refetch={refetch}
                school={course.school}
                course={course}
              />
            ))
          ) : isError ? (
            <h2 className=" font-extrabold">
              {error?.data?.message || error.error}
            </h2>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCourse;
