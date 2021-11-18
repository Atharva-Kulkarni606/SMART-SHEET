let ctrlKey;


//if control key is pressed
document.addEventListener("keydown" , (e) => {
    ctrlKey = e.ctrlKey
});

//if control key is not pressed / just pressed and now u left pressing it
document.addEventListener("keyup" , (e) => {
    ctrlKey = e.ctrlKey
});

//attach a listener to every cell
for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols ; j++) {
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"`);
        handleSelectedCell(cell);
    }
}

//ACCESS COPY CUT PASTE BUTTONS
let copyBtn =  document.querySelector('.copy');
let cutBtn =  document.querySelector('.cut');
let pasteBtn =  document.querySelector('.paste');


let rangeStorage = [];
function handleSelectedCell(cell) {
    cell.addEventListener("click" , (e) => {
        //Select cells ranne at this place
        if(!ctrlKey) {
            return;
        }
        //already cells indices are stored so return 
        if(rangeStorage.length >= 2) {
            // CLEAR THE UI 
            defaultSelectedCellsUI();
            //EMPTY THE STORAGE AFTER UT IS CLEARED
            rangeStorage = [];
        }

        //CHANGE UI
        //INDICATE BY BORDER THAT THIS CELL IS THE START OR END OF OUR SELECTED RANGE
        cell.style.border = "3px solid #218c74";


        //IF THE CODE COMES HERE IT MEANS THAT CTRL KEY IS PRESSED AND
        //ALREADY IN OUR RANGE STORAGE WE DONT HAVE 2 CELLS(START AND END) 
        //SO IT IS OUR CELL SO GET ITS ROW AND COL AND PUSH INTO THE STORGAGE ARRAY
        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,  cid]);

    });
}




//REMOVE THE UI EFFECT OF SELECTED CELLS
function defaultSelectedCellsUI() {
    //ACCESS THE STORED CELLS OF RANGE (START AND END)
    for(let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid = "${rangeStorage[i][0]}"][cid = "${rangeStorage[i][1]}"`);
        cell.style.border = "3px solid lightgrey";
    }

}



//ADD LISTENERS ON COPY,CUT PASTE BUTTONS 
let copyData = [];
copyBtn.addEventListener("click" , (e) => {
    if(rangeStorage.length < 2) return;
    copyData = [];
    let [startRow,endRow,startCol,endCol] = [rangeStorage[0][0],rangeStorage[1][0],rangeStorage[0][1], rangeStorage[1][1]];
    //ITERATE OVER ENTIRE RANGE
    for(let i = startRow; i <= endRow; i++) {
        let copyRow = [];
        for(let j = startCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    //REMOVE THE UI SAME AS ABOVE
    defaultSelectedCellsUI();
});



//CUT LOGIC
cutBtn.addEventListener("click" , (e) => {
    
    if(rangeStorage.length < 2) return;

    let [startRow,endRow,startCol,endCol] = [rangeStorage[0][0],rangeStorage[1][0],rangeStorage[0][1], rangeStorage[1][1]];

    //ITERATE OVER ENTIRE RANGE
    for(let i = startRow; i <= endRow; i++) {
        for(let j = startCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j];
            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"`);
            //db -> REMOVE VALUES FROM DB
            cellProp.value ="";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";

            //UI
            cell.click();
            //REMOVE THE UI SAME AS ABOVE
            defaultSelectedCellsUI();

        }
    }
}); 


//for paste
//do simple calculations
pasteBtn.addEventListener("click", (e) => {
   
    //IF USER SELECTS ONLY 1 CELL AND COMES TO PASTE GO BACK 
    if(rangeStorage.length < 2) return;

    let startRow =  rangeStorage[0][0];
    let endRow = rangeStorage[1][0];
    let startCol =  rangeStorage[0][1];
    let endCol = rangeStorage[1][1];
    let address = addressBar.value;

    let rowDiff = Math.abs(endRow - startRow);
    let colDiff = Math.abs(endCol - startCol);


    //Target row and col 
    let [stRow , stCol] = decodeRIDCIDFromAddress(address);
    // r -> refers copy data row 
    // c -> refers cop data col 
    for(let i = stRow,r = 0; i <= stRow + rowDiff ; i++,r++) {
        for(let j = stCol,c = 0; j <= stCol + colDiff; j++,c++) {
            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"`);
                //IF CELL DOESNT EXIST(OUT OFF BOUNDS DO NOT COPY)
                //EDGE CASES -> DONT PASTE ON OUT OF BOUND CELLS
            if(!cell) continue;
            
            //MAKE CHANGE IN UI AS WELL AS DB(2 WAY BINDING)
            //DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            //UI CHANGE
            cell.click();

        }
    }


});

