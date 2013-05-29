var appConfig = {
    fileApi: supportsFileApi()
};

/* Taken from Modernizer: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/file/api.js */
function supportsFileApi() {
    return !!(window.File && window.FileList && window.FileReader);
}

function showWarning(message) {
    var body = document.getElementsByTagName("body")[0],
        warning = document.createElement("div");

    warning.className = "warning";
    warning.textContent = message;

    body.insertBefore(warning, body.firstChild);
}
