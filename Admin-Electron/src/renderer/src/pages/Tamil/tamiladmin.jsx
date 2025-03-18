import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload, FaChevronDown, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import xcel from "../../excel.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SERVER_IP} from '../../server-config';



let socket;

function Tamiladmin() {
  const [scores, setScores] = useState([]);
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Select");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState([""]);
  const [totalQuizLength, setTotalQuizLength] = useState(0);
  const [registeredIDs, setRegisteredIDs] = useState(new Set()); // Track IDs that have already submitted marks
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false); // Toggle for blocking functionality

  useEffect(() => {
    
   

    socket = new WebSocket(`ws://${SERVER_IP}:8080`);
    socket.addEventListener("open", () => {
      console.log("WebSocket Client Connected");
      socket.send(JSON.stringify({ appName: "admin" }));
    });
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket score data:", data);
      if (data.type === "score") {
        handleNewScore(data);
      } else if (data.type === "quizLength") {
        setTotalQuizLength(data.quizLength);
      }
    });
    return () => {
      if (socket) socket.close();
    };
  }, [registeredIDs, isBlockingEnabled]);

  const handleNewScore = (data) => {
    if (isBlockingEnabled && registeredIDs.has(data.name)) {
      console.log(`Score from ${data.name} is blocked.`);
      return; // Block the score if it's already been registered
    }
    setScores((prevScores) => [...prevScores, data]);
    setRegisteredIDs((prev) => new Set(prev).add(data.name)); // Add ID to registered set
  };

  const toggleLogin = () => {
    setIsLoginEnabled((prev) => {
      const newStatus = !prev;
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: "loginControl", isEnabled: newStatus })
        );
        toast.success(`Login ${newStatus ? 'enabled' : 'disabled'} successfully!`);
      }
      
      return newStatus;
    });
    
  };

  const toggleBlocking = () => {
    setIsBlockingEnabled((prev) => {
      const newStatus = !prev;
      toast.success(`ID Blocking ${newStatus ? 'enabled' : 'disabled'} successfully!`);
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
      toast.success("Chapters submitted successfully!");
    }
  };

  return (
    <div className="maincontainer">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
        className={"custom-body"} 
      />
      <div className="navbar">
        <h1>Tamil Admin App</h1>
        <div className="controls">
        <button onClick={toggleLogin} className="control-button">
          {isLoginEnabled ? <FaUserAltSlash /> : <FaUserAlt />}
          {isLoginEnabled ? " Disable Login" : " Enable Login"}
        </button>

        <button onClick={toggleBlocking} className="control-button">
          {isBlockingEnabled ? " Disable ID Blocking" : " Enable ID Blocking"}
        </button>

        <div className="custom-dropdown">
          <div className="dropdown-header" onClick={toggleDropdown}>
            <span>
              {selectedOption === "$" ? "select" : selectedOption}
            </span>
            <FaChevronDown
              className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
            />
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => changeOption("Tamil Public Pattern")}>Tamil Public Pattern</li>
              <li onClick={() => changeOption("Tamil Chapterwise")}>Tamil Chapterwise</li>
              <li onClick={() => changeOption("Tamil Full Portion")}>Tamil Full Portion</li>
            </ul>
          )}
        </div>
      </div>
     
      </div>
    
      <div className="mainbody">
      {selectedOption === "Tamil Chapterwise" && (
        <div className="ChapSelectorSection">
          <section className="chapselectors">
            {["chapter-1", "chapter-2", "chapter-3", "chapter-4", "chapter-5"].map((chapter) => (
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
              {selectedChapters.length > 0 ? selectedChapters.join("|") : "No chapters selected"}
            </p>
            <button onClick={handleSubmitChapters}>Submit</button>
          </span>
        </div>
      )}

    <div className="detailscontainer">
    <p className="tdeatails">
        <span>Total Marks Registered:</span>
        <span className="tscore"> {scores.length}</span>
      </p>
      <button className="download-button" onClick={downloadScores}>
          <FaDownload className="download-icon" />
          <p>Download Marks</p>
          <img src={xcel} alt="excel" />
        </button>
    </div>
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
      
    </div>
  );
}

export default Tamiladmin;
