import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CountUp from "react-countup";
import { RxCrossCircled } from "react-icons/rx";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
// import newData from './Mathsv2Questions.json';
import q10 from './../Mathsv2/q10.png';
import q10a1 from './../Mathsv2/q10 (1).png';
import q10a2 from './../Mathsv2/q10 (2).png';
import q10a3 from './../Mathsv2/q10 (3).png';
import q10a4 from './../Mathsv2/q10 (4).png';

import q11 from './../Mathsv2/q11.png';
import q11a1 from './../Mathsv2/q11 (1).png';
import q11a2 from './../Mathsv2/q11 (2).png';
import q11a3 from './../Mathsv2/q11 (3).png';
import q11a4 from './../Mathsv2/q11 (4).png';

import q12 from './../Mathsv2/q12.png';
import q12a1 from './../Mathsv2/q12 (1).png';
import q12a2 from './../Mathsv2/q12 (2).png';
import q12a3 from './../Mathsv2/q12 (3).png';
import q12a4 from './../Mathsv2/q12 (4).png';

import q9 from './../Mathsv2/q9.png';
import q9a1 from './../Mathsv2/q9 (1).png';
import q9a2 from './../Mathsv2/q9 (2).png';
import q9a3 from './../Mathsv2/q9 (3).png';
import q9a4 from './../Mathsv2/q9 (4).png';

import q8 from './../Mathsv2/q8.png';
import q8a1 from './../Mathsv2/q8 (1).png';
import q8a2 from './../Mathsv2/q8 (2).png';
import q8a3 from './../Mathsv2/q8 (3).png';
import q8a4 from './../Mathsv2/q8 (4).png';

import q7 from './../Mathsv2/q7.png';
import q7a1 from './../Mathsv2/q7 (1).png';
import q7a2 from './../Mathsv2/q7 (2).png';
import q7a3 from './../Mathsv2/q7 (3).png';
import q7a4 from './../Mathsv2/q7 (4).png';

import q6 from './../Mathsv2/q6.png';
import q6a1 from './../Mathsv2/q6 (1).png';
import q6a2 from './../Mathsv2/q6 (2).png';
import q6a3 from './../Mathsv2/q6 (3).png';
import q6a4 from './../Mathsv2/q6 (4).png';

import q5 from './../Mathsv2/q5.png';
import q5a1 from './../Mathsv2/q5 (1).png';
import q5a2 from './../Mathsv2/q5 (2).png';
import q5a3 from './../Mathsv2/q5 (3).png';
import q5a4 from './../Mathsv2/q5 (4).png';

import q4 from './../Mathsv2/q4.png';
import q4a1 from './../Mathsv2/q4 (1).png';
import q4a2 from './../Mathsv2/q4 (2).png';
import q4a3 from './../Mathsv2/q4 (3).png';
import q4a4 from './../Mathsv2/q4 (4).png';

import q3 from './../Mathsv2/q3.png';
import q3a1 from './../Mathsv2/q3 (1).png';
import q3a2 from './../Mathsv2/q3 (2).png';
import q3a3 from './../Mathsv2/q3 (3).png';
import q3a4 from './../Mathsv2/q3 (4).png';

import q2 from './../Mathsv2/q2.png';
import q2a1 from './../Mathsv2/q2 (1).png';
import q2a2 from './../Mathsv2/q2 (2).png';
import q2a3 from './../Mathsv2/q2 (3).png';
import q2a4 from './../Mathsv2/q2 (4).png';

import q1 from './../Mathsv2/q1.png';
import q1a1 from './../Mathsv2/q1 (1).png';
import q1a2 from './../Mathsv2/q1 (2).png';
import q1a3 from './../Mathsv2/q1 (3).png';
import q1a4 from './../Mathsv2/q1 (4).png';
import Loading from "../components/Loading";



const SERVER_IP = "192.168.43.26";
let socket = new WebSocket(`ws://${SERVER_IP}:8080`);


