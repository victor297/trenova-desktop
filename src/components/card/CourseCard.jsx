import Card from "@/components/card";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDownload } from "react-icons/md";
import creative from "@/assets/img/creative.jpg"
import diction from "@/assets/img/diction.jpg"
import library from "@/assets/img/library.jpg"
import math from "@/assets/img/math.jpg"


const CourseCard = ({
  title,
  classFor,
  term,
  image,
  extra,
  id,
  refetch,
  school,
  course,
}) => {
 

  const { userInfo } = useSelector((state) => state.auth);
  // console.log(course);
  const navigate = useNavigate();



  return (
    <Card onClick={() => navigate(`/viewcoursedetails/${id}`)}
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
          <img
src={
  title.toLowerCase().includes("math") ? math :
  title.toLowerCase().includes("libra") ? library :
  title.toLowerCase().includes("diction") ? diction :
  creative
}
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            alt=""
          />
       
            <button
              onClick={() => navigate(`/viewcoursedetails/${id}`)}
              className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full text-xl hover:bg-gray-50 dark:text-navy-900">
                View <AiFillEye />
              </div>
            </button>
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-row md:items-start lg:justify-between xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </p>
            <p className="text-sm mt-1 font-medium text-gray-600 md:mt-2">
              Class {classFor}
            </p>
          </div>
        </div>
       
        <div className="flex items-center justify-between    ">
            <p className="text-sm  font-bold text-brand-500 dark:text-white">
              Term {term}
            </p>
            <MdDownload color="blue" size={20}/>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
