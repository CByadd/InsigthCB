import { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import RouteComponent from './pages/route.jsx';
import Tamiladmin from "./pages/Tamil/tamiladmin.jsx";
import Phyadmin from './pages/Physics/phyadmin';
import Chemadmin from './pages/Chemistry/chemadmin';
import Mathadmin from './pages/Maths/mathadmin';
import Bioadmin from './pages/Biology/Bioadmin';
import Engadmin from './pages/English/engadmin';
import Commerceadmin from "./pages/Commerce/Commerceadmin.jsx";
import UD from './UD.jsx';
import ControlPanel from "./pages/Tamil/ControlPanel.jsx";
import ScoresPage from "./pages/Tamil/ScoresPage.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<RouteComponent/>} />
            <Route path="/Tamil" element={<Tamiladmin/>} />
            <Route path="/Phy" element={<Phyadmin/>} />
            <Route path="/Chem" element={<Chemadmin/>} />
            <Route path="/Math" element={<Mathadmin/>} />
            <Route path="/Bio" element={<Bioadmin/>} />
            <Route path="/Eng" element={<Engadmin/>} />
            <Route path="/Com" element={<Commerceadmin/>} />
            <Route path="/UD" element={<UD/>} />
            <Route path="/control-panel" element={<ControlPanel/>} />
            <Route path="/scores" element={<ScoresPage/>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
