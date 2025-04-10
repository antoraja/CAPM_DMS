var attachRef;
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Item",
], (Controller,MessageToast, JSONModel, Item) => {
    "use strict";

    return Controller.extend("attachmenta5.controller.View1", {
        onInit() {
			var attachmentItemsModel = new JSONModel()

			
			this.getView().setModel(attachmentItemsModel, "attachmentItemsModel");

			
			  
			attachRef = this;
			// attachRef.openFileAttachment();
			attachRef.loadAttachmentsList();
		},


		onUpload: function (oEvent) {
            var oFileUploader = this.getView().byId("fileUploader"); 
            var aFiles = oFileUploader.oFileUpload.files; 
			var backendMstrModel = this.getView().getModel("attachment");

            if (!aFiles || aFiles.length === 0) {
                sap.m.MessageToast.show("Please select a file first.");
                return;
            }
            var oFile = aFiles[0]; 
            var oReader = new FileReader(); 
        
            oReader.onload = function (e) {
                var sFileContent = e.target.result;
     
			var fileName = new Date().getTime() + oFile.name;
			var host = window.location.protocol + "//" + window.location.host;

			const mimeType = oFile.type;
			var Payload = {
				ID: "",
				content:sFileContent,
				filename: fileName,
				mime: mimeType,
				url:host
			};

			backendMstrModel.create("/Attachments", Payload, {
				success: function (oData, response) {
					attachRef.loadAttachmentsList()
				},
				error: function (oError) {
					var errorMsg = oError.message || (oError.responseText ? JSON.parse(oError.responseText).error.message.value : "Unknown error");
					MessageToast.show("Error: " + errorMsg);
                    console.log("Error upload File:",oError)
				}
			});

            };
        
            oReader.readAsBinaryString(oFile);
        },

		loadAttachmentsList: async function () {

			var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")
			var backendMstrModel = this.getOwnerComponent().getModel("attachment");
			var entityPath = "/Attachments";
			backendMstrModel.read(entityPath, {
				success: function (oData, response) {
					attachmentItemsModel.setData({ attachmentItems: oData.results })
					console.log(attachmentItemsModel)
					attachmentItemsModel.setProperty("/created", false)

				},
				error: function (oError) {
                    console.log("Error in Attachment list:",oError)

				}
			});
		},

		// onAttachmentAdded: async function (oEvent, fileID) {
		// 	const oFileObject = oEvent.getParameter("item").getFileObject();
		// 	const baseUrl = this.getBaseURL()
		// 	//var fileName = oFileObject.name + new Date().getTime()
		// 	var fileName = new Date().getTime() + oFileObject.name;

		// 	var host = window.location.protocol + "//" + window.location.host;

		// 	oEvent.getSource().removeAllHeaderFields()
		// 	oEvent.getSource().addHeaderField(new Item({ key: "filename", text: fileName }));
		// 	oEvent.getSource().addHeaderField(new Item({ key: "mimetype", text: oFileObject.type }));
		// 	oEvent.getSource().addHeaderField(new Item({ key: "ID", text: attachRef.fileID }));
		// 	oEvent.getSource().addHeaderField(new Item({ key: "url", text: host }));
		// 	// var sUrl = `/odata/v2/catalog/Attachments(ID='${attachRef.fileID}')/content`
		// 	// var sUrl = `/odata/v2/catalog/Attachments(ID='${attachRef.fileID}')/content`
		// 	var serivceUrl = this.getView().getModel("attachment").oMessageParser._serviceUrl
		// 	var v = "101"
		// 	var sUrl = serivceUrl + `/Attachments(ID='${v}')/content`
		// 	// var sUrl = serivceUrl + `/Attachments(ID='${attachRef.fileID}')/content`
		// 	await this.getView().getModel("attachmentItemsModel").setProperty("/uploadUrl", sUrl)
		// 	await this.getView().getModel("attachmentItemsModel").setProperty("/filename", fileName)
			
		// 	//location.reload();

		// },

		

		// uploadFile: function (oEvent) {
		// 	var backendMstrModel = this.getView().getModel("attachment");
		// 	var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")

		// 	var Payload = {
		// 		ID: "",
		// 	};

		// 	backendMstrModel.create("/Attachments", Payload, {
		// 		success: function (oData, response) {
		// 			attachRef.fileID = oData.ID					
		// 			attachmentItemsModel.setProperty("/created", true)
		// 			attachRef.openFileAttachment();
		// 		},
		// 		error: function (oError) {
		// 			var errorMsg = oError.message || (oError.responseText ? JSON.parse(oError.responseText).error.message.value : "Unknown error");
		// 			MessageToast.show("Error: " + errorMsg);
        //             console.log("Error upload File:",oError)
		// 		}
		// 	});
		// },

		// openFileAttachment: function()
		// {
		// 	var oView = attachRef.getView();

		// 	if (this._uploadFile) {
		// 		this._uploadFile.destroy();
		// 		this._uploadFile = null;
		// 	}

		// 	this._uploadFile = sap.ui.xmlfragment(
		// 		oView.getId(),
		// 		"attachmenta5.view.uploadFile",
		// 		this
		// 	);
		// 	oView.addDependent(this._uploadFile);			
		// 	var attachmentItemsModel = this.getView().getModel("attachmentItemsModel");
		// 	this._uploadFile.setModel(attachmentItemsModel);
		// 	this._uploadFile.open();
		// }
    });
});