const cds = require('@sap/cds');
const sdm = require("./sdm-utils");

const { Attachments } = cds.entities('my.bookshop');

module.exports = cds.service.impl((srv) => {
    srv.on('CREATE', 'Attachments', onCreate);
});

const onCreate = async (request, next) => {

    var folder = "SDM"            
     const folderId = await sdm.getOrCreateFolderId(folder);
     const fileName = request.data.filename;
     const mimeType = request.data.mime;

     const result = await sdm.createDocumentInFolder(folder, fileName, mimeType, request.data.content)
     const documentId = result?.data?.properties["cmis:objectId"]?.value;
     const url = request.data.url + "/odata/v2/catalog/Attachments(ID='" + request.data.ID + "')/content";

    const attachment = {
        "ID": "",                  
        "url": url,
        "objectId": documentId,
        "mediaType": mimeType,
        "filename": fileName,                 
        "folderId": folderId,
    }
    const count = await INSERT.into(Attachments).entries(attachment);
    console.log("count:",count)
    return;
}



