

let darkMode = false;
if(localStorage.getItem("darkMode") != null && localStorage.getItem("darkMode") != undefined) darkMode = localStorage.getItem("darkMode");
if(darkMode) document.getElementsByTagName("html")[0].setAttribute("dark-mode", darkMode);

function toggleDarkMode() {
 
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode);
    document.getElementsByTagName("html")[0].setAttribute("dark-mode", darkMode);

}