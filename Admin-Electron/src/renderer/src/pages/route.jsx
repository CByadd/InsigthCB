import React from "react";
import { Link } from "react-router-dom";

import { Vortex } from "../components/Vortex.tsx";

const RouteComponent = () => {
  return (
    <div className="route_container">
      <Vortex
        backgroundColor="black"
        rangeY={100}
        particleCount={500}
        baseHue={300}
        className="vortex_background"
      />
      <span className="button_container">
        <Link to="/Tamil">
          <button>Tamil</button>
        </Link>
        <Link to="/Phy">
          <button>Physics</button>
        </Link>
        <Link to="/Com">
          <button>Commerce</button>
        </Link>
        <Link to="/UD">
          <button>Chemistry</button>
        </Link>
        <Link to="/UD">
          <button>Maths</button>
        </Link>
        <Link to="/UD">
          <button>Biology</button>
        </Link>
        <Link to="/UD">
          <button>English</button>
        </Link>
      </span>
    </div>
  );
};

export default RouteComponent;
