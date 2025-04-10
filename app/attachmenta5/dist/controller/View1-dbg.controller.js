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

		fileSizeExceed: function (oEvent) {
			MessageToast.show(cegControllerRef.oBundle.getText("fileSizeMustNotExceed5MB"));
		},
		fileType: function () {
			MessageToast.show(cegControllerRef.oBundle.getText("onlyPdfFilesAreAllowed"));
		},
		getBaseURL: function () {
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);
			return appModulePath;
		},


		onDownTempPressed: function (oEvent) {
			var inputTableName = this.getView().byId("tableInput").getValue();
			var mainUri = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/mainService").uri;

			// Check whether table name field is not initial
			if (inputTableName === "") {
				this.getView().byId("tableInput").setValueState("Error");
				MessageToast.show("Please Provide a Table Name");
			} else {
				//Reset the value state for input field in case it was error
				this.getView().byId("tableInput").setValueState("None");
				var wStream = window.open(mainUri + "TableStructureSet('" + inputTableName + "')/$value");
				if (wStream === null) {
					MessageToast.show("Error generating template");
				} else {
					MessageToast.show("Template Downloaded Successfully");
				}

			}
		},




		onImport: function (oEvent) {
            var oFileUploader = this.getView().byId("fileUploader"); // Get FileUploader control
            var aFiles = oFileUploader.oFileUpload.files; // Get the uploaded file(s)
            var priceEstimationItemsModel = this.getView().getModel("priceEstimationItemsModel");
            var ExcelItemsModel = this.getView().getModel("ExcelItemsModel");
        
			var backendMstrModel = this.getView().getModel("attachment");
			var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")

            if (!aFiles || aFiles.length === 0) {
                sap.m.MessageToast.show("Please select a file first.");
                return;
            }
        
            var oFile = aFiles[0]; // Get the first file
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
					// attachRef.fileID = oData.ID					
					// attachmentItemsModel.setProperty("/created", true)
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

		onChange:async function (oEvent) {
			var oFileUploader = this.byId("fileUploader");
			var xlsDomRef = oFileUploader.getParameter('files');
			var xlsFile = xlsDomRef.files[0];
			var that = this;

			this.fileName = xlsFile.name;
			this.fileType = xlsFile.type;

			//Get selected Radio Button
			for (var j = 0; j < this.getView().byId("radioButtonGroup").getButtons().length; j++) {
				if (this.getView().byId("radioButtonGroup").getButtons()[j].getSelected()) {
					this.operation = this.getView().byId("radioButtonGroup").getButtons()[j].getText();
				}
			}

			var oReader = new FileReader();
			oReader.onload = function (oReadStream) {
				//Get the number of columns present in the file uploaded & convert the regex unformatted stream
				//to array. This will be parsed at the backend SAP
				var noOfcolumn = oReadStream.currentTarget.result.match(/[^\r\n]+/g)[0].split("\t").length;
				var binContent = oReadStream.currentTarget.result.match(/[^\r\n\t]+/g);

				//Provide the binary content as payload. This will be received as an XSTRING in
				//SAP under the CREATE_STREAM method of media resource structure
				var payload = {
					"Content": binContent
				};

				//Provide additional details through header. Column No, Filename + File Type + TableName + Operation
				var header = {
					"slug": noOfcolumn + "," + that.fileName + "," + that.fileType + "," + that.operation
				};

				//Call a CREATE_STREAM activity
				that.getModel().create("/TableStructureSet", payload, {
					headers: header,
					success: function (oData, oResponse) {
						MessageToast.show("Data Uploaded Successfully!");
					},
					error: function (oError) {
						MessageToast.show("Data Uploaded Failed!");
					}
				});

			};

			// Read the file as a binary String. Do not read URI, you have to encode before sending
			oReader.readAsBinaryString(xlsFile);
				
		},

		onAttachmentAdded: async function (oEvent) {
			const oFileObject = oEvent.getParameter("item").getFileObject();
			var fileName = new Date().getTime() + oFileObject.name;
			const mimeType = oFileObject.type;
		
			const uploadCollection = oEvent.getSource();
		
			// Construct the correct service base URL
			const serviceUrl = this.getView().getModel("attachment").oMessageParser._serviceUrl;
		
			// Set direct media upload URL (no ID needed in POST for CAP)
			const uploadUrl = serviceUrl + "/Attachments";
		
			// Set upload URL to model so UploadCollection knows where to send
			this.getView().getModel("attachmentItemsModel").setProperty("/uploadUrl", uploadUrl);
		
			// Remove existing headers just in case
			uploadCollection.removeAllHeaderFields();
		
			// Add required headers
			uploadCollection.addHeaderField(new UploadCollectionParameter({
				name: "Slug",
				value: fileName
			  }));
			  
			  uploadCollection.addHeaderField(new UploadCollectionParameter({
				name: "Content-Type",
				value: mimeType
			  }));
			  
		
			// Optionally: if your service requires a CSRF token, add it here:
			const token = await fetch(serviceUrl, {
				method: "HEAD",
				credentials: "include"
			}).then(res => res.headers.get("x-csrf-token"));
		
			if (token) {
				uploadCollection.addHeaderField(new sap.m.UploadCollectionParameter({
					name: "x-csrf-token",
					value: token
				}));
			}
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
		onAfterUploadCompleted: function()
		{
			attachRef.loadAttachmentsList();
			this._uploadFile.close();
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
					// var errorJson = JSON.parse(oError.responseText);
					// cegControllerRef._showServiceError(errorJson)
				}
			});
		},

		uploadFile: function (oEvent) {
			var backendMstrModel = this.getView().getModel("attachment");
			var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")

			var Payload = {
				ID: "",
			};

			backendMstrModel.create("/Attachments", Payload, {
				success: function (oData, response) {
					attachRef.fileID = oData.ID					
					attachmentItemsModel.setProperty("/created", true)
					attachRef.openFileAttachment();
				},
				error: function (oError) {
					var errorMsg = oError.message || (oError.responseText ? JSON.parse(oError.responseText).error.message.value : "Unknown error");
					MessageToast.show("Error: " + errorMsg);
                    console.log("Error upload File:",oError)
				}
			});
		},

		openFileAttachment: function()
		{
			var oView = attachRef.getView();

			if (this._uploadFile) {
				this._uploadFile.destroy();
				this._uploadFile = null;
			}

			this._uploadFile = sap.ui.xmlfragment(
				oView.getId(),
				"attachmenta5.view.uploadFile",
				this
			);
			oView.addDependent(this._uploadFile);			
			var attachmentItemsModel = this.getView().getModel("attachmentItemsModel");
			this._uploadFile.setModel(attachmentItemsModel);
			this._uploadFile.open();
		}
    });
});