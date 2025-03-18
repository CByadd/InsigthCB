import React from "react";
import { useNavigate } from "react-router-dom";

import { Vortex } from "../components/Vortex.tsx";

const RouteComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="route_container">
    <Vortex
       backgroundColor="black"
       rangeY={800}
       particleCount={500}
       baseHue={120}
        className="vortex_background" // Apply the background class here
      />
      <span className="button_container">
      <button onClick={() => navigate('/Tamil')}>Tamil</button>
      <button onClick={() => navigate('/Phy')}>Physics</button>
      <button onClick={() => navigate('/Com')}>Commerce</button>
      <button onClick={() => navigate('/UD')}>Chemistry</button>
      <button onClick={() => navigate('/UD')}>Maths</button>
      <button onClick={() => navigate('/UD')}>Biology</button>
      <button onClick={() => navigate('/UD')}>English</button>
      </span>
    </div>
  );
};

export default RouteComponent;
