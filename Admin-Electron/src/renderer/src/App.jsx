import { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import RouteComponent from './pages/route.jsx';
import Tamiladmin from "./pages/Tamil/tamiladmin.jsx";
import Phyadmin from './pages/Physics/phyadmin';
import Commerceadmin from "./pages/Commerce/Commerceadmin.jsx";
import UD from './UD.jsx';


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
            <Route path="/Com" element={<Commerceadmin/>} />
            <Route path="/UD" element={<UD/>} />
            
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
