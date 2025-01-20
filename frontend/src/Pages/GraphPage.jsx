import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import "./GraphPage.css"
const GraphPage = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const locations = state?.locations
  ||  [
  "New Delhi, India",
  "Mumbai, Maharashtra, India",
  "Bengaluru, Karnataka, India",
  "Chennai, Tamil Nadu, India",
  "Kolkata, West Bengal, India",
  "Hyderabad, Telangana, India",
  "Pune, Maharashtra, India",
  "Ahmedabad, Gujarat, India",
  "Jaipur, Rajasthan, India",
  "Chandigarh, India"] // Use these temporary locations if state is null

  
  console.log(locations);
  const [distances, setDistances] = useState([]);
  
  // console.log(locations);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY , // Replace with your actual API key
    libraries: ["places"],
  });
  
  useEffect(() => {
    if (isLoaded && locations && locations.length > 0) {
      fetchDistances();
    }
  }, [isLoaded, locations]);


  const fetchDistances = () => {
    const service = new google.maps.DistanceMatrixService();

    const originDestinations = [];

    // Create origin-destination pairs
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i !== j) {
          originDestinations.push({
            origin: locations[i],
            destination: locations[j],
          });
        }
      }
    }

    const requests = originDestinations.map((pair) => {
      return new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [pair.origin],
            destinations: [pair.destination],
            travelMode: google.maps.TravelMode.DRIVING, // Change mode if needed
          },
          (response, status) => {
            if (status === "OK") {
              const element = response.rows[0]?.elements[0];
              if (element && element.distance && element.distance.value) {
                resolve({
                  origin: pair.origin,
                  destination: pair.destination,
                  distance: element.distance.value, // Distance in meters
                });
              } else {
                reject(new Error("Distance data is missing"));
              }
            } else {
              reject(new Error("Error fetching distance"));
            }
          }
        );
      });
    });
    Promise.all(requests)
      .then((results) => {
        const distanceMatrix = Array(locations.length)
          .fill(null)
          .map(() => Array(locations.length).fill(null));

        results.forEach((result) => {
          const originIndex = locations.indexOf(result.origin);
          const destinationIndex = locations.indexOf(result.destination);
          distanceMatrix[originIndex][destinationIndex] = result.distance;
        });

        setDistances(distanceMatrix);
        console.log("Updated Distance Matrix:", distanceMatrix);
      })
      .catch((error) => {
        console.error("Error fetching distances:", error);
      });
  };

  // go to tsp page 
  const goToTSPPage = () =>{
    navigate("/tsp",{state:{locations,distanceMatrix:distances}})
  };



  return (
    <div>
      <h1>Graph of Locations with Distances</h1>
      <p>Check the console for the 2D distance matrix.</p>
      <table border="1">
        <thead>
          <tr>
            <th>Source</th>
            {locations.map((location, index) => (
              <th key={index}>{location}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.map((source, sourceIndex) => (
            <tr key={sourceIndex}>
              <td>{source}</td>
              {locations.map((destination, destIndex) => (
                <td key={destIndex}>
                  {distances[sourceIndex] && distances[sourceIndex][destIndex]
                    ? `${distances[sourceIndex][destIndex] / 1000} km` // Convert to km
                    : 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={goToTSPPage}>generate Path</button>
    </div>
  );
};

export default GraphPage;