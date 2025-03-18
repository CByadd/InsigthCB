import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CountUp from "react-countup";
import { RxCrossCircled } from "react-icons/rx";
import Loading from "../components/Loading";

import newData from './../json/Tamilquestion.json';
const SERVER_IP = "192.168.43.26";
let socket;

const shuffleArray = (array) => {
  console.log("shuffleArray", array)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array

};

const generateQuiz = (chapter) => {
  return shuffleArray(chapter)

};

const Quizpagev1 = () => {

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
  const [scoreSent, setScoreSent] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  // const [selectedChapters, setSelectedChapters] = useState([]);
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const [score, setScore] = useState(0);

  useEffect(() => {
    socket = new WebSocket(`ws://${SERVER_IP}:8080`);

    socket.onopen = () => {
      console.log("WebSocket Client Connected");
      setIsConnected(true);
      socket.send(JSON.stringify({ type: 'app', appName: 'Quiz App' }));
    };

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "chapterSelection") {
    //     setSelectedChapters(data.chapters);
    //   }
    // };

    socket.onclose = () => {
      console.log("WebSocket Client Disconnected");
      setIsConnected(false);
      setTimeout(() => {
        socket = new WebSocket(`ws://${SERVER_IP}:8080`);
        setShowModal(false)
      }, 1000);
    };

    return () => {
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {

    const selectedChaptersData = newData.chapters
      .filter((chapter) => selectedChapters.includes(chapter.chapter)).map((chapter) => chapter.questions).flat()
    const quizQuestions = generateQuiz(selectedChaptersData);
    console.log("quiz_questions", selectedChaptersData, quizQuestions)
    setQuiz(quizQuestions);

    // if (socket.readyState === WebSocket.OPEN) {
    //   socket.send(
    //     JSON.stringify({ type: "quizLength", quizLength: quizQuestions.length })
    //   );
    // }

  }, [loading]);

  const handleOptionClick = (questionIndex, option) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prevCurrent) => prevCurrent + 1);
  };

  const handleShowResults = () => {
    setShowResults(true);
    const calculatedScore = quiz.reduce((total, question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        return total + question.marks;
      }
      return total;
    }, 0);

    setScore(calculatedScore);

    if (!scoreSent && isConnected && socket.readyState === WebSocket.OPEN) {
      const scoreData = {
        type: "score",
        appName: user.appName,
        name: user.name,
        std: user.std,
        score: calculatedScore,
        total: quiz.reduce((total, question) => total + question.marks, 0),
      };
      socket.send(JSON.stringify(scoreData));
      setScoreSent(true);
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
            <h2>Get Ready for the Test!</h2>
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
                {/* Check if quiz[currentQuestion] is defined before accessing its properties */}
                {quiz[currentQuestion] && (
                  <>
                    <p className="question-text">{quiz[currentQuestion].question}</p>
                    {quiz[currentQuestion].image && (
                      <span className="contentimage">
                        <p>{quiz[currentQuestion].image}</p>
                      </span>
                    )}
                  </>
                )}
              </div>
              <div
                className={`questionhalf ${quiz[currentQuestion]?.option_mode === "image" ? "image-mode" : ""
                  } ${quiz[currentQuestion]?.option_mode === "imagey" ? "imageY-mode" : ""
                  } ${quiz[currentQuestion]?.option_mode === "images" ? "imageS-mode" : ""
                  }`}
              >
                <ul
                  className={`options-list ${quiz[currentQuestion]?.option_mode === "image" ? "image-mode" : ""
                    } ${quiz[currentQuestion]?.option_mode === "imagey" ? "imageY-mode" : ""
                    } ${quiz[currentQuestion]?.option_mode === "images" ? "imageS-mode" : ""
                    }${quiz[currentQuestion]?.option_mode === "imagez" ? "imageZ-mode" : ""
                    }`}
                >
                  {quiz[currentQuestion]?.options.map((option, i) => (
                    <li
                      key={i}
                      className={`option-item ${selectedOptions[currentQuestion] === option ? "selected" : ""
                        }`}
                      onClick={() => handleOptionClick(currentQuestion, option)}
                    >
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>

                <div className="navigation-buttons">
                  {currentQuestion < quiz.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      disabled={
                        selectedOptions[currentQuestion] === undefined || !isConnected
                      }
                    >
                      Next Question
                    </button>
                  )}
                  {currentQuestion === quiz.length - 1 && (
                    <button
                      onClick={handleShowResults}
                      disabled={
                        Object.keys(selectedOptions).length < quiz.length || !isConnected
                      }
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="d_n-container">
              <div className="dashboard">
                <h1>Commerce Objectives Test</h1>
                <span className="user_info">
                  <span className="user-image-con"><img src={user.img} alt="User" className="user-image" /></span>
                  <p>{user.name}</p>
                  <p>{user.std}</p>
                  <p>{user.idno}</p>
                </span>
              </div>
              <div className="question-navigation">
                {quiz.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
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
                  <p className="question-result">{q.question}</p>
                  <p className="result-options">
                    <span className="selected-answer">
                      <IoCheckmarkCircleOutline /> YA:{" "}
                      {selectedOptions[index] !== undefined
                        ? selectedOptions[index]
                        : "Not Answered"}
                    </span>
                    <span className="correct-answer">
                      <RxCrossCircled /> CA: {q.correctAnswer}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <div className="scorebox">
              <div className="details">
                <h2>
                  Your final score: <CountUp end={score} />
                </h2>
                <button onClick={() => navigate("/login")}>Back to Login</button>
              </div>
            </div>
          </div>
        )}
      </div>
      }</>
  );
};

export default Quizpagev1;
