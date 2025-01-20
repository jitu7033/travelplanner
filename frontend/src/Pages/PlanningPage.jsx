import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StandaloneSearchBox } from "@react-google-maps/api";
import "./PlanningPage.css";

const PlanningPage = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const sourceRef = useRef(null);
  const destinationRef = useRef(null);
  const newPlaceRef = useRef(null);
  const navigate = useNavigate();

  const handleNewPlaceChange = (e) => {
    setNewPlace(e.target.value);
  };

  const addPlace = (place) => {
    if (place && !places.includes(place)) {
      setPlaces((prevPlaces) => [...prevPlaces, place]);
      setNewPlace("");
      setSuggestions([]);
    }
  };

  
  // remove places 
  const removePlace = (placeToRemove) => {
    setPlaces((prevPlaces) => prevPlaces.filter((place) => place !== placeToRemove));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source || !destination || places.length === 0) {
      alert("Please fill in all fields and add at least one place to visit.");
      return;
    }

    const locations = [source, ...places, destination];
    if (locations.some((loc) => !loc || loc.trim() === "")) {
      alert("Please ensure all locations are valid.");
      return;
    }

    navigate("/graph", { state: { locations } });
  };

  return (
    <div className="planning-container">
      <h1>Plan Your Trip</h1>
      <form onSubmit={handleSubmit} className="planning-form">
        <div className="form-group">
          <label htmlFor="source">Source</label>
          <StandaloneSearchBox
            onLoad={(ref) => (sourceRef.current = ref)}
            onPlacesChanged={() => {
              const places = sourceRef.current.getPlaces();
              if (places && places.length > 0) {
                setSource(places[0].formatted_address);
              }
            }}
          >
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)} // Add onChange handler
              placeholder="Enter source (e.g., New York)"
              required
            />
          </StandaloneSearchBox>
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <StandaloneSearchBox
            onLoad={(ref) => (destinationRef.current = ref)}
            onPlacesChanged={() => {
              const places = destinationRef.current.getPlaces();
              if (places && places.length > 0) {
                setDestination(places[0].formatted_address);
              }
            }}
          >
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)} // Add onChange handler
              placeholder="Enter destination (e.g., Paris)"
              required
            />
          </StandaloneSearchBox>
        </div>

        <div className="form-group">
          <label htmlFor="places">Places to Visit</label>
          <div className="places-container">
            <StandaloneSearchBox
              onLoad={(ref) => (newPlaceRef.current = ref)}
              onPlacesChanged={() => {
                const places = newPlaceRef.current.getPlaces();
                if (places && places.length > 0) {
                  const placeName = places[0].formatted_address;
                  if (!suggestions.includes(placeName)) {
                    setSuggestions((prevSuggestions) => [
                      ...prevSuggestions,
                      placeName,
                    ]);
                  }
                }
              }}
            >
              <input
                type="text"
                id="newPlace"
                value={newPlace}
                onChange={handleNewPlaceChange} // Add onChange handler
                placeholder="Start typing a place (e.g., Eiffel Tower)"
              />
            </StandaloneSearchBox>
            <ul className="suggestions-list">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  onClick={() => addPlace(place)}
                  className="suggestion-item"
                >
                  {place}
                </li>
              ))}
            </ul>
          </div>
          <ul className="places-list">
            {places.map((place, index) => (
              <li key={index}>{place}
            <button
            type="button"
            onClick={() => removePlace(place)}
            className="remove-btn"
          >
            Remove
          </button>
              
              </li>
              
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
