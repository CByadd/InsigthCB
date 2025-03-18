import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import './Quiz.css';
import CountUp from "react-countup";

//
// const client = new W3CWebSocket('ws://localhost:8080');

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateQuiz = (chapters) => {
  let selectedQuestions = [];
  let usedQuestions = new Set();
  let chapterCounts = Array(chapters.length).fill(0);
  const maxQuestionsPerChapter = 2;
  const totalQuestions = 15;

  while (selectedQuestions.length < totalQuestions) {
    let chapterIndex = Math.floor(Math.random() * chapters.length);
    if (chapterCounts[chapterIndex] < maxQuestionsPerChapter) {
      let chapterQuestions = chapters[chapterIndex].questions;
      shuffleArray(chapterQuestions);

      let selected = chapterQuestions.find(
        (q) => !usedQuestions.has(q.question)
      );
      if (selected) {
        selectedQuestions.push(selected);
        usedQuestions.add(selected.question);
        chapterCounts[chapterIndex]++;
      }
    }
  }

  return selectedQuestions;
};

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        const chapters = data.chapters;
        const selectedQuiz = generateQuiz(chapters);

        // Preload images
        const allImages = [];
        selectedQuiz.forEach((question) => {
          allImages.push(question.question);
          question.options.forEach((option) => {
            allImages.push(option);
          });
        });

        const imagePromises = allImages.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
          });
        });

        Promise.all(imagePromises).then(() => {
          setQuiz(selectedQuiz);
          setLoading(false);
          setTimeout(() => setShowModal(false), 1800); // Show modal for 3 seconds
        });
      })
      .catch((error) => console.error("Error fetching the JSON data:", error));
  }, [user, navigate]);

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleGoToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedOptions).length === quiz.length) {
      setShowResults(true);
      // sendScoreToServer();
    }
  };

  const calculateResults = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedOptions[index] === q.answer) {
        score++;
      }
      console.log(score);
    });
    return score;
  };

  // const sendScoreToServer = () => {
  //   const score = calculateResults();
  //   client.send(JSON.stringify({ type: 'score', value: score, name: user.name, std: user.std, appName: '12th Physics Quiz' }));
  // };

  return (
    <div className="quiz-container">
      {loading ? (
        <div className="splash-screen">
          <h2>Loading Quiz...</h2>
        </div>
      ) : showModal ? (
        <div className="modal">
          <h2>Get Ready for the Test!</h2>

          <p>{user.name}</p>
          <p>Std: {user.std}</p>
        </div>
      ) : !showResults ? (
        <div className="quiz-box-container">
          <div className="question-section">
            <div className="questionfirst">
              <h2>Question {currentQuestion + 1}</h2>
              <img
                src={quiz[currentQuestion].question}
                alt="question"
                className="questionimg"
              />
              {quiz[currentQuestion].image && (
                <span className="contentimage">
                  <img src={quiz[currentQuestion].image} alt="image" />
                </span>
              )}
            </div>
            <div className="questionhalf">
              <ul
                className={`options-list ${
                  quiz[currentQuestion].layout === "grid" ? "grid" : "grid"
                }`}
              >
                {quiz[currentQuestion].options.map((option, i) => (
                  <li
                    key={i}
                    className={`option-item ${
                      selectedOptions[currentQuestion] === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(currentQuestion, option)}
                  >
                    <img src={option} alt="option" />
                  </li>
                ))}
              </ul>
              <div className="navigation-buttons">
                {currentQuestion < quiz.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedOptions[currentQuestion] === undefined}
                  >
                    Next Question
                  </button>
                )}
                {currentQuestion === quiz.length - 1 && (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedOptions).length < quiz.length}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="d_n-container">
            <div className="dashboard">
              <h1>12th Physics Objectives Test</h1>
              <p>{user.name}</p>
              <p>{user.std}</p>
              <p>{user.idno}</p>
            </div>
            <div className="question-navigation">
              {quiz.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleGoToQuestion(index)}
                  className={
                    currentQuestion === index
                      ? "current-question"
                      : selectedOptions[index] !== undefined
                      ? "answered-question"
                      : "not-answered-question"
                  }
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <div className="results-details">
            <h1>Correct Answers</h1>
            {quiz.map((q, index) => (
              <div key={index} className="result-item">
                <h4>Question {index + 1}</h4>
                <img
                  src={q.question}
                  alt="question"
                  className="resultquestion"
                />
                <span className="resultsubs">
                  <p>
                    Your Answer:
                    <img src={selectedOptions[index]} alt="selected option" />
                    {selectedOptions[index] === q.answer ? (
                      <span className="correct">&#10004;</span>
                    ) : (
                      <span className="incorrect">&#10008;</span>
                    )}
                  </p>
                  {selectedOptions[index] !== q.answer && (
                    <p>
                      Correct Answer:
                      <img src={q.answer} alt="correct option" />
                      <span className="correct">&#10004;</span>
                    </p>
                  )}
                </span>
              </div>
            ))}
          </div>
          <span className="resultbox">
            <h2>Quiz Results</h2>
            <div className="results-summary">
              <h3>Your Score: </h3>
              <span className="animated-score">
                <CountUp
                  start={0}
                  end={calculateResults()}
                  delay={0.5}
                  duration={2}
                >
                  {({ countUpRef }) => (
                    <div>
                      <span ref={countUpRef} />
                    </div>
                  )}
                </CountUp>{" "}
                <p className="linethoeu"></p> {quiz.length}
              </span>
            </div>
          </span>
        </div>
      )}
    </div>
  );
};

export default Quiz;
