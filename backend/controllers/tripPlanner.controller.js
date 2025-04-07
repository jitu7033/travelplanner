import axios from "axios"; // Import axios for making HTTP requests
import dotenv from "dotenv"; // Import dotenv for environment variable management
dotenv.config(); // Load environment variables from .env file

export const handleTrip = async (req, res) => {
  const { source, destination, places, travelMode = "driving" } = req.body;

  if (!source || !destination || !Array.isArray(places)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  console.log("Received Trip Data:", { source, destination, places, travelMode });

  const allocation = [source, ...places, destination];
  const origins = allocation.map((place) => encodeURIComponent(place)).join("|");
  const destinations = allocation.map((place) => encodeURIComponent(place)).join("|");

  // const apiKey = "AIzaSyAD1twoTjX6h3wlKkfR8QgWheVz7quER68";

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // console.log("Google Maps API Key:", apiKey); // Log the API key for debugging


  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}&mode=${travelMode}&units=metric`;

  try {
    const response = await axios.get(url);
    const { data } = response;

    if (data.status !== "OK") {
      return res.status(500).json({ error: `Distance Matrix API error: ${data.status}` });
    }

    const tripMatrix = [];
    const rows = data.rows;

    for (let i = 0; i < allocation.length; i++) {
      const row = [];
      const elements = rows[i].elements;
      for (let j = 0; j < allocation.length; j++) {
        if (i === j) {
          row.push(0);
        } else {
          const distanceInMeters = elements[j].distance.value;
          const distanceInKm = distanceInMeters / 1000;
          row.push(Math.round(distanceInKm));
        }
      }
      tripMatrix.push(row);
    }

    const n = tripMatrix.length;
    const memo = Array.from({ length: n }, () => Array(1 << n).fill(-1));
    const parent = Array.from({ length: n }, () => Array(1 << n).fill(-1));

    const totCost = (mask, curr) => {
      if (mask === (1 << n) - 1) return tripMatrix[curr][n - 1];
      if (memo[curr][mask] !== -1) return memo[curr][mask];
      let ans = Infinity;
      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) === 0) {
          const cost = tripMatrix[curr][i] + totCost(mask | (1 << i), i);
          if (cost < ans) {
            ans = cost;
            parent[curr][mask] = i;
          }
        }
      }
      return (memo[curr][mask] = ans);
    };

    const getPath = (parent, n) => {
      const path = [];
      let mask = 1;
      let curr = 0;
      while (parent[curr][mask] !== -1) {
        path.push(allocation[curr]);
        curr = parent[curr][mask];
        mask |= 1 << curr;
      }
      path.push(allocation[n - 1]);
      return path.join(" -> ");
    };

    const minCost = totCost(1, 0);
    const path = getPath(parent, n);

    return res.status(200).json({ minCost, path });
   
  } catch (error) {
    console.error("Error fetching distance matrix:", error.message);
    return res.status(500).json({ error: "Failed to fetch distances from Google Maps API" });
  }
};