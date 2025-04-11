import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaQuestionCircle, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function QuestionDetail({ questions }) {
  const { questionId } = useParams();
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isWeekOpen, setIsWeekOpen] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [modalContent, setModalContent] = useState('');

  const question = questions.find((q) => q._id === questionId);

  if (!question) {
    return <div className="p-6">Question not found</div>;
  }

  const toggleWeek = (weekIndex) => {
    setIsWeekOpen((prev) => ({
      ...prev,
      [weekIndex]: !prev[weekIndex],
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

  const handleAnswerClick = (weekIndex, questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`${weekIndex}-${questionIndex}`]: optionIndex,
    }));
    // console.log(`Selected Answer: Week ${weekIndex}, Question ${questionIndex}, Option ${optionIndex}`);
  };

  const calculateScoreForWeek = (weekIndex) => {
    let score = 0;
    const week = question.content[weekIndex];
    week.questions.forEach((question, questionIndex) => {
      const selectedAnswer = selectedAnswers[`${weekIndex}-${questionIndex}`];
      const correctAnswer = question.correctOption - 1; // Convert to 0-based index
      // console.log(`Week ${weekIndex}, Question ${questionIndex}: Selected ${selectedAnswer}, Correct ${correctAnswer}`);
      if (selectedAnswer === correctAnswer) {
        score += 1;
      }
    });
    setTotalScore(score);
    setModalContent(`You scored ${score} out of ${week.questions.length} for ${week.week}`);
    setIsModalOpen(true);
    // console.log(`Score for ${week.week}: ${score}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isVideoQuestion = (text) => text.includes('.mp4');

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">{question.name}</h1>

      {question.content.map((week, weekIndex) => (
        <div key={week._id} className="mb-8 bg-white rounded-lg shadow-md">
          <h2
            className="text-2xl font-semibold text-orange-500 p-6  cursor-pointer"
            onClick={() => toggleWeek(weekIndex)}
          >
            {week.week} {isWeekOpen[weekIndex] ? '▼' : '▶'}
          </h2>

          {isWeekOpen[weekIndex] && (
            <div className=" flex flex-col justify-center p-6">
              {week.lessons.map((lesson, lessonIndex) => (
                <div key={lesson._id} className=" rounded-lg ">
                  <div className="flex items-center gap-4 mb-4">
                    <FaVideo className="text-blue-500 text-xl" />
                    <div>
                      <h3 className="font-semibold">{lesson.title}</h3>
                    </div>
                  </div>

                  {week.questions.length > 0 && (
                    <div className=" bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-brand-600">
                          Question {(currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) + 1} of{' '}
                          {week.questions.length}
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
                        const currentQuestionIndex = currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0;
                        const currentQuestion = week.questions[currentQuestionIndex];
                        return (
                          <div className="mb-4">
                            <div className="flex items-start gap-4">
                              <FaQuestionCircle className="text-orange-500 text-xl mt-1" />
                              <div className="flex-1">
                                {isVideoQuestion(currentQuestion.text) ? (
                                  <div className="mb-4">
                                    <video controls className="w-full rounded-lg" src={currentQuestion.text}>
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
                                      className={`p-3 rounded border cursor-pointer ${
                                        selectedAnswers[`${weekIndex}-${currentQuestionIndex}`] === optionIndex
                                          ? 'bg-brand-100 border-brand-300'
                                          : 'bg-white border-gray-200'
                                      }`}
                                      onClick={() =>
                                        handleAnswerClick(weekIndex, currentQuestionIndex, optionIndex)
                                      }
                                    >
                                      {option}
                                      {selectedAnswers[`${weekIndex}-${currentQuestionIndex}`] === optionIndex && (
                                        <FaCheck className="inline ml-2 text-green-500" />
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                     {(currentQuestionIndices[`${weekIndex}-${lessonIndex}`] || 0) + 1 === week.questions.length ? <button
                onClick={() => calculateScoreForWeek(weekIndex)}
                className=" w-64 mx-auto  px-6 py-2 bg-green-500 text-center text-white rounded hover:bg-green-600 transition-colors"
              >
                Submit Answers for {week.week}
              </button>:<button
                onClick={() => calculateScoreForWeek(weekIndex)}
                className=" text-center text-gold "
              >
                Skip and submit
              </button>}
                </div>
                
              ))}
              {/* Submit button for each week */}
           
            </div>
          )}
        </div>
      ))}

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Score</h2>
            <p className="text-lg">{modalContent}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 text-center  bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionDetail;