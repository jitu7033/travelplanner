import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import "./MainPage.css";
// import "./MapStyles.css";

const AdventurePage = () => {
  const [filteredAdventures, setFilteredAdventures] = useState([]);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Predefined adventure locations with coordinates and descriptions
  const adventureLocations = [
    { name: "Rishikesh (White Water Rafting)", lat: 30.1194, lng: 78.3055, region: "Uttarakhand, India", description: "Experience thrilling rapids on the Ganges River." },
    { name: "Leh (Mountain Trekking)", lat: 34.1526, lng: 77.5770, region: "Ladakh, India", description: "Trek through the stunning Himalayan landscapes." },
    { name: "Gurgaon (Power Paragliding)", lat: 28.4595, lng: 77.0266, region: "Haryana, India", description: "Soar above the city with an exhilarating paragliding adventure." },
    { name: "Goa (Scuba Diving)", lat: 15.2993, lng: 74.1240, region: "Goa, India", description: "Explore vibrant underwater life in the Arabian Sea." },
    { name: "Manali (Paragliding)", lat: 32.2396, lng: 77.1887, region: "Himachal Pradesh, India", description: "Enjoy panoramic views while paragliding over the mountains." },
  ];

  // Location filters (based on regions)
  const locationFilters = ["All", ...new Set(adventureLocations.map((a) => a.region.split(", ")[1]))];

  // State for filter selection
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Initialize map and add markers
  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded yet");
      return;
    }

    const mapOptions = {
      center: { lat: 28.7041, lng: 77.1025 }, // Centered on India
      zoom: 5,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add markers for all adventure locations
    filteredAdventures.forEach((adventure) => {
      new window.google.maps.Marker({
        position: { lat: adventure.lat, lng: adventure.lng },
        map: newMap,
        title: adventure.name,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Custom icon for adventure spots
        },
      });

      // Add info window
      const infowindow = new window.google.maps.InfoWindow({
        content: `<h3>${adventure.name}</h3><p>${adventure.description}</p>`,
      });

      new window.google.maps.event.addListener(
        newMap,
        "click",
        () => infowindow.close()
      );

      new window.google.maps.event.addListener(
        newMap,
        "zoom_changed",
        () => infowindow.close()
      );

      new window.google.maps.Marker({
        position: { lat: adventure.lat, lng: adventure.lng },
        map: newMap,
        title: adventure.name,
      }).addListener("click", () => {
        infowindow.open(newMap, newMap.getMarker());
      });
    });
  };

  // Filter adventures based on selected location
  useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredAdventures(adventureLocations);
    } else {
      setFilteredAdventures(
        adventureLocations.filter((adventure) => adventure.region.includes(selectedFilter))
      );
    }
  }, [selectedFilter]);

  // Load Google Maps API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.google.com/maps/api/js?key=AIzaSyAD1twoTjX6h3wlKkfR8QgWheVz7quER68&libraries=places,maps`;
    script.async = true;
    script.onload = () => {
      console.log("Google Maps API loaded successfully");
      setMapLoaded(true);
      if (filteredAdventures.length > 0) initializeMap();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps API. Check API key and internet connection.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [filteredAdventures]);

  // Update map when filteredAdventures changes
  useEffect(() => {
    if (mapLoaded && map && filteredAdventures.length > 0) {
      initializeMap();
    }
  }, [filteredAdventures, mapLoaded]);

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h2>T</h2>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/hotels">Hotels</Link>
          <Link to="/oyo">OYO</Link>
          <Link to="/adventure">Adventure</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Discover Adventure Destinations</h1>
        <p>Explore thrilling adventure spots across India!</p>
      </header>

      {/* Filter and Adventure List Section */}
      <main className="form-container">
        <div className="filter-section">
          <label htmlFor="locationFilter">Filter by Location:</label>
          <select
            id="locationFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="travel-mode-select"
          >
            {locationFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>
        </div>

        <h2>Adventure Spots</h2>
        <div className="adventure-list">
          {filteredAdventures.map((adventure, index) => (
            <div key={index} className="adventure-card">
              <h3>{adventure.name}</h3>
              <p><strong>Region:</strong> {adventure.region}</p>
              <p><strong>Description:</strong> {adventure.description}</p>
              <p><strong>Coordinates:</strong> Lat: {adventure.lat}, Lng: {adventure.lng}</p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h3>Adventure Locations Map</h3>
          <div className="map-container" ref={mapRef}></div>
        </div>
      </main>
    </div>
  );
};

// No changes to export
export default AdventurePage;