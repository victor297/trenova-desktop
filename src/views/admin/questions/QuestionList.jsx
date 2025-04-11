import { Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';
import creative from "@/assets/img/creative.jpg"
import diction from "@/assets/img/diction.jpg"
import library from "@/assets/img/library.jpg"
import math from "@/assets/img/math.jpg"


function QuestionList({ questions }) {
  // console.log(questions,"Questions")
  return (
    <div className="p-2">
        <div className="z-20 grid grid-cols-1  gap-5 md:grid-cols-3 xl:grid-cols-4">
        {questions.map((question) => (
          <Link
            key={question._id}
            to={`/question/${question._id}`}
            className="bg-white rounded-xl shadow-md p-2 hover:shadow-lg transition-shadow "
          >
            <div >
            <img
           src={
            question?.name?.toLowerCase().includes("math") ? math :
            question?.name?.toLowerCase().includes("libra") ? library :
            question?.name?.toLowerCase().includes("diction") ? diction :
            creative
          }
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            alt=""
          />                    <h2 className="text-xl font-semibold text-orange-600">{question.name}</h2>
                    <div className="flex gap-2">

                <p className="text-green-600">Class: {question.class}</p>
                <p className="text-gray-600">Term: {question.term}</p>
              </div>
                    </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuestionList;