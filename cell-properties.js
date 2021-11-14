//HANDLE STORAGE
// MATRIX (OUTER)
let sheetDB = [];

for(let i = 0 ; i < rows; i++) {
    let sheetRow = [];//INNER ARRAY
    for(let j = 0; j < cols; j++) {
        let cellProp = {
            bold : false,
            italic : false,
            underline : false,
            alignment : "left",
            fontFamily : "monospace",
            fontSize : "14",
            fontColor : "#000000", // black default(only indication)
            BGcolor : "#000000", // default value (only indication)
            value : "",
            formula : "",
            children : [],
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}


//SELECTORS FOR CELL PROPERTIES
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-family-size");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inActiveColorProp = "#ecf0f1";

//ATTACH PROPERTY LISTENER
//IF SOMEONE CLICKS ON BOLD BUTTON
bold.addEventListener("click" , (e) => {
    //FIRST FIND WHICH CELL IS ACTIVE (ON WHICH CELL U WANNA APPLY BOLD PROP)
    //TAKE THE CELL DIRECTY FROM ADDRESS BAR AND DECODE IT TO GET THE COORDINATES
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);

    //MODIFICATION
    // DBCHANGE 
    cellProp.bold = !(cellProp.bold);
    //UI CHANGE
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    //for icon to show it as active
    bold.style.backgroundColor =  cellProp.bold ? activeColorProp : inActiveColorProp;
});


italic.addEventListener("click" , (e) => {
    //FIRST FIND WHICH CELL IS ACTIVE (ON WHICH CELL U WANNA APPLY BOLD PROP)
    //TAKE THE CELL DIRECTY FROM ADDRESS BAR AND DECODE IT TO GET THE COORDINATES
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);

    //MODIFICATION
    // DBCHANGE 
    cellProp.italic = !(cellProp.italic);
    //UI CHANGE
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    //for icon to show it as active
    italic.style.backgroundColor =  cellProp.italic ? activeColorProp : inActiveColorProp;
});


underline.addEventListener("click" , (e) => {
    //FIRST FIND WHICH CELL IS ACTIVE (ON WHICH CELL U WANNA APPLY BOLD PROP)
    //TAKE THE CELL DIRECTY FROM ADDRESS BAR AND DECODE IT TO GET THE COORDINATES
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);

    //MODIFICATION
    // DBCHANGE 
    cellProp.underline = !(cellProp.underline);
    //UI CHANGE
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    //for icon to show it as active
    underline.style.backgroundColor =  cellProp.underline ? activeColorProp : inActiveColorProp;
});

fontSize.addEventListener("change" , (e) => {
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);
    //MODIFICATION
    // DBCHANGE
    cellProp.fontSize = fontSize.value;
    //UI CHANGE
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize; 
});

fontFamily.addEventListener("change" , (e) => {
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);
    //MODIFICATION
    // DBCHANGE
    cellProp.fontFamily = fontFamily.value;
    //UI CHANGE
    cell.style.fontFamily = cellProp.fontFamily ;
    fontFamily.value = cellProp.fontFamily; 
});

fontColor.addEventListener("change" , (e) => {
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);
    //MODIFICATION
    // DBCHANGE
    cellProp.fontColor = fontColor.value;
    //UI CHANGE
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor; 
});

BGcolor.addEventListener("change" , (e) => {
    let address = addressBar.value;
    let  [cell , cellProp] = getCellAndCellProp(address);
    //MODIFICATION
    // DBCHANGE
    cellProp.BGcolor = BGcolor.value;
    //UI CHANGE
    cell.style.backgroundColor = cellProp.BGcolor ;
    BGcolor.value = cellProp.BGcolor; 
});


alignment.forEach((alignElem) => {
    alignElem.addEventListener("click" , (e) => {
        let address = addressBar.value;
        let  [cell , cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        //MODIFICATION
        // DBCHANGE
        cellProp.alignment = alignValue;
            //UI CHANGE
        cell.style.textAlign = cellProp.alignment;

        switch(alignValue) {
            case "left" :   leftAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inActiveColorProp;
                            rightAlign.style.backgroundColor = inActiveColorProp;
                            break;
            case "center" : leftAlign.style.backgroundColor = inActiveColorProp;
                            centerAlign.style.backgroundColor = activeColorProp;
                            rightAlign.style.backgroundColor = inActiveColorProp;
                            break;
            case "right" : leftAlign.style.backgroundColor = inActiveColorProp;
                            centerAlign.style.backgroundColor = inActiveColorProp;
                            rightAlign.style.backgroundColor = activeColorProp;
                            break;
        }

        
    });
});


let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    //ADD EVENT LISTENER
    cell.addEventListener("click" , (e) => {
        let address = addressBar.value;
        let [rid , cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        //APPLY CELL PROPERTIES
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily ;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" :cellProp.BGcolor ;
        cell.style.textAlign = cellProp.alignment;

        //apply properties  ui props container
        bold.style.backgroundColor =  cellProp.bold ? activeColorProp : inActiveColorProp;
        italic.style.backgroundColor =  cellProp.italic ? activeColorProp : inActiveColorProp;
        underline.style.backgroundColor =  cellProp.underline ? activeColorProp : inActiveColorProp;
        fontColor.value = cellProp.fontColor; 
        BGcolor.value = cellProp.BGcolor; 
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily; 

        switch(cellProp.alignment) {
            case "left" :   leftAlign.style.backgroundColor = activeColorProp;
                            centerAlign.style.backgroundColor = inActiveColorProp;
                            rightAlign.style.backgroundColor = inActiveColorProp;
                            break;
            case "center" : leftAlign.style.backgroundColor = inActiveColorProp;
                            centerAlign.style.backgroundColor = activeColorProp;
                            rightAlign.style.backgroundColor = inActiveColorProp;
                            break;
            case "right" : leftAlign.style.backgroundColor = inActiveColorProp;
                            centerAlign.style.backgroundColor = inActiveColorProp;
                            rightAlign.style.backgroundColor = activeColorProp;
                            break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.value = cellProp.value;
    });
};

function getCellAndCellProp(address) {
    let [rid , cid] = decodeRIDCIDFromAddress(address);
    //ACCESS CELL AND STORAGE CELL
    let cell = document.querySelector(`.cell[rid = "${rid}"][cid = "${cid}"`);
    let cellProp = sheetDB[rid][cid];
    return [cell , cellProp];
};


function decodeRIDCIDFromAddress(address)  {
    //ADDRESS- > A1ss (EX TO WRITE LOGIC)
    //0 BASED INDEXING SO -1
    let rid = Number(address.slice(1) - 1) ; //1ss 
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid , cid];
};