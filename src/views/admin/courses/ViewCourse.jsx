import React, { useState } from "react";
import { useGetCourseDetailsQuery } from "../../../redux/api/CoursesApiSlice";
import { toast } from "react-hot-toast";
import Loader from "@/components/Loader";
import { useParams } from "react-router-dom";

const ViewCourse = () => {
  const params = useParams();
  const [expandedWeeks, setExpandedWeeks] = useState([]);
  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetCourseDetailsQuery(params.id);

  const toggleWeek = (weekId) => {
    if (expandedWeeks.includes(weekId)) {
      setExpandedWeeks(expandedWeeks.filter((id) => id !== weekId));
    } else {
      setExpandedWeeks([...expandedWeeks, weekId]);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return toast.error(isError);
  }
  console.log("courseData", courseData);
  return (
    <div className="container mx-auto rounded-xl border px-4">
      <h1 className="mb-4 pt-4 text-3xl font-bold text-gold">
        {courseData.data.name}
      </h1>
      {courseData.data.content.map((week) => (
        <div key={week._id} className="mb-8">
          <h2
            className="mb-2 cursor-pointer text-xl font-semibold"
            onClick={() => toggleWeek(week._id)}
          >
           {week.week}
          </h2>
          {expandedWeeks.includes(week._id) && (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {week.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="rounded-lg border border-gold p-4"
                  >
                    <h3 className="mb-2 font-semibold">
                      {lesson.number}: {lesson.title}
                    </h3>
                    {lesson.content.endsWith(".pdf") ? (
                      <embed
                        src={lesson.content}
                        type="application/pdf"
                        width="250px"
                        height="200px"
                      />
                    ) : (
                      <video
                        controls
                        controlsList="nodownload"
                        className="w-full rounded-lg"
                        preload="metadata"
                      >
                        <source src={lesson.content} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-row pl-4">
                <ol className="mt-4 flex list-disc gap-8">
                  {week.questions.map((question, questionIndex) => (
                    <li key={question._id} className="mb-2">
                      {question?.text.includes(".mp4") ? (
                        <video
                          controls
                          controlsList="nodownload"
                          className="h-[200px]  w-[200px] rounded-lg"
                          preload="metadata"
                        >
                          <source src={question.text} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <strong className="text-cyan-500">
                          {question.text}
                        </strong>
                      )}
                      <ol className="ml-4 list-decimal ">
                        {question.options.map((option, optionIndex) => (
                          <li key={optionIndex}>{option}</li>
                        ))}
                      </ol>
                      <strong className="text-green-700">
                        Answer: {question.correctOption}
                      </strong>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
          <hr className="border-gold" />
        </div>
      ))}
    </div>
  );
};

export default ViewCourse;
