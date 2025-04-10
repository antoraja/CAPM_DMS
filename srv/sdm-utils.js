
const cds = require('@sap/cds')
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client')
// const { SDM } = require('./config')
const { PassThrough } = require('stream')
const FormData = require('form-data')

// const log = cds.log('sdm-utils')

const getFileContent = async (objectId) => {
    const requestConfig = {
        method: "GET",
        responseType: "arraybuffer",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c" + "/root",
        params: {
            objectId: objectId,
            cmisselector: "content"
        }
    }
    return _executeRequest(requestConfig)
}

const getObjectProperties = async (objectId) => {
    const requestConfig = {
        method: "GET",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c" + "/root",
        params: {
            objectId: objectId,
            cmisselector: "properties"
        }
    }
    return _executeRequest(requestConfig)
}

const createFolder = async (folderName) => {
    const formData = new FormData()
    formData.append("cmisaction", "createFolder")
    formData.append("propertyId[0]", "cmis:name")
    formData.append("propertyValue[0]", folderName)
    formData.append("propertyId[1]", "cmis:objectTypeId")
    formData.append("propertyValue[1]", "cmis:folder")
    formData.append("succint", "true")
    formData.append("includeAllowableActions", "true")

    const data = formData.getBuffer()
    const headers = formData.getHeaders()

    const requestConfig = {
        method: "POST",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c" + "/root/",
        headers: headers,
        data: data
    }
    console.log("createFolder-request:",requestConfig)
    return _executeRequest(requestConfig)
}

const createDocumentInFolder = async (folderName, fileName, contentType, content) => {
    let streamBuffer = await _transformStreamToBuffer(content)
    const formData = new FormData()
    formData.append("cmisaction", "createDocument")
    formData.append("propertyId[0]", "cmis:name")
    formData.append("propertyValue[0]", fileName)
    formData.append("propertyId[1]", "cmis:objectTypeId")
    formData.append("propertyValue[1]", "cmis:document")
    console.log("T2");
    
    formData.append("file", streamBuffer, {
        "filename": fileName,
        "contentType": contentType
    });
    formData.append("succint", "true")
    formData.append("includeAllowableActions", "true")

    const data = formData.getBuffer()
    const headers = formData.getHeaders()
    
    const requestConfig = {
        method: "POST",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c" + "/root/" + folderName,
        headers: headers,
        data: data
    }

    return _executeRequest(requestConfig)
}

const deleteDocumentInFolder = async (folderId, documentId) => {
    const formData = new FormData()
    formData.append("cmisaction", "delete")
    formData.append("objectId", documentId)
    const data = formData.getBuffer()
    const headers = formData.getHeaders()
    const requestConfig = {
        method: "POST",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c" + "/root/" + folderId,
        headers: headers,
        data: data
    }
    return _executeRequest(requestConfig)
}

const _transformStreamToBuffer = (data) => {
    console.log("Buffer",data);
    return new Promise((resolve,reject) => {

        const stream = new PassThrough()
        const chunks = []
        stream.on('data', (chunk) => {
            chunks.push(chunk)
        })
        stream.on('end', () => {
            resolve(Buffer.concat(chunks))
        })
        stream.on('error', (error) => {
            reject(error)
        })
        data.pipe(stream)
    })
}

// const getFolder = (folderName) => {  
//     const requestConfig = {
//         method: "GET",
//         url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c",
//         params: {
//             q: encodeURIComponent(`SELECT * FROM cmis:folder WHERE cmis:name = '${folderName}'`),
//             cmisselector: "query"
//         }
//     }
//     return _executeRequest(requestConfig);
// }
const getFolder = (folderName) => {  
    const requestConfig = {
        method: "GET",
        url: "browser/" + "0b25edc2-176d-4153-a3b4-64a6d16c1c8c",
        params: {
            q: encodeURIComponent(`SELECT cmis:objectId, cmis:name FROM cmis:folder WHERE cmis:name = '${folderName}'`),
            cmisselector: "query"
        }
    } 
    return _executeRequest(requestConfig);
}

// const getOrCreateFolderId = async (folderName) => {
//     const folderId = (await getFolder(folderName))?.data?.results[0]?.properties["cmis:objectId"]?.value
//     return folderId ? folderId : (await createFolder(folderName))?.data?.properties["cmis:objectId"]?.value
// } 
const getOrCreateFolderId = async (folderName) => {
    const folderId = (await getFolder(folderName))?.data?.results[0]?.properties["cmis:objectId"]?.value
    console.log("folder:",folderId)
    return folderId ? folderId : (await createFolder(folderName))?.data?.properties["cmis:objectId"]?.value
} 

const getFolderId = async (folderName) => {
    const folderId = (await getFolder(folderName))?.data?.results[0]?.properties["cmis:objectId"]?.value
    return folderId ? folderId : ''
}

const _executeRequest = (requestConfig) => {
    // log._info && log.info(requestConfig.method, requestConfig.url, 'to SDM');
    console.log(requestConfig.method, 'to_SDM');
    // requestConfig.method = "PUT"
    // requestConfig.fetchCsrfToken = false
    var repo = "0b25edc2-176d-4153-a3b4-64a6d16c1c8c"
    console.log("req:", requestConfig);
    if(requestConfig.method == "POST"){
        requestConfig.url = "browser/" + repo + "/root/",
        requestConfig.fetchCsrfToken = false
    }
    return executeHttpRequest({ destinationName: 'EB_GECM_SDM' },requestConfig);
}


module.exports = {
    getFileContent,
    getObjectProperties,
    createFolder,
    createDocumentInFolder,
    deleteDocumentInFolder,
    getFolder,
    getFolderId,
    getOrCreateFolderId
}