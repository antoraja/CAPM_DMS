const getUrlPath = (request) => {
    if(request._.req.path.includes('batch')) {
        return request._path
    } else {
        return request._.req.path ?? ''
    }
}
 
const asArray = (x) => (Array.isArray(x) ? x : [x])
 
 
module.exports = {
    getUrlPath,
    asArray
}