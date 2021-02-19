module.exports = function(params) {
    return typeof params === "string" && params.trim().length > 0;
}