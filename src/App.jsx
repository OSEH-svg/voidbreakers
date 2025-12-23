import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Background from "./components/Background";
import TitleLogo from "./components/TitleLogo";
import LeftMenu from "./components/LeftMenu";
import CenterCharacters from "./components/CenterCharacters";
import RightMenu from "./components/RightMenu";
import StatsShowcase from "./components/StatsShowcase";
import RotatePrompt from "./components/RotatePrompt";
import Gameplay from "./pages/Gameplay";
import StarknetProvider from "./providers/StarknetProvider";

const Home = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <RotatePrompt />
      <Background />
      <TitleLogo />
      <LeftMenu />
      <StatsShowcase />
      <CenterCharacters />
      <RightMenu />
    </div>
  );
};

function App() {
  return (
    <StarknetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameplay" element={<Gameplay />} />
        </Routes>
      </Router>
    </StarknetProvider>
  );
}

export default App;
