// ScoresPage.js
import React from "react";
import { FaDownload } from "react-icons/fa";
import xcel from "/excel.png";
import * as XLSX from "xlsx";

function ScoresPage({ scores, downloadScores }) {
  return (
    <div className="score-page">
      <button className="download-button" onClick={downloadScores}>
        <FaDownload className="download-icon" />
        <p>Download Marks</p>
        <img src={xcel} alt="excel" />
      </button>

      <p className="tdeatails">
        <span>Total Marks Registered:</span>
        <span className="tscore"> {scores.length}</span>
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

export default ScoresPage;
