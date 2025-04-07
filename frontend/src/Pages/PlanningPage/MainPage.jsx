import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";
import "./MapStyles.css";

const HomePage = () => {
  const [places, setPlaces] = useState([""]);
  const [route, setRoute] = useState([]);
  const [flag, setFlag] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    travelMode: "driving", // Default travel mode
  });
  const [suggestions, setSuggestions] = useState({
    source: [],
    destination: [],
    places: [],
  });
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(false); // Toggle live route updates
  const [trafficLayer, setTrafficLayer] = useState(null); // Traffic layer state

  // Refs for input elements and map container
  const sourceInputRef = useRef(null);
  const destInputRef = useRef(null);
  const placeInputsRef = useRef([]);
  const mapRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (mapLoaded) fetchSuggestions(name, value);
  };

  // Handle dynamic place change
  const handlePlaceChange = (index, value) => {
    const updatedPlaces = [...places];
    updatedPlaces[index] = value;
    setPlaces(updatedPlaces);
    if (mapLoaded && (!suggestions.places[index] || suggestions.places.length <= index)) {
      setSuggestions((prev) => {
        const newPlaces = [...prev.places];
        newPlaces[index] = [];
        return { ...prev, places: newPlaces };
      });
    }
    if (mapLoaded) fetchSuggestions(`places[${index}]`, value);
  };

  // Add new place input field
  const addPlace = () => {
    setPlaces([...places, ""]);
    setSuggestions((prev) => ({
      ...prev,
      places: [...prev.places, []],
    }));
  };

  // Remove a place input field
  const removePlace = (index) => {
    const updatedPlaces = places.filter((_, i) => i !== index);
    setPlaces(updatedPlaces);
    const updatedSuggestions = { ...suggestions };
    updatedSuggestions.places.splice(index, 1);
    setSuggestions(updatedSuggestions);
  };

  // Fetch current location using Geolocation API
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.display_name || "Unknown Location";
            setFormData((prev) => ({ ...prev, source: locationName }));
            setUserLocation({ lat: latitude, lng: longitude });
            alert(`Location detected: ${locationName}`);
          } catch (error) {
            alert("Failed to fetch location details");
            console.error("Location Error:", error);
          }
        },
        (error) => {
          alert("Error getting location. Allow location access.");
          console.error("Geolocation Error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  // Fetch place suggestions using Google Maps Places API
  const fetchSuggestions = (field, value) => {
    if (!value || value.length < 3) {
      setSuggestions((prev) => {
        if (field.startsWith("places[")) {
          const index = parseInt(field.match(/\d+/)[0]);
          const newPlaces = [...prev.places];
          newPlaces[index] = [];
          return { ...prev, places: newPlaces };
        }
        return { ...prev, [field]: [] };
      });
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded yet. Check API key and libraries.");
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    const request = {
      input: value,
      location: userLocation
        ? new window.google.maps.LatLng(userLocation.lat, userLocation.lng)
        : null,
      radius: userLocation ? 50000 : null,
    };

    service.getPlacePredictions(request, (predictions, status) => {
      console.log("Suggestions for", field, ": Status:", status, "Predictions:", predictions);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newSuggestions = predictions.map((prediction) => ({
          description: prediction.description,
          placeId: prediction.place_id,
          structuredFormatting: prediction.structured_formatting,
        }));
        if (field.startsWith("places[")) {
          const index = parseInt(field.match(/\d+/)[0]);
          setSuggestions((prev) => {
            const newPlaces = [...prev.places];
            newPlaces[index] = newSuggestions;
            return { ...prev, places: newPlaces };
          });
        } else {
          setSuggestions((prev) => ({ ...prev, [field]: newSuggestions }));
        }
      } else {
        setSuggestions((prev) => {
          if (field.startsWith("places[")) {
            const index = parseInt(field.match(/\d+/)[0]);
            const newPlaces = [...prev.places];
            newPlaces[index] = [];
            return { ...prev, places: newPlaces };
          }
          return { ...prev, [field]: [] };
        });
        console.error("Autocomplete error for", field, ":", status);
      }
    });
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (field, suggestion) => {
    const fullLocation = suggestion.description; // Use full description for accuracy
    if (field === "source" || field === "destination") {
      setFormData((prev) => ({ ...prev, [field]: fullLocation }));
    } else if (field.startsWith("places[")) {
      const index = parseInt(field.match(/\d+/)[0]);
      const updatedPlaces = [...places];
      updatedPlaces[index] = fullLocation;
      setPlaces(updatedPlaces);
    }
    setSuggestions((prev) => {
      if (field.startsWith("places[")) {
        const index = parseInt(field.match(/\d+/)[0]);
        const newPlaces = [...prev.places];
        newPlaces[index] = [];
        return { ...prev, places: newPlaces };
      }
      return { ...prev, [field]: [] };
    });
  };

  // Handle form submission and map initialization
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/trip/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: formData.source,
          destination: formData.destination,
          places: places.filter((place) => place.trim() !== ""),
          travelMode: formData.travelMode,
        }),
      });
      const data = await response.json();
      console.log("Backend response:", data);
      if (response.ok) {
        setRoute(data);
        setFlag(true);
        if (mapLoaded && data.path) {
          await initializeMap(data.path);
        } else {
          console.error("Map not loaded or path missing:", { mapLoaded, data });
        }
        alert("Trip planned successfully");
      } else {
        alert("Failed to load trip plan due to an internal server issue");
      }
    } catch (e) {
      console.log("Fetch error:", e);
      alert("Failed to load trip plan due to an internal server issue");
    }
  };

  const initializeMap = async (pathString) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet");
      return;
    }

    const pathArray = pathString.split(" -> ");
    if (pathArray.length < 2) {
      alert("Please enter a valid source and destination.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 7,
      center: { lat: 0, lng: 0 }, // Will be updated automatically
    });

    directionsRenderer.setMap(newMap);
    setMap(newMap);

    const request = {
      origin: pathArray[0],
      destination: pathArray[pathArray.length - 1],
      waypoints: pathArray.slice(1, pathArray.length - 1).map((location) => ({
        location,
        stopover: true,
      })),
      travelMode: formData.travelMode.toUpperCase(), // "DRIVING", "WALKING", etc.
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        console.error("Directions request failed:", status);
        alert("Failed to fetch directions. Please check your inputs.");
      }
    });
  };

  // Toggle live route updates
  const toggleLiveUpdate = () => {
    setLiveUpdate(!liveUpdate);
    if (!liveUpdate && mapLoaded && route.path) {
      startLiveUpdates();
    }
  };

  // Start live route updates
  const startLiveUpdates = () => {
    const interval = setInterval(async () => {
      if (liveUpdate && mapLoaded) {
        try {
          const response = await fetch("http://localhost:3000/api/trip/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: formData.source,
              destination: formData.destination,
              places: places.filter((place) => place.trim() !== ""),
              travelMode: formData.travelMode,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            setRoute(data);
            await initializeMap(data.path);
          }
        } catch (e) {
          console.error("Live update error:", e);
        }
      }
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  };

  // Map controls
  const zoomIn = () => map && map.setZoom(map.getZoom() + 1);
  const zoomOut = () => map && map.setZoom(map.getZoom() - 1);
  const centerMap = () => {
    if (map && userLocation) {
      map.panTo(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  };

  // Toggle traffic layer
  const toggleTraffic = () => {
    if (trafficLayer) {
      if (trafficLayer.getMap()) {
        trafficLayer.setMap(null);
      } else {
        trafficLayer.setMap(map);
      }
    } else if (map) {
      const traffic = new window.google.maps.TrafficLayer();
      traffic.setMap(map);
      setTrafficLayer(traffic);
    }
  };

  // Load Google Maps API with your API key
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,maps,geocoding`;
    script.async = true;
    script.onload = () => {
      console.log("Google Maps API loaded successfully");
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps API. Check API key and internet connection.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // handle click outside of the input field to close suggestions 

  useEffect(() => {
    const handleClickkOutside = (event) => {

      // check if the click is outside of the input field and suggestions 
      
    }
  })

  useEffect(() => {
    if (liveUpdate && mapLoaded && route.path) {
      const cleanup = startLiveUpdates();
      return cleanup;
    }
  }, [liveUpdate, mapLoaded, route.path]);

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h2>T</h2>
        </div>
        <div className="navbar-links">
          <Link to="/hotels">Hotels</Link>
          <Link to="/oyo">OYO</Link>
          <Link to="/adventure">Adventure</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Explore Your Next Adventure</h1>
        <p>Plan your journey with ease and discover new destinations!</p>
      </header>

      {/* Form Section */}
      <main className="form-container">
        <h2>Plan Your Trip</h2>
        <form onSubmit={handleSubmit}>
          {/* Travel Mode Selection */}
          <div className="form-group">
            <label>Travel Mode:</label>
            <select
              name="travelMode"
              value={formData.travelMode}
              onChange={handleChange}
              className="travel-mode-select"
            >
              <option value="driving">Car (Driving)</option>
              <option value="bicycling">Bike (Bicycling)</option>
              <option value="walking">Walking</option>
            </select>
          </div>

          {/* Source Input */}
          <div className="form-group">
            <label>Source:</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter Source"
              required
              ref={sourceInputRef}
              className="input-field"
            />
            {suggestions.source.length > 0 && (
              <ul className="suggestions">
                {suggestions.source.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionSelect("source", suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion.structuredFormatting.main_text}{" "}
                    <small>({suggestion.description})</small>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="location-button"
              onClick={getCurrentLocation}
            >
              📍 Use Current Location
            </button>
          </div>

          {/* Destination Input */}
          <div className="form-group">
            <label>Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter Destination"
              required
              ref={destInputRef}
              className="input-field"
            />
            {suggestions.destination.length > 0 && (
              <ul className="suggestions">
                {suggestions.destination.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionSelect("destination", suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion.structuredFormatting.main_text}{" "}
                    <small>({suggestion.description})</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dynamic "Places to Visit" Input */}
          {places.map((place, index) => (
            <div key={index} className="form-group dynamic-field">
              <label>Place {index + 1}:</label>
              <div className="place-input-container">
                <input
                  type="text"
                  value={place}
                  onChange={(e) => handlePlaceChange(index, e.target.value)}
                  placeholder={`Place to Visit ${index + 1}`}
                  ref={(el) => (placeInputsRef.current[index] = el)}
                  className="input-field"
                />
                {suggestions.places[index] && suggestions.places[index].length > 0 && (
                  <ul className="suggestions">
                    {suggestions.places[index].map((suggestion, i) => (
                      <li
                        key={i}
                        onClick={() =>
                          handleSuggestionSelect(`places[${index}]`, suggestion)
                        }
                        className="suggestion-item"
                      >
                        {suggestion.structuredFormatting.main_text}{" "}
                        <small>({suggestion.description})</small>
                      </li>
                    ))}
                  </ul>
                )}
                {places.length > 1 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removePlace(index)}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add More Places Button */}
          <button type="button" className="add-button" onClick={addPlace}>
            + Add More Places
          </button>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit Plan
          </button>
        </form>

        {/* Route Output, Map, and Controls */}
        {flag && (
          <div className="map-section">
            <h3>Shortest Path:</h3>
            <div className="route-output">
              <pre>{JSON.stringify(route, null, 2)}</pre>
            </div>
            <div className="map-container" ref={mapRef}></div>
            <div className="map-controls">
              <button onClick={zoomIn} className="map-button">
                Zoom In
              </button>
              <button onClick={zoomOut} className="map-button">
                Zoom Out
              </button>
              {/* <button onClick={centerMap} className="map-button">
                Center on Location
              </button>
              <button onClick={toggleLiveUpdate} className="map-button">
                {liveUpdate ? "Stop Live Update" : "Start Live Update"}
              </button> */}
              <button onClick={toggleTraffic} className="map-button">
                {trafficLayer && trafficLayer.getMap() ? "Hide Traffic" : "Show Traffic"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;