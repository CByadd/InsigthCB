import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload, FaChevronDown, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import xcel from "./excel.png";

const SERVER_IP = "ws://192.168.43.26:8080";
let socket;

function Admin() {
  const [scores, setScores] = useState([]);
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState("random");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState(["chapter-1"]);
  const [totalQuizLength, setTotalQuizLength] = useState(0);

  useEffect(() => {
    socket = new WebSocket(SERVER_IP);
    socket.addEventListener("open", () => {
      console.log("WebSocket Client Connected");
      socket.send(JSON.stringify({ appName: "admin" }));
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket score data:", data);
      if (data.type === "score") {
        setScores((prevScores) => [...prevScores, data]);
      } else if (data.type === "quizLength") {
        setTotalQuizLength(data.quizLength);
      }
    });
    return () => {
      if (socket) socket.close();
    };
  }, []);

  const toggleLogin = () => {
    setIsLoginEnabled((prev) => {
      const newStatus = !prev;
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: "loginControl", isEnabled: newStatus })
        );
      }
      return newStatus;
    });
  };

  const changeOption = (option) => {
    setSelectedOption(option);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "optionSelect", option }));
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const downloadScores = () => {
    const worksheet = XLSX.utils.json_to_sheet(scores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    XLSX.writeFile(workbook, "Marks.xlsx");
  };

  const toggleChapterSelection = (chapter) => {
    setSelectedChapters((prevSelected) => {
      if (prevSelected.includes(chapter)) {
        return prevSelected.filter((ch) => ch !== chapter);
      } else {
        return [...prevSelected, chapter];
      }
    });
  };

  const handleSubmitChapters = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({ type: "chapterSelection", chapters: selectedChapters })
      );
    }
  };

  return (
    <div className="maincontainer">
      <div className="navbar">
        <h1>Admin App</h1>
        <button className="download-button" onClick={downloadScores}>
          <FaDownload className="download-icon" />
          <p>Download Marks</p>
          <img src={xcel} alt="excel" />
        </button>
      </div>

      <section className="chapselectors">
        {["chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5", "chapter-6", "chapter-7", "chapter-8", "chapter-9", "chapter-10"].map((chapter) => (
          <button
            key={chapter}
            onClick={() => toggleChapterSelection(chapter)}
            className={selectedChapters.includes(chapter) ? "selected" : ""}
          >
            {chapter}
          </button>
        ))}
      </section>

      <span className="chapcon">
        <p className="selectedchap">
          {selectedChapters.length > 0 ? selectedChapters.join(", ") : "No chapters selected"}
        </p>
        <button onClick={handleSubmitChapters}>Submit</button>
      </span>

      <div className="controls">
        <button onClick={toggleLogin} className="control-button">
          {isLoginEnabled ? <FaUserAltSlash /> : <FaUserAlt />}
          {isLoginEnabled ? " Disable Login" : " Enable Login"}
        </button>

        <div className="custom-dropdown">
          <div className="dropdown-header" onClick={toggleDropdown}>
            <span>
              {selectedOption === "random" ? "Commerce" : selectedOption}
            </span>
            <FaChevronDown
              className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
            />
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => changeOption("random")}>Commerce</li>
              <li onClick={() => changeOption("தமிழ்")}>தமிழ்</li>
              <li onClick={() => changeOption("Maths")}>Maths</li>
            </ul>
          )}
        </div>
      </div>

      <p className="tdeatails">
        <span>Total Marks Registered:</span>
        <span className="tscore"> {scores.length}</span>
      </p>

      <p className="tdeatails">
        <span>Total Quiz Length:</span>
        <span className="tscore"> {totalQuizLength}</span>
      </p>

      <ul className="score-container">
        {scores.map((score, index) => (
          <li key={index} className="detailsbox">
            <h4>{score.appName}</h4>
            <p className="name-box">
              {score.name} <span>{score.std}</span>
            </p>
            <p className="mark">
              <a>{score.value}</a>
              /
              <span>{score.total}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
