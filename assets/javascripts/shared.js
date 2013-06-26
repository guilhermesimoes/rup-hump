var appConfig = {
    fileApi: supportsFileApi()
};

/* Taken from Modernizer: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/file/api.js */
function supportsFileApi() {
    return !!(window.File && window.FileList && window.FileReader);
}

/* Taken from Underscore: http://underscorejs.org/docs/underscore.html#section-65 */
function debounce(func, wait, immediate) {
    var timeout, result;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
        }
        return result;
    };
}

function showWarning(message) {
    var body = document.getElementsByTagName("body")[0],
        warning = document.createElement("div");

    warning.className = "warning";
    warning.textContent = message;

    body.insertBefore(warning, body.firstChild);
}
