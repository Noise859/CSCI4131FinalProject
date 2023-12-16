var darkMode = "false";
var stylesheet = document.getElementById("mainStylesheet");
var darkToggle = document.getElementById("darkToggle");

if(localStorage.getItem("darkMode") != null) {
    darkMode = localStorage.getItem("darkMode");
}

setDarkMode(darkMode);

function toggleDarkMode() {
    if(darkMode == "false") {
        darkMode = "true";
    }
    else {
        darkMode = "false";
    }
    localStorage.setItem("darkMode", darkMode); 
    setDarkMode(darkMode);
}

function setDarkMode(dark) {
    if(dark=="true") {
        stylesheet.setAttribute('href', '/css/main.dark');
        darkToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
    else {
        stylesheet.setAttribute('href', 'css/main');
        darkToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
}