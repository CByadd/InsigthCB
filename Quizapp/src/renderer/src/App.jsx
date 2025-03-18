import { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";

import "./styles/App.css";
import "./styles/login.css";
import "./styles/quiz-box.css";
import "./styles/quiz-result.css";
import NotAllowed from "./pages/noAllowed.jsx";

import TamilChapterwise from "./pages/Tamil/TamilChapterwise.jsx";
import PhyChapterwise from "./pages/Physics/PhyChapterwise.jsx";
import Physicsv1 from "./pages/Physics/Physicsv1.jsx";
import Physicsv2 from './pages/Physics/Physicsv2';
import PhysicsRandom from "./pages/Physics/PhysicsRandom.jsx";
import TamilFull from "./pages/Tamil/TamilFull.jsx";
import TamilRandom from "./pages/Tamil/TamilRandom.jsx";
import CommerceChapterwise from "./pages/Commerce/CommerceChapterwise.jsx";
import CommerceFull from "./pages/Commerce/CommerceFull.jsx";
import CommerceRandom from './pages/Commerce/CommerceRandom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div className="containerzzzz">
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/quizvolume1" element={<Quizpagev1 />} />
            <Route path="/quizvolume2" element={<Quizpagev2 />} />
            <Route path="/" element={<Quizpagev2/>} />
            <Route path="/quizboxpro" element={<Quizpro />} /> */}
            <Route path="/not-allowed" element={<NotAllowed />} />
           
            <Route path="/tamilchapterwise" element={<TamilChapterwise/>} />
            <Route path="/tamilfullportion" element={<TamilFull/>} />
            <Route path="/tamilrandom" element={<TamilRandom/>} />


            <Route path="/phychapterwise" element={<PhyChapterwise/>} />
            <Route path="/phy-volume-1" element={<Physicsv1/>} />
            <Route path="/phy-volume-2" element={<Physicsv2/>} />
            <Route path="/phy-random" element={<PhysicsRandom/>} />


            
            <Route path="/commercechapterwise" element={<CommerceChapterwise/>} />
            <Route path="/commercefullportion" element={<CommerceFull/>} />
            <Route path="/commercerandom" element={<CommerceRandom/>} />





          </Routes>

        </div>
      </Router>
    </>
  );
}

export default App;
