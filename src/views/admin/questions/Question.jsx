import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import { useGetCoursesQuestionsQuery } from "@/redux/api/CoursesApiSlice";
import QuestionList from "./QuestionList";
import { setQuestions } from "@/redux/features/auth/authSlice";

const Question = () => {
  const [findClass, setFindClass] = useState("");
  const [term, setTerm] = useState("");
  const dispatch = useDispatch();
  const { userInfo, questions } = useSelector((state) => state.auth);

  // Determine the appropriate school ID based on user role
  const schoolId = userInfo.role === "schoolAdmin" ? userInfo._id : userInfo.schoolID;

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

  const { data: questionsData = [], isLoading, isError, error } = useGetCoursesQuestionsQuery(
    {
      name: userInfo?.subjectAccess,
      term: userInfo?.termAccess,
      school: schoolId,
    },
    { skip: !navigator.onLine }
  );

  // Synchronize local storage and Redux store
  useEffect(() => {
    if (navigator.onLine) {
      if (questionsData?.data?.length > 0) {
        dispatch(setQuestions(questionsData.data));
        localStorage.setItem("questions", JSON.stringify(questionsData.data));
      }
    } else {
      const storedQuestions = JSON.parse(localStorage.getItem("questions"));
      if (!storedQuestions) {
        toast.error("No cached data available.");
      } 
    }
  }, [questionsData, dispatch]);

  // Debugging: Log questions and selected filters
  console.log("Questions Data:", questions);
  console.log("Selected Class:", findClass);
  console.log("Selected Term:", term);

  const filteredQuestions = questions?.filter((q) => {
    const matchesClass = findClass ? q.class === findClass : true;
    const matchesTerm = term ? q.term === Number(term) : true; // Assuming term is stored as a number
    return matchesClass && matchesTerm;
  });

  if (isLoading) return <Loader />;
  if (isError) {
    toast.error(error.error || "An error occurred.");
    return <h2>{error?.data?.message || "Failed to load questions."}</h2>;
  }

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* Filter Header */}
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="text-2xl ml-1 font-bold text-navy-700 dark:text-white">Filter Questions</h4>
          <div className="mb-4 flex gap-3">
            <div>
              <label htmlFor="term" className="text-sm block font-medium text-gray-700">
                Term
              </label>
              <select
                id="term"
                name="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
              >
                <option value="">Select Term</option>
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
            <div>
              <label htmlFor="class" className="text-sm block font-medium text-gray-700">
                Class
              </label>
              <select
                id="class"
                name="class"
                value={findClass}
                onChange={(e) => setFindClass(e.target.value)}
                className="mt-1 w-full rounded-md border border-gold p-2 focus:border-gold focus:outline-none focus:ring focus:ring-yellow-500"
              >
                <option value="">Select Class</option>
                {classOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions Display */}
        <div>
          {term && findClass ? (
            filteredQuestions?.length > 0 ? (
              <QuestionList questions={filteredQuestions} />
            ) : (
              <p className="text-gray-600">No questions found for the selected filters.</p>
            )
          ) : (
            <p className="text-gray-600">Please select a term and class to filter questions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question;
