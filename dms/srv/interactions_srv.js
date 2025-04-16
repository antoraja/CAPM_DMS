const cds = require("@sap/cds");
const xsenv = require('@sap/xsenv');
const sdm = require("./sdm-utils");
const { getUrlPath } = require("./common");

module.exports = cds.service.impl((srv) => {

const { attachmentItems }  = cds.entities('sap.dms');

const onUploadAttachment = async (request, next) => {
        try {      
            console.log("request.headers",request.headers.mimetype)

                const nowISO = new Date().toISOString();     
                var storeFolder = "dmstest"
                var folder = request.data.attachID + '_' + storeFolder;
                const folderId = await sdm.getOrCreateFolderId(folder);
                const fileName = nowISO;
                const mimeType = request.headers.mimetype;
                const result = await sdm.createDocumentInFolder(folder, fileName, mimeType, request.data.content)

                const documentId = result?.data?.properties["cmis:objectId"]?.value;             
                const url = "/odata/v2/dms-service/attachmentItems(attachID="+request.data.attachID+")/content";
                
                const attachmentData = {
                    "attachID": request.data.attachID, 
                    "folderId": folderId,
                    "objectId": documentId,
                    "mediaType": request.headers.mimetype,
                    "filename": request.headers.filename,
                    "url": url,
                    "createdBy": request.user.id,
                    "createdAt": nowISO,
                    "modifiedBy": request.user.id,
                    "modifiedAt": nowISO
                }

               await DELETE.from(attachmentItems).where ({attachID: request.data.attachID}); 
               const updateCount = await UPSERT.into(attachmentItems).entries(attachmentData);
              console.log("updateCount",updateCount)
              request.reply("Attachment Uploaded...")
        } catch (error) {
            console.log("error",error)
            request.reject(error?.status, error?.response?.data?.message);
        }

};

const onReadAttachments = async (request, next) => {

    if (request.data.attachID && getUrlPath(request).includes('/content')) {

        const attachment = await SELECT.one.from(attachmentItems).where({
            attachID: request.data.attachID
        });

        if (attachment.objectId) {
            var objectId = attachment.objectId;
            try {
                const content = await sdm.getFileContent(objectId)
                // return {
                //     value: content.value,
                //     '$mediaContentType': attachment.mediaType,
                //     '$mediaContentDisposition': 'inline'
                // };
                return {
                    value: content.value,
                    '$mediaContentType': attachment.mediaType,
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

srv.on('UPDATE', 'attachmentItems', onUploadAttachment);

srv.on('READ', 'attachmentItems', onReadAttachments);

})

