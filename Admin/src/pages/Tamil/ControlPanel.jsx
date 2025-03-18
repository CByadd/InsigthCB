// ControlPanel.js
import React from "react";
import { FaDownload, FaChevronDown, FaUserAlt, FaUserAltSlash } from "react-icons/fa";

function ControlPanel({ 
  toggleLogin, 
  isLoginEnabled, 
  toggleBlocking, 
  isBlockingEnabled, 
  selectedOption, 
  changeOption, 
  isDropdownOpen, 
  toggleDropdown, 
  selectedChapters, 
  toggleChapterSelection, 
  handleSubmitChapters 
}) {
  return (
    <div className="controls">
      <button onClick={toggleLogin} className="control-button">
        {isLoginEnabled ? "Disable Login" : "Enable Login"}
      </button>

      <button onClick={toggleBlocking} className="control-button">
        {isBlockingEnabled ? "Disable ID Blocking" : "Enable ID Blocking"}
      </button>

      <div className="custom-dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          <span>{selectedOption === "Select" ? "Select" : selectedOption}</span>
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
              {selectedChapters.length > 0 ? selectedChapters.join(", ") : "No chapters selected"}
            </p>
            <button onClick={handleSubmitChapters}>Submit</button>
          </span>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
