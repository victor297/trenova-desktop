import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaQuestionCircle, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function QuestionDetail({ questions }) {
  const { questionId } = useParams();
  const [showAnswer, setShowAnswer] = useState({});
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState({});

  const question = questions.find((q) => q._id === questionId);

  if (!question) {
    return <div className="p-6">Question not found</div>;
  }

  const toggleAnswer = (weekIndex, lessonIndex) => {
    setShowAnswer((prev) => ({
      ...prev,
      [`${weekIndex}-${lessonIndex}`]: !prev[`${weekIndex}-${lessonIndex}`],
    }));
  };

  const nextQuestion = (weekIndex, lessonIndex, totalQuestions) => {
    setCurrentQuestionIndices((prev) => ({
      ...prev,
      [`${weekIndex}-${lessonIndex}`]: Math.min(
        (prev[`${weekIndex}-${lessonIndex}`] || 0) + 1,
        totalQuestions - 1
      ),
    }));
  };

  const previousQuestion = (weekIndex, lessonIndex) => {
    setCurrentQuestionIndices((prev) => ({
      ...prev,
      [`${weekIndex}-${lessonIndex}`]: Math.max(
        (prev[`${weekIndex}-${lessonIndex}`] || 0) - 1,
        0
      ),
    }));
  };

  const isVideoQuestion = (text) => text.includes('.mp4');

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">{question.name}</h1>
      
      {question.content.map((week, weekIndex) => (
        <div key={week._id} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">
             {week.week}
          </h2>
          
          <div className="space-y-6">
            {week.lessons.map((lesson, lessonIndex) => (
              <div key={lesson._id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <FaVideo className="text-blue-500 text-xl" />
                  <div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    {/* <p className="text-gray-600">{lesson.number}</p> */}
                  </div>
                </div>

                {week.questions.length > 0 && (
                  <div className="mt-6 bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-blue-600">
                        Question {(currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) + 1} of {week.questions.length}
                      </h4>
                      <div className="flex gap-4">
                        <button
                          onClick={() => previousQuestion(weekIndex, lessonIndex)}
                          disabled={(currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) === 0}
                          className={`p-2 rounded ${
                            (currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) === 0
                              ? 'bg-gray-100 text-orange-400'
                              : 'bg-brand-300 text-white hover:bg-brand-600'
                          }`}
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          onClick={() => nextQuestion(weekIndex, lessonIndex, week.questions.length)}
                          disabled={(currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) === week.questions.length - 1}
                          className={`p-2 rounded ${
                            (currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) === week.questions.length - 1
                            ? 'bg-gray-100 text-orange-400'
                            : 'bg-brand-300 text-white hover:bg-brand-600'
                          }`}
                        >
                          <FaArrowRight />
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const currentQuestion = week.questions[currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0];
                      return (
                        <div className="mb-4">
                          <div className="flex items-start gap-4">
                            <FaQuestionCircle className="text-orange-500 text-xl mt-1" />
                            <div className="flex-1">
                              {isVideoQuestion(currentQuestion.text) ? (
                                <div className="mb-4">
                                  <video
                                    controls
                                    className="w-full rounded-lg"
                                    src={currentQuestion.text}
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ) : (
                                <p className="font-semibold mb-4">{currentQuestion.text}</p>
                              )}
                              <ul className="space-y-2">
                                {currentQuestion.options.map((option, optionIndex) => (
                                  <li
                                    key={optionIndex}
                                    className={`p-3 rounded border ${
                                      showAnswer[`${weekIndex}-${lessonIndex}`] &&
                                      optionIndex === currentQuestion.correctOption - 1
                                        ? 'bg-green-100 border-green-300'
                                        : 'bg-white border-gray-200'
                                    }`}
                                  >
                                    {option}
                                    {showAnswer[`${weekIndex}-${lessonIndex}`] &&
                                      optionIndex === currentQuestion.correctOption - 1 && (
                                        <FaCheck className="inline ml-2 text-green-500" />
                                      )}
                                  </li>
                                ))}
                              </ul>
                              <button
                                onClick={() => toggleAnswer(weekIndex, lessonIndex)}
                                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                              >
                                {showAnswer[`${weekIndex}-${lessonIndex}`]
                                  ? 'Hide Answer'
                                  : 'Show Answer'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionDetail;