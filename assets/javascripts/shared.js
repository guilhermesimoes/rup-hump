var appConfig = {
    fileApi: supportsFileApi()
};

/* Taken from Modernizer: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/file/api.js */
function supportsFileApi() {
    return !!(window.File && window.FileList && window.FileReader);
}
