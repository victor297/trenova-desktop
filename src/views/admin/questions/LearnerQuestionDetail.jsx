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
  const [submittedWeeks, setSubmittedWeeks] = useState({});
  const [reviewMode, setReviewMode] = useState(false);

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

  const nextQuestion = (weekIndex, totalQuestions) => {
    setCurrentQuestionIndices((prev) => ({
      ...prev,
      [`${weekIndex}`]: Math.min(
        (prev[`${weekIndex}`] || 0) + 1,
        totalQuestions - 1
      ),
    }));
  };

  const previousQuestion = (weekIndex) => {
    setCurrentQuestionIndices((prev) => ({
      ...prev,
      [`${weekIndex}`]: Math.max(
        (prev[`${weekIndex}`] || 0) - 1,
        0
      ),
    }));
  };

  const handleAnswerClick = (weekIndex, questionIndex, optionIndex) => {
    if (!submittedWeeks[weekIndex]) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [`${weekIndex}-${questionIndex}`]: optionIndex,
      }));
    }
  };

  const calculateScoreForWeek = (weekIndex) => {
    let score = 0;
    const week = question.content[weekIndex];
    week.questions.forEach((question, questionIndex) => {
      const selectedAnswer = selectedAnswers[`${weekIndex}-${questionIndex}`];
      const correctAnswer = question.correctOption - 1;
      if (selectedAnswer === correctAnswer) {
        score += 1;
      }
    });
    setTotalScore(score);
    setModalContent(`You scored ${score} out of ${week.questions.length} for ${week.week}`);
    setIsModalOpen(true);
    setSubmittedWeeks(prev => ({
      ...prev,
      [weekIndex]: true
    }));
  };

  const toggleReviewMode = () => {
    setReviewMode(!reviewMode);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isVideoQuestion = (text) => text.includes('.mp4');

  const isAnswerCorrect = (weekIndex, questionIndex, optionIndex) => {
    const correctAnswer = question.content[weekIndex].questions[questionIndex].correctOption - 1;
    return optionIndex === correctAnswer;
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">{question.name}</h1>

      {question.content.map((week, weekIndex) => (
        <div key={week._id} className="mb-8 bg-white rounded-lg shadow-md">
          <h2
            className="text-2xl font-semibold text-orange-500 p-6 cursor-pointer"
            onClick={() => toggleWeek(weekIndex)}
          >
            {week.week} {isWeekOpen[weekIndex] ? '▼' : '▶'}
          </h2>

          {isWeekOpen[weekIndex] && (
            <div className="flex flex-col justify-center p-6">
              <div className="rounded-lg">
                {week.questions.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-brand-600">
                        Question {(currentQuestionIndices[`${weekIndex}`] || 0) + 1} of{' '}
                        {week.questions.length}
                      </h4>
                      <div className="flex gap-4">
                        <button
                          onClick={() => previousQuestion(weekIndex)}
                          disabled={(currentQuestionIndices[`${weekIndex}`] || 0) === 0}
                          className={`p-2 rounded ${
                            (currentQuestionIndices[`${weekIndex}`] || 0) === 0
                              ? 'bg-gray-100 text-orange-400'
                              : 'bg-brand-300 text-white hover:bg-brand-600'
                          }`}
                        >
                          <FaArrowLeft />
                        </button>
                        <button
                          onClick={() => nextQuestion(weekIndex, week.questions.length)}
                          disabled={(currentQuestionIndices[`${weekIndex}`] || 0) === week.questions.length - 1}
                          className={`p-2 rounded ${
                            (currentQuestionIndices[`${weekIndex}`] || 0) === week.questions.length - 1
                              ? 'bg-gray-100 text-orange-400'
                              : 'bg-brand-300 text-white hover:bg-brand-600'
                          }`}
                        >
                          <FaArrowRight />
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const currentQuestionIndex = currentQuestionIndices[`${weekIndex}`] || 0;
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
                                {currentQuestion.options.map((option, optionIndex) => {
                                  const isSelected = selectedAnswers[`${weekIndex}-${currentQuestionIndex}`] === optionIndex;
                                  const isCorrect = isAnswerCorrect(weekIndex, currentQuestionIndex, optionIndex);
                                  
                                  // Only show correct answers if in review mode
                                  const showAsCorrect = reviewMode && isCorrect;
                                  const showAsIncorrect = reviewMode && isSelected && !isCorrect;

                                  return (
                                    <li
                                      key={optionIndex}
                                      className={`p-3 rounded border ${
                                        showAsCorrect
                                          ? 'bg-green-100 border-green-500'
                                          : showAsIncorrect
                                            ? 'bg-red-100 border-red-500'
                                            : isSelected
                                              ? 'bg-brand-100 border-brand-300'
                                              : 'bg-white border-gray-200'
                                      } ${submittedWeeks[weekIndex] ? 'cursor-default' : 'cursor-pointer'}`}
                                      onClick={() =>
                                        !submittedWeeks[weekIndex] && handleAnswerClick(weekIndex, currentQuestionIndex, optionIndex)
                                      }
                                    >
                                      <div className="flex items-center">
                                        {option}
                                        {showAsCorrect && (
                                          <FaCheck className="ml-2 text-green-500" />
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                {(currentQuestionIndices[`${weekIndex}`] || 0) + 1 === week.questions.length ? (
                  <button
                    onClick={() => calculateScoreForWeek(weekIndex)}
                    className="w-64 mx-auto px-6 py-2 bg-green-500 text-center text-white rounded hover:bg-green-600 transition-colors"
                    disabled={submittedWeeks[weekIndex]}
                  >
                    {submittedWeeks[weekIndex] ? 'Submitted' : `Submit Answers for ${week.week}`}
                  </button>
                ) : (
                  <button
                    onClick={() => calculateScoreForWeek(weekIndex)}
                    className="text-center text-gold"
                  >
                    Skip and submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Score</h2>
            <p className="text-lg mb-6">{modalContent}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  closeModal();
                  setReviewMode(true);
                }}
                className="px-6 py-2 bg-blue text-white rounded hover:bg-blue-600 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionDetail;