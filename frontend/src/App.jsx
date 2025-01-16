// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx"; // Import the HomePage component
import PlanningPage from "./Pages/PlanningPage.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/plan" element={<PlanningPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
