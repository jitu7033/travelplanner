// tspAlgorithm.js
export const tsp = (matrix, destinationIndex) => {
    const n = matrix.length;
    const memo = Array.from({ length: n }, () => Array(1 << n).fill(-1));
    const parent = Array.from({ length: n }, () => Array(1 << n).fill(-1));

    const totCost = (mask, curr) => {
        // if all cities are visited and we are at destination, stop
        if (mask === (1 << n) - 1 && curr === destinationIndex) {
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

    return { minCost, parent };
};
