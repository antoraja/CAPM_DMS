const cds = require('@sap/cds');
const sdm = require("./sdm-utils");
const { getUrlPath } = require("./common");
const { Attachments } = cds.entities('my.bookshop');

module.exports = cds.service.impl((srv) => {
    srv.on('CREATE', 'Attachments', onCreate);
    srv.on('READ', 'Attachments', onReadAttachments);
});

const onCreate = async (request, next) => {
    try {
        const folder = "SDM";
        const fileName = request.data.filename;
        const mimeType = request.data.mime;
        const content = request.data.content;
        const baseUrl = request.data.url || ""; // Base URL should be provided by the client

        // Step 1: Get or create folder in SDM
        const folderId = await sdm.getOrCreateFolderId(folder);

        // Step 2: Upload the document and get objectId
        const result = await sdm.createDocumentInFolder(folder, fileName, mimeType, content);
        const objectId = result?.data?.properties["cmis:objectId"]?.value;
        // var ID = "";
        // Step 3: Insert record (CAP will generate cuid automatically)
        await INSERT.into(Attachments).entries({
            ID:"", 
            folderId,
            objectId,
            mediaType: mimeType,
            filename: fileName,
            mime: mimeType,
            content: content,
        });

        // const ID = insertResult[0]?.ID; 
        // const ID = await SELECT.one.from(Attachments).ID

        const inserted = await SELECT.one.from(Attachments).where({ objectId });
        const ID = inserted.ID
        // Step 4: Construct the URL using the generated ID
        const fullUrl = `${baseUrl}/odata/v2/catalog/Attachments(ID='${ID}')/content`;

        // Step 5: Update the record with the URL
        await UPDATE(Attachments).set({ url: fullUrl }).where({ ID });

        // Optional: return the full attachment info
        const finalAttachment = await SELECT.one.from(Attachments).where({ ID });
        return finalAttachment;

    } catch (err) {
        console.error("Error in onCreate:", err);
        return request.reject(500, "Failed to create attachment.");
    }
};


// const onCreate = async (request, next) => {

//     var folder = "SDM"            
//      const folderId = await sdm.getOrCreateFolderId(folder);
//      const fileName = request.data.filename;
//      const mimeType = request.data.mime;

//      const result = await sdm.createDocumentInFolder(folder, fileName, mimeType, request.data.content)
//      const documentId = result?.data?.properties["cmis:objectId"]?.value;
//      const url = request.data.url + "/odata/v2/catalog/Attachments(ID='" + request.data.ID + "')/content";

//     const attachment = {
//         "ID": "",                  
//         "url": url,
//         "objectId": documentId,
//         "mediaType": mimeType,
//         "filename": fileName,                 
//         "folderId": folderId,
//     }
//     const count = await INSERT.into(Attachments).entries(attachment);
//     console.log("count:",count)
//     return;
// }

const onReadAttachments = async (request, next) => {

    if (request.data.ID && getUrlPath(request).includes('/content')) {

        // const attachment = await SELECT.one.from(Attachments).where({
        //     ID: request.data.ID
        // });

        const ID = request.data.ID;
        if (!ID) return req.reject(400, "Missing ID");

        // const attachment = await SELECT.one.from(Attachments)
        const attachment = await SELECT.one.from(Attachments).where({
            ID: request.data.ID
        });
        console.log("Attachment Entity:",attachment)
        if (attachment.objectId) {

            var objectId = attachment.objectId;
            try {
                const content = await sdm.getFileContent(objectId)
                return {
                    value: content.data,
                    '$mediaContentType': content.headers['content-type'],
                    '$mediaContentDisposition': 'inline'
                };
            } catch (oError) {
                return request.reject(oError?.response?.status, 'Failed GET request to fetch the document data from SAP-SDM: ' + oError?.message + ': ' + oError?.response?.statusText)
            }
        }
    } else {
        return next();
    }

};


