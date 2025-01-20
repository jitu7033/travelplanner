import react,{useEffect,useState} from "react";
import { useLocation} from "react-router-dom";



function tsp(matrix,destinationIndex) {
    const n = matrix.length;
    const memo = Array.from({ length: n }, () => Array(1 << n).fill(-1));
    const parent = Array.from({ length: n }, () => Array(1 << n).fill(-1));
  
    const totCost = (mask, curr) => {
        // if all cities are visisted and we are at destination , stop 
      if (mask === (1 << n) - 1  && curr === destinationIndex) {
        return 0; // Return to the starting city
      }
      if (memo[curr][mask] !== -1) {
        return memo[curr][mask];
      }
  
      let ans = Infinity;
  
      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) === 0) {
          const cost = matrix[curr][i] + totCost(mask | (1 << i), i);
          if (cost < ans) {
            ans = cost;
            parent[curr][mask] = i; // Store the next city
          }
        }
      }
  
      return (memo[curr][mask] = ans);
    };
  
    const minCost = totCost(1, 0);
  
    // Reconstruct the path
    const path = [];
    let mask = 1,
      curr = 0;
    path.push(0);
    while (parent[curr][mask] !== -1) {
      curr = parent[curr][mask];
      mask |= 1 << curr;
      path.push(curr);
    }
    return { minCost, path };
  }

const TSPPage = () => {
    const {state} = useLocation();
    const {locations,distanceMatrix} = state || {};
    const destinationIndex = locations.length-1;


    const [result,setResult] = useState(null);

    useEffect(()=>{
        if(distanceMatrix && distanceMatrix.length > 0){
            const {minCost, path} = tsp(distanceMatrix,destinationIndex);
            setResult({minCost,path});
        }
    },[distanceMatrix,destinationIndex])

    if(!locations || !distanceMatrix){
        return <p>Invalid data please return to the graph page and try again.</p>
    }

    return (
        <div>
            <h1>Travelling salesman problem</h1>
            {result ? (
                <>
                <p>
                    <strong>Minimum Cost : </strong>{result.minCost} meters
                </p>
                <p>
                    <strong>optimal Path : </strong>{" "}
                    {result.path.map((index)=>locations[index]).join(" -> ")}
                </p>
                </>
            ) : (
                <p>Calculating TSP solution... </p>
            )}
        </div>
    )
}

export default TSPPage;