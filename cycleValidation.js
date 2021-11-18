//STORAGE 2D MATRIX 
let collectedGraphComponent = [];

let graphComponentMatrix = [];

// for(let i = 0; i < rows; i++) {
//     let row = [];
//     for(let j = 0 ; j < cols; j++) {
//         //Make array instead of obj (more than one child relation can exist)
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

//RETURNS TRUE IF CYCLE IS PRESENT ELSE RET FALSE;
function isGraphCyclic(graphComponentMatrix) {
    //2D ARRAY
    //make vis and dfs vis 2 2d arrays
    let vis =  [];
    let dfsvis = [];

    //100 * 26 -> row * cols
    //INITIALISATION OF VIS AND DFS VIS AND MARK AS FALSE 
    for(let i = 0; i < rows; i++) {
        let visRow = [];
        let dfsvisRow = [];
        for(let j = 0; j < cols; j++) {
           visRow.push(false);
           dfsvisRow.push(false);
        }
        vis.push(visRow);
        dfsvis.push(dfsvisRow);
    }

    //START THE ALGO
    for(let i = 0 ; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(vis[i][j] === false){
                //if there is cycle in any component then there is  a cycle in entire graph
                if(dfsCycleDetection(graphComponentMatrix, i , j , vis, dfsvis)) {
                    return [i , j];
                }
            }
        }
    }
    //No cycle exists in my graph
    return null;
}


function dfsCycleDetection(graphComponentMatrix, i , j , vis, dfsvis) {
    vis[i][j] = true;
    dfsvis[i][j] = true 
    
    //traverse adj nodes(childs nodes here)
    for(let children = 0; children < graphComponentMatrix[i][j].length; children++) {
        let [crid , ccid] = graphComponentMatrix[i][j][children];
        //if not visited call dfs 
        if(vis[crid][ccid] === false) {
            if(dfsCycleDetection(graphComponentMatrix, crid, ccid, vis, dfsvis)) {
                return true;
            }
        } else {
            //IT BASICALLY SAYS I FOUND A VISITED NODE AGAIN IN THE CURR MOVEMENT(CYCLE 👍)
            //BOTH VIS AND DFSVIS ARE TRUE AT THE SAME TIME(IN CURR MOVEMENT)
            //I HAVE A CYCLE 
            if(dfsvis[crid][ccid] === true) {
                return true;
            }
        }
    }
    dfsvis[i][j] = false; 
    return false;
}

