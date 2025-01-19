import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import PlanningPage from './Pages/PlanningPage.jsx'
import LocationPage from './Pages/LocationPage.jsx';
import HomePage from './Pages/HomePage.jsx'
import GraphPage from './Pages/GraphPage.jsx';
const googleApiKey = ""; // Replace with your actual API key

const App = () => {
  return (
    <LoadScript googleMapsApiKey={googleApiKey} libraries={["places"]}>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path="plan" element={<PlanningPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </Router>
    </LoadScript>
  );
};

export default App;
