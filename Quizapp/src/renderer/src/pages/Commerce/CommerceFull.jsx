import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CountUp from "react-countup";
import { RxCrossCircled } from "react-icons/rx";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import newData from './../../json/newdata.json';
import {SERVER_IP} from '../../server-config';

let socket;
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateQuiz = (chapters) => {
  let allQuestions = [];
  let usedQuestions = new Set();

  chapters.forEach((chapter) => {
    let chapterQuestions = chapter.questions;
    shuffleArray(chapterQuestions);

    chapterQuestions.forEach((q) => {
      if (!usedQuestions.has(q.question)) {
        allQuestions.push(q);
        usedQuestions.add(q.question);
      }
    });
  });

  shuffleArray(allQuestions); // Shuffle all questions after combining them

  return allQuestions;
};

const CommerceFull = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const settings = async () => {
      try {
        const setting = await fetch(`http://${SERVER_IP}:8080/admin_settings`)
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

  const [showModal, setShowModal] = useState(true);
  const [scoreSent, setScoreSent] = useState(false); 
  const [isConnected, setIsConnected] = useState(true); 

  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const [socket, setSocket] = useState(null);

  const [score, setScore] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`ws://${SERVER_IP}:8080`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket Client Connected");
      setIsConnected(true);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'app', appName: 'Quiz App' }));
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Client Disconnected");
      setIsConnected(false);
      setTimeout(() => {
        const reconnectWs = new WebSocket(`ws://${SERVER_IP}:8080`);
        setSocket(reconnectWs);
      }, 3000); 
    };

    if (!user) {
      navigate("/");
      return;
    }

    const chapters = newData.chapters;
    const selectedQuiz = generateQuiz(chapters);

    setQuiz(selectedQuiz);
    setLoading(false);
    setTimeout(() => setShowModal(false), 1800); 

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [user, navigate]);

  const handleOptionClick = (questionIndex, option) => {
    if (!isConnected) return; 
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (!isConnected) return; 
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleShowResults = () => {
    if (!isConnected || scoreSent) return; 
    if (Object.keys(selectedOptions).length === quiz.length) {
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
    return score;
  };

  const sendScoreToServer = (scry) => {
    if (socket && socket.readyState === WebSocket.OPEN && !scoreSent) {
      socket.send(
        JSON.stringify({
          type: "score",
          value: scry,
          name: user.name,
          std: user.std,
          appName: "Commerce Full Portion",
          totalq: quiz.length
        })
      );
      setScoreSent(true);
    }
  };
  return (
    <div className="quiz-container">
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
              className={`questionhalf ${
                quiz[currentQuestion]?.option_mode === "image" ? "image-mode" : ""
              } ${
                quiz[currentQuestion]?.option_mode === "imagey" ? "imageY-mode" : ""
              } ${
                quiz[currentQuestion]?.option_mode === "images" ? "imageS-mode" : ""
              }`}
            >
              <ul
                className={`options-list ${
                  quiz[currentQuestion]?.option_mode === "image" ? "image-mode" : ""
                } ${
                  quiz[currentQuestion]?.option_mode === "imagey" ? "imageY-mode" : ""
                } ${
                  quiz[currentQuestion]?.option_mode === "images" ? "imageS-mode" : ""
                }${
                  quiz[currentQuestion]?.option_mode === "imagez" ? "imageZ-mode" : ""
                }`}
              >
                {quiz[currentQuestion]?.options.map((option, i) => (
                  <li
                    key={i}
                    className={`option-item ${
                      selectedOptions[currentQuestion] === option ? "selected" : ""
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
              <h1>Commerce Full portion Test</h1>
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
        <h4>Question - {index + 1}</h4>
        {/* Display the question as text instead of an image */}
        <p className="result-question">{q.question}</p>

        <span
          className={`resultsubs ${
            q.option_mode === "image" ? "option-itemX" : ""
          }${q.option_mode === "imagey" ? "option-itemY" : ""}${
            q.option_mode === "images" ? "option-itemS" : ""
          }${q.option_mode === "imagez" ? "option-itemZ" : ""}`}
        >
          <p className="ya-box">
            <a className="answerQuery">YA:</a>
            {/* Display the selected option as text instead of an image */}
            <span className={`result-option ${selectedOptions[index] === q.answer ? "correct" : "incorrect"}`}>
              {selectedOptions[index]}
            </span>
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
              {/* Display the correct option as text instead of an image */}
              <span className={`result-option ${
                q.option_mode === "image" ? "option-itemX" : ""
              } ${q.option_mode === "imagey" ? "option-itemY" : ""}${
                q.option_mode === "images" ? "option-itemS" : ""
              }`}>
                {q.answer}
              </span>
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
    </div>
  );
};

export default CommerceFull;
