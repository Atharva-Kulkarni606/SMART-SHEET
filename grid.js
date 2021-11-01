let rows = 100;
let cols = 26;

//JS FOR LEFT-MOST-COLUMN DISPLAYING NUMBERS STARTING FROM 1 TILL ROWS IN THE APP

//GET REF TO THE PARENT CONTAINER IN WHICH ELEMENTS WILL BE DISPLAYED
let addressColCont = document.querySelector(".address-col-cont");

//DYNAMICALLY CREATE DIVS AND INSERT INTO THE MAIN PARENT DIV(addressColCont)
for(let i = 0 ; i < rows; i++) {
    let ele = document.createElement("div");
    ele.setAttribute("class" , "address-col");
    ele.innerText = i + 1;
    addressColCont.appendChild(ele);
}

//JS FOR TOP-ROW IN GRID-CONTAINER DISPLAYING CHARACTERS FROM A - Z(1 - 26)
//GET REF TO THE PARENT CONTAINER IN WHICH ELEMENTS WILL BE DISPLAYED
let addressRowCont = document.querySelector(".address-row-cont");

for(let i = 0 ; i < cols; i++) {
    let ele = document.createElement("div");
    ele.setAttribute("class" , "address-row");
    ele.innerText = String.fromCharCode(65 + i);//A B C D .... Z
    addressRowCont.appendChild(ele);
}


// SELECT ADDRESS BAR 
let addressBar = document.querySelector(".address-bar");

const AddressBarDisplayController = (cell, i ,j) => {
    //EVENT LISTENER TO LISTEN FOR CLICKS 
    //WHENEVER A USER CLICKS THE  ADDRESS BAR SHOULD DISPLAY 
    //COLUMN AND ROW VALUES 
    cell.addEventListener("click" , (e) => {
        let rowId = i + 1;
        let colId = String.fromCharCode(65 + j);
        addressBar.value = `${colId}${rowId}`;
    });
};


//FINALLY CREATE GRID CELLS 
let CellsCont = document.querySelector(".cells-cont");
for(let i = 0 ; i < rows; i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class" , "row-cont")
    for(let j = 0 ; j < cols; j++) {
        let cell =  document.createElement("div");
        cell.setAttribute("class" , "cell");
        cell.setAttribute("contenteditable" , "true");
        cell.setAttribute("spellcheck", "false");
        //FOR IDENTIFICATION OF APPROPRIATE STORAGE CELL
        cell.setAttribute("rid", i);
        cell.setAttribute("cid" , j);
        
        rowCont.appendChild(cell);
        AddressBarDisplayController(cell, i , j);
    }
    CellsCont.appendChild(rowCont);
}


//default cell selection - via dom so that event listener doesnt give error
let firstCell = document.querySelector(".cell"); //returns the first cell
firstCell.click();