const chapters = [
  {
    chapter: "chapter-1",
    questions: [
      {
        question: q1,
        options: [q1a1, , q1a2, q1a3, q1a4],
        answer: q1a2,
        option_mode: "images"
      },
    ],
  },
  {
    chapter: "chapter-2",
    questions: [
      {
        question: q2,
        options: [q2a1, q2a2, q2a3, q2a4],
        answer: q2a2,
        option_mode: "images"
      },
    ],
  },
  {
    chapter: "chapter-3",
    questions: [
      {
        question: q3,
        options: [q3a1, , q3a2, q3a3, q3a4],
        answer: q3a2,
        option_mode: "imagey"
      },
    ],
  },
  {
    chapter: "chapter-4",
    questions: [
      {
        question: q4,
        options: [q4a1, , q4a2, q4a3, q4a4],
        answer: q4a2,
        // option_mode:"imagey"
      },
    ],
  },
  {
    chapter: "chapter-5",
    questions: [
      {
        question: q5,
        options: [q5a1, , q5a2, q5a3, q5a4],
        answer: q5a2,
        option_mode: "imagey"
      },
    ],
  },
  {
    chapter: "chapter-6",
    questions: [
      {
        question: q6,
        options: [q6a1, , q6a2, q6a3, q6a4],
        answer: q6a2,
        option_mode: "imagey"
      },
    ],
  },
  {
    chapter: "chapter-7",
    questions: [
      {
        question: q7,
        options: [q7a1, , q7a2, q7a3, q7a4],
        answer: q7a2,
        option_mode: "imagey"
      },
    ],
  },
  {
    chapter: "chapter-8",
    questions: [
      {
        question: q8,
        options: [q8a1, , q8a2, q8a3, q8a4],
        answer: q8a2,
        option_mode: "imagey"
      },
    ],
  },
  {
    chapter: "chapter-9",
    questions: [
      {
        question: q9,
        options: [q9a1, , q9a2, q9a3, q9a4],
        answer: q9a2,
        option_mode: "imagey"

      },
    ],
  },
  {
    chapter: "chapter-10",
    questions: [
      {
        question: q10,
        options: [q10a1, q10a2, q10a3, q10a4],
        answer: q10a2,
        option_mode: "imagey"
      },
    ],
  },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateQuiz = (questions) => {
  console.log("questions under the quesetion", questions)
  // let selectedQuestions = [];
  // let usedQuestions = new Set();
  // let chapterCounts = Array(chapters.length).fill(0);
  // const maxQuestionsPerChapter = 2;
  // const totalQuestions = 10;

  // while (selectedQuestions.length < totalQuestions) {
  //   let chapterIndex = Math.floor(Math.random() * chapters.length);
  //   if (chapterCounts[chapterIndex] < maxQuestionsPerChapter) {
  //     let chapterQuestions = chapters[chapterIndex].questions;
  shuffleArray(questions);

  //   let selected = chapterQuestions.find(
  //     (q) => !usedQuestions.has(q.question)
  //   );
  //   if (selected) {
  //     selectedQuestions.push(selected);
  //     usedQuestions.add(selected.question);
  //     chapterCounts[chapterIndex]++;
  //   }
  // }
  return questions
};

const Quizpagev2 = () => {

  const navigate = useNavigate();
  const [selectedChapters, setSelectedChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const settings = async () => {
      try {
        const setting = await fetch("http://192.168.43.26:8080/admin_settings")
        const data = await setting.json()
        setSelectedChapters(data.chapters_selected)
        if (!data.allow_access) {
          navigate("/not-allowed")
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    settings()
  }, [])

  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [scoreSent, setScoreSent] = useState(false); // State to track score submission
  const [isConnected, setIsConnected] = useState(true); // State to track WebSocket connection
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const [score, setScore] = useState(0);
  useEffect(() => {
    let socket = new WebSocket(`ws://${SERVER_IP}:8080`);

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'app', appName: 'Quiz App' }));
    };

    socket.onclose = () => {
      console.log("WebSocket Client Disconnected");
      setIsConnected(false);
      setTimeout(() => {
        socket = new WebSocket(`ws://${SERVER_IP}:8080`);
      }, 3000);
    };

    if (!user) {
      navigate("/");
      return;
    }

    const selectedChaptersData = chapters.
      filter((chapter) => selectedChapters.includes(chapter.chapter)).map((chapter) => chapter.questions).flat()
    // console.log("selectedCharts",selectedChaptersData)
    const selectedQuiz = generateQuiz(selectedChaptersData);
    console.log("selectedQuiz", selectedChaptersData, selectedChapters)

    setQuiz(selectedQuiz);
    setTimeout(() => setShowModal(false), 2200); // Show modal for 1.8 seconds

  }, [loading]);


  const handleOptionSelect = (questionIndex, option) => {
    if (!isConnected) return;
    console.log("Selected option:", option); // Debug log
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (!isConnected) return;
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleGoToQuestion = (questionIndex) => {
    if (!isConnected) return;
    setCurrentQuestion(questionIndex);
  };

  const handleSubmitQuiz = () => {
    if (!isConnected || scoreSent) return;
    if (Object.keys(selectedOptions).length === quiz.length) {
      console.log("Quiz submitted with selected options:", selectedOptions);
      setShowResults(true);
      let scry = calculateResults();
      setScore(scry);
      sendScoreToServer(scry);
    }
  };




  const calculateResults = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      if (selectedOptions[index] === q.answer) {
        score++;
      }
    });
    console.log("Calculated score:", score);

    return score;
  };

  const sendScoreToServer = (scry) => {
    if (!scoreSent) {
      socket.send(
        JSON.stringify({
          type: "score",
          value: scry,
          name: user.name,
          std: user.std,
          appName: "Mathsv2",
        })
      );
    }
  };




  return (
    <>
      {loading ? <Loading /> : <div className="quiz-container">
        {loading ? (
          <div className="splash-screen">
            <h2>Loading Quiz...</h2>
          </div>
        ) : showModal ? (
          <div className="modal">
            <h2>Get Ready for the Mathsv2 Test!</h2>
            <p className="userinfo">{user.name}</p>
            <p className="userinfo">Std: {user.std}</p>
            <span>
              <p>YA: = Your Answer</p>
              <p>CA: = Correct Answer</p>
            </span>
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
              <div
                className={`questionhalf ${quiz[currentQuestion].option_mode === "image"
                  ? "image-mode"
                  : ""
                  } ${quiz[currentQuestion].option_mode === "imagey"
                    ? "imageY-mode"
                    : ""
                  } ${quiz[currentQuestion].option_mode === "images"
                    ? "imageS-mode"
                    : ""
                  }`}
              >
                <ul
                  className={`options-list ${quiz[currentQuestion].option_mode === "image"
                    ? "image-mode"
                    : ""
                    } ${quiz[currentQuestion].option_mode === "imagey"
                      ? "imageY-mode"
                      : ""
                    } ${quiz[currentQuestion].option_mode === "images"
                      ? "imageS-mode"
                      : ""
                    }${quiz[currentQuestion].option_mode === "imagez"
                      ? "imageZ-mode"
                      : ""
                    }
                `}
                >
                  {quiz[currentQuestion].options.map((option, i) => (
                    <li
                      key={i}
                      className={`option-item ${quiz[currentQuestion].option_mode === "image"
                        ? "option-itemX"
                        : ""
                        } ${quiz[currentQuestion].option_mode === "imagey"
                          ? "option-itemY"
                          : ""
                        }${quiz[currentQuestion].option_mode === "images"
                          ? "option-itemS"
                          : ""
                        }${quiz[currentQuestion].option_mode === "imagez"
                          ? "option-itemZ"
                          : ""
                        }
                     ${selectedOptions[currentQuestion] === option
                          ? "selected"
                          : ""
                        }`}
                      onClick={() => handleOptionSelect(currentQuestion, option)}
                    >
                      <img
                        src={option}
                        alt="option"
                        className={`${quiz[currentQuestion].option_mode === "image"
                          ? "imageX"
                          : ""
                          } ${quiz[currentQuestion].option_mode === "imagey"
                            ? "imageY"
                            : ""
                          }${quiz[currentQuestion].option_mode === "images"
                            ? "imageS"
                            : ""
                          }${quiz[currentQuestion].option_mode === "imagez"
                            ? "imageZ"
                            : ""
                          }
                      `}
                      />
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
                <h1>Mathsv2 Objectives Test</h1>
                <span className="user_info">
                  <span className="user-image-con"><img src={user.image} alt="User" className="user-image" /></span>
                  <p>{user.name}</p>
                  <p>{user.std}</p>
                  <p>{user.idno}</p>
                </span>

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
                    disabled={!isConnected}
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
                  <h4>Question - {index + 1}</h4>
                  <img
                    src={q.question}
                    alt="question"
                    className="resultquestion"
                  />
                  <span
                    className={`resultsubs ${q.option_mode === "image" ? "option-itemX" : ""
                      }${q.option_mode === "imagey" ? "option-itemY" : ""}${q.option_mode === "images" ? "option-itemS" : ""
                      }${q.option_mode === "imagez" ? "option-itemZ" : ""}`}
                  >
                    <p className="ya-box">
                      <a className="answerQuery">YA:</a>
                      <img
                        src={selectedOptions[index]}
                        alt="selected option"
                        className={`result-option ${selectedOptions[index] === q.answer ? " " : " "
                          }`}
                      />
                      {selectedOptions[index] === q.answer ? (
                        <span className="correct">
                          <IoCheckmarkCircleOutline />
                        </span>
                      ) : (
                        <span className="incorrect">
                          <RxCrossCircled />
                        </span>
                      )}
                    </p>
                    {selectedOptions[index] !== q.answer && (
                      <p className="ca-box">
                        <a className="answerQuery">CA:</a>
                        <img
                          src={q.answer}
                          alt="correct option"
                          className={`result-option ${q.option_mode === "image" ? "option-itemX" : ""
                            } ${q.option_mode === "imagey" ? "option-itemY" : ""}${q.option_mode === "images" ? "option-itemS" : ""
                            } `}
                        />
                        <span className="correct">
                          <IoCheckmarkCircleOutline />
                        </span>
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
                  />
                  <p className="linethoeu"></p>
                  {quiz.length}
                </span>
              </div>
            </span>
          </div>

        )}
      </div>}</>

  );
};

export default Quizpagev2;
