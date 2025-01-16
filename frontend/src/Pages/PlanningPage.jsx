import React, { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";

import "./PlanningPage.css";

const PlanningPage = () => {
  // State to store the source, destination, and places to visit
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // geo code api for places suggestion
  const geocodeApiKey = "178534141383445268092x66016"; // Replace with your actual API key


  // Handle changes in the source, destination, and new place input fields
  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleNewPlaceChange = async (e) => {
    const inputValue = e.target.value;
    setNewPlace(inputValue);

    if (inputValue.length > 2) {
      try {
        const response = await axios.get(
          `https://geocode.xyz/${inputValue}?json=1&key=${geocodeApiKey}`
        );

        // Check for matches and handle empty responses
        if (response.data && response.data.matches && response.data.matches.length > 0) {
          const filteredSuggestions = response.data.matches.map((match) => match.formatted);
          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]); // Clear if no matches are found
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        setSuggestions([]); // Clear suggestions on error
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is too short
    }
  };

  // Add the new place to the list of places, avoiding duplicates
  const addPlace = (place) => {
    if (place && !places.includes(place)) {
      setPlaces((prevPlaces) => [...prevPlaces, place]);
      setNewPlace(""); // Clear the input after adding the place
      setSuggestions([]); // Clear the suggestions
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!source || !destination || places == 0){
        alert("Please fill in all field are required and add atleast one place to visit .")
        return;
    }
    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Places to Visit:", places);


    navigate("/location",{
        state:{source,destination,places},
    });
  };

  return (
    <div className="planning-container">
      <h1>Plan Your Trip</h1>
      <form onSubmit={handleSubmit} className="planning-form">
        <div className="form-group">
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={handleSourceChange}
            placeholder="Enter source (e.g., New York)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter destination (e.g., Paris)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="places">Places to Visit</label>
          <div className="places-container">
            <input
              type="text"
              id="newPlace"
              value={newPlace}
              onChange={handleNewPlaceChange}
              placeholder="Start typing a place (e.g., Eiffel Tower)"
            />
            <ul className="suggestions-list">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  onClick={() => addPlace(place)} // Use addPlace to add the clicked suggestion
                  className="suggestion-item"
                >
                  {place}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => addPlace(newPlace)} className="add-place-btn">
              Add Place
            </button>
          </div>
          <ul className="places-list">
            {places.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </div>
        <button type="submit" className="submit-btn">
          Submit Plan
        </button>
      </form>
    </div>
  );
};

export default PlanningPage;
