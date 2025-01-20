// directions.js
export const getPath = (parent, n) => {
    const path = [];
    let mask = 1,
        curr = 0;
    path.push(0);
    while (parent[curr][mask] !== -1) {
        curr = parent[curr][mask];
        mask |= 1 << curr;
        path.push(curr);
    }
    return path;
};
