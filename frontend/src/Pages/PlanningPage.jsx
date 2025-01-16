
import React, { useState } from "react";

const PlanningPage = () => {
  // State to store the source, destination, and places to visit

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");

  // Handle changes in the source, destination, and new place input fields

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  }
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  }
  const handleNewPlaceChange = (e) => {
    setNewPlace(e.target.value);
  }

  // Add the new place to the list of places
  const addPlace = () => {
    if (newPlace.trim()) {
      setPlaces([...places, newPlace]);
      setNewPlace(""); // Clear the input after adding the place
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Log or process the form data
    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Places to Visit:", places);
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
              placeholder="Enter place (e.g., Eiffel Tower)"
            />
            <button type="button" onClick={addPlace} className="add-place-btn">
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
