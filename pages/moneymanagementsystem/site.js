// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// The greatest function of all time
// saves 20 keystrokes and makes the code way easier to read
// honestly who on earth thought document.getElementById was a good idea????
function getID(id) {
    return document.getElementById(id);
}

//Does extremely complicated math
function addCalc() {
    const num1 = getID("num1").value;
    const num2 = getID("num2").value;
    let sum = Number(num1) + Number(num2);
    getID("answer").innerHTML = sum;
}

// Shows the mobile tab panel
function showTabPanel() {

    if (getID("tabPanel").style.display !== "none") {
        getID("tabPanel").style.display = "none";
        getID("hamButton").classList.remove("hamButtonOn");
    } else {
        getID("tabPanel").style.display = "flex";
        getID("hamButton").classList.add("hamButtonOn");
    }

}

function darkMode() {
    if(document.body.className !== "darkMode"){
        document.body.className = "darkMode";
        getID("darkModeBtn").className = "darkModeBtnActive";
    } else {
        document.body.className = "";
        getID("darkModeBtn").className = "";
    }
}

var activeTab = {
    divID: null,
    displayType: null,
    divToChange: null,
    defaultClass: null,
    activeClass: null
}

function showDiv(divID, displayType, divToChange=null, defaultClass = null, activeClass=null){
    // If it's not empty, make it so.
    if(getID(divID).style.display !== "none") {
        getID(divID).style.display = "none";
        changeClass(divToChange, activeClass, defaultClass);
        // clean the activeTab object
        activeTab = {...activeTab,
            divID: null,
            displayType: null,
            divToChange: null,
            defaultClass: null,
            activeClass: null
        };
    } else {
        // Show it!
        getID(divID).style.display = displayType;
        changeClass(divToChange, defaultClass, activeClass);
        // avoid the null error
        if(activeTab.divID != null){
            // get rid of the previous tab!!!
            showDiv(activeTab.divID, activeTab.displayType, activeTab.divToChange, activeTab.defaultClass, activeTab.activeClass);
        }
            // create new activeTab object
            activeTab = {...activeTab,
            divID: divID,
            displayType: displayType,
            divToChange: divToChange,
            defaultClass: defaultClass,
            activeClass: activeClass
        }

    }


}

function changeClass(div, previousClass, newClass){
        getID(div).classList.add(newClass);
        getID(div).classList.remove(previousClass);
}

function recursionTest(){
    // It goes forever, as expected
    console.log("Recursion");
    recursionTest();
}


// =============================================================
//                      EVENT LISTENERS
// =============================================================
const darkModeBtn = getID("darkModeBtn");
darkModeBtn.addEventListener("click", darkMode);