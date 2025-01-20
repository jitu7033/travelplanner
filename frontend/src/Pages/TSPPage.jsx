import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { tsp } from "../components/tspAlgorithm";  // Import TSP algorithm
import { getPath } from "../components/directions";  // Import direction path
import "./TSPPage.css"

const TSPPage = () => {
    const { state } = useLocation();
    const { locations, distanceMatrix } = state || {};
    const destinationIndex = locations.length - 1;

    const [result, setResult] = useState(null);

    useEffect(() => {
        if (distanceMatrix && distanceMatrix.length > 0) {
            const { minCost, parent } = tsp(distanceMatrix, destinationIndex);
            const path = getPath(parent, locations.length);  // Get path from directions.js
            setResult({ minCost, path });
        }
    }, [distanceMatrix, destinationIndex]);


    if (!locations || !distanceMatrix) {
        return <p>Invalid data, please return to the graph page and try again.</p>;
    }
    return (
        <div className="mapcontiner">
            <h1>Here Is Your Optimal Route </h1>
            {result ? (
                <>
                    <p>
                        <strong>Minimum Distance : </strong>{(result.minCost / 1000).toFixed(2)} KM
                    </p>
                    <p>
                        <strong>Optimal Path: </strong>
                        {result.path.map((index) => locations[index]).join(" -> ")}
                    </p>
                </>
            ) : (
                <p>Calculating TSP solution...</p>
            )}
        </div>
    );
};

export default TSPPage;
