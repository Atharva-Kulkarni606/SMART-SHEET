//ADD A LISTENER TO EACH CELL

//ITERATE OVER EACH AND EVERY CELL (USER CAN CLICK ON ANY CELL)
for(let i = 0; i < rows ; i++) {
    for(let j = 0; j < cols ; j++) {
        //access the cell(each one by one)
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"`);
        
        //ADD BLUR EVENT LISTENER (USER HAS JUST NAVIGATED OUT OF THAT CELL (MAYBE HAS MODIFIED SOMETHING THERE))
        cell.addEventListener("blur" , (e) => {
            let address = addressBar.value;
            // activeCell -> cell in which user was there previously
            //cellProp = cellObject from the storage
            let [activeCell , cellProp] = getCellAndCellProp(address);
            //GET THE MODIFIED DATA WHICH WAS ENTERED BY USER
            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value) return;


            //SET THE VALUE IN THE VALUE ATTRIBUTE IN THE CELL OBJECT FROM MAIN STORAGE OBJECT
            cellProp.value = enteredData;
            // console.log(cellProp);
            //IF DATA IS MODIFIED  -> 
            // 1)REMOVE P-C RELATIONSHIP 
            // 2)EMPTY FORMULA  
            // 3)UPDATE CHILDREN WITH NEW HARDCODED VALUE(MODIFIED);
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCell(address);
        });
    }
}


let formulaBar = document.querySelector(".formula-bar");
//NORMAL EXPRESSION DONE
//ADD EVENT LISTNER TO FORMULA BACK IF ANYONE PRESSES ENTER
formulaBar.addEventListener("keydown" , (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula) {
        //IF CHANGE IN RELATION(FORMULA) OCCURS
        //IF STORED FORMULA(OLD) IS DIFFERENT THAN CURRENT ENTERED FORMULA
        //BREAK OLD P-C RELATION AND ADD NEW P-C RELATION
        let address = addressBar.value;
        let[cell , cellProp] = getCellAndCellProp(address);
        if(inputFormula != cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }

        addChildToGraphComponent(inputFormula , address);
        //check if formula is cyclic or not -> if non cyclic then evaluate else
        // alert the user 
        let isCyclic = isGraphCyclic(graphComponentMatrix);
        if(isCyclic) {
            alert("Your Formula is Cycle");
            //YOU HAVE TO BREAK THE RELATION AS WELL AS ITS USELESS NOW
            removeChildFromGraphComponent(inputFormula , address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);
        //UPDATE THIS VALUE IN DB AS WELL AS UI
        setCellUIAndCellProp(evaluatedValue , inputFormula, address);
        //SET PARENT-CHILD RELATION
        addChildToParent(inputFormula);
        updateChildrenCell(address);
    }

});


//THIS FUNCTION BRINGS RID AND CID OF APPROPRIATE CELL FROM GRAPHS STORAGE MATRIX
// AND THEN PUSHESH THE VALUES OF CHILD INTO THAT CELL AFTER DECODING 
// EX -> B1 : A1 + 10 SO BASICALLY IT PUSHES (A1 is parent and B1 is child  so pushes B1 ([0 ,1] 
// to the cell location of A1))
function addChildToGraphComponent(formula , childAddress) {
    let [crid,  ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(' ');
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [prid , pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1 : A1 + 10
            //rid -> i , cid -> j
            //PUSH THE CHILD DETAILS (CRID , CCID) -> CHILDS ROW AND COLN ID EX -> (0 , 1)
            //INTO THE PARENT
            graphComponentMatrix[prid][pcid].push([crid , ccid]);
        }
    }

}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");//returns an array whose elements r separated by separator
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell , parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            //FIND THE INDEX OF CHILD IN THE CHILDREN ARRAY TO BREAK RELATION SHIP
            let idx =  parentCellProp.children.indexOf(childAddress);
            //REMOVE THAT CHILD USING SPLICE
            parentCellProp.children.splice(idx , 1);
        }
    }

}


function updateChildrenCell(parentAddress) {
    let [parentCell , parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;
    
    for(let i = 0 ; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell , childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        //EVALUATE
        let evaluatedValue = evaluateFormula(childFormula);
        //UPDATE
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCell(childAddress);
    }
 }  


//TAKE THE FORMULA OF THAT INPUT BOX AND THEN BASICALLY SET CHILDS
// EX-> CHANGE CELL B2 -> AS  -> ( A1 + A2 ) SO HERE B2 IS A CHILD AND A1 AND A2 ARE PARENTS  
function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");//returns an array whose elements r separated by separator
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell , parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
            // console.log(sheetDB);
        }
    }
}

function evaluateFormula(formula) {
    //CONVERTING A EXP WITH DEPENDENCY TO NORMAL EXP
    let encodedFormula = formula.split(" ");//returns an array whose elements r separated by separator
    for(let i = 0 ; i < encodedFormula.length ; i++) {
        // if(typeof(encodedFormula[i]) == "string") {
            let asciiValue = encodedFormula[i].charCodeAt(0);
            if(asciiValue >= 65 && asciiValue <= 90) {
                //get actual cell and storage obj access
                let [cell , cellProp] = getCellAndCellProp(encodedFormula[i]);
                //REPLACE THE CHARACTER BY THE CELLS ACTUAL VALUE FROM STORAGE
                encodedFormula[i] = cellProp.value;
            }
        // }
    }
    
    //CONVERT ARRAY OF ENCODED FORMULA TO STRING AS EVAL TAKES A STRING
    let decodedFormula = encodedFormula.join(" ");

    //FOR NORMAL EXPRESSION (NO CHARS NO DEPENDENCY)
    return eval(decodedFormula);
}

//UPDATE THIS VALUE IN DB AS WELL AS UI
function setCellUIAndCellProp(evaluatedValue , formula ,address) {
    // let address = addressBar.value;
    let [cell , cellProp] = getCellAndCellProp(address);

    //DATA UPDATE
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;

    //UI UPDATE
    cell.innerText = cellProp.value ;

}