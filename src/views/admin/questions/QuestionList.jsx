import { Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';

function QuestionList({ questions }) {
  return (
    <div className="p-2">
        <div className="z-20 grid grid-cols-1  gap-5 md:grid-cols-3 xl:grid-cols-4">
        {questions.map((question) => (
          <Link
            key={question._id}
            to={`/question/${question._id}`}
            className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow border border-orange-300"
          >
              <div >
                    <h2 className="text-xl font-semibold text-orange-600">{question.name}</h2>
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