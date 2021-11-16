// let graphComponentMatrix = [];

for(let i = 0; i < rows; i++) {
    let row = [];
    for(let j = 0 ; j < cols; j++) {
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

function colorPromise() {
    return new Promise((resolve , reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    let [srcr, srcc] =  cycleResponse;
    let vis =  [];
    let dfsvis = [];

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
    let response =await dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, vis , dfsvis)
    if(response) return Promise.resolve(true);
    return Promise.resolve(false);
}




//COLORING CELLS FOR TRACKING
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcr , srcc , vis, dfsvis) {
    vis[srcr][srcc] = true;
    dfsvis[srcr][srcc] = true 
    
    //access the cell
    let cell  = document.querySelector(`.cell[rid = "${srcr}"][cid = "${srcc}"`);
    //COLOR THE CELL
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); // code waits here for 1s to finish exec
    

    for(let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [crid , ccid] = graphComponentMatrix[srcr][srcc][children]; 
        if(vis[crid][ccid] === false) {
            if(await dfsCycleDetectionTracePath(graphComponentMatrix, crid, ccid, vis, dfsvis)) {
                    cell.style.backgroundColor = "transparent";
                    await colorPromise();
                    return Promise.resolve(true);
            }
        } else {
            if(dfsvis[crid][ccid] === true) {
                let cyclicCell = document.querySelector(`.cell[rid = "${crid}"][cid = "${ccid}"]`);
                cyclicCell.style.backgroundColor = "lightsalmon";
                await colorPromise();
                cyclicCell.style.backgroundColor = "transparent";
                await colorPromise();
                cell.style.backgroundColor = "transparent";
                return Promise.resolve(true);
            }
        }
    }
    dfsvis[srcr][srcc] = false; 
    return Promise.resolve(true);
}

