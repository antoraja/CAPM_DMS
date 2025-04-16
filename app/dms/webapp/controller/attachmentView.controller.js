sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",   
    "sap/ui/core/Item",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,JSONModel, MessageBox, MessageToast, Item, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sap.dms.dms.controller.attachmentView", {
        onInit() {

            //var attachmentItemsModel = new JSONModel();           
            //this.getView().setModel(attachmentItemsModel, "attachmentItemsModel");
          
           this.getView().setModel(this.createAttachmentsExtensionModel(), "AttachmentsExtension");
        },
        createAttachmentID : function()
        {
            this.attachID = this.generateGUID();
            var oEntry = { "attachID": this.attachID  }

            this.getOwnerComponent().getModel().create("/attachmentItems", oEntry, {
                success: function (odata, response) 
                {                   
                    sap.m.MessageToast.show("Attachment id Initialized");                   
                },
                error: function (oError) {
                    //sap.m.MessageToast.show("Error adding attachment id");                    
                }
            });
        },
        loadAttachmentsModel: function (oData) {
            var inputEnableModel = this.getView().getModel("inputEnableModel")
            var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")
            if (oData.attachments) 
                attachmentItemsModel.setData({ attachmentItems: oData.attachments.results });
            else {
                var errorJson = JSON.parse(oError.responseText);
                sctControllerRef._showServiceError(errorJson)
                inputEnableModel.setProperty("/busy", false)
            }
        },
        getBaseURL: function () {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath;
        },
        onAttachmentAdded: async function (oEvent) {

            const oFileObject = oEvent.getParameter("item").getFileObject();
            const baseUrl = thisRef.getBaseURL()
            oEvent.getSource().removeAllHeaderFields()
            oEvent.getSource().addHeaderField(new Item({ key: "filename", text: oFileObject.name }));
            oEvent.getSource().addHeaderField(new Item({ key: "mimetype", text: oFileObject.type }));
            oEvent.getSource().addHeaderField(new Item({ key: "url", text: baseUrl }));

           /* var thisRef = this;
            const keyNumber = Math.floor(Math.random() * 100).toString();
            var oEntry = { "PurchaseNo": keyNumber }

            this.getView().getModel().create("/dmsHeader", oEntry, {
                success: function (odata, response) 
                {
                    var prNumber = odata.PurchaseNo;
                    const oFileObject = oEvent.getParameter("item").getFileObject();
                    const baseUrl = thisRef.getBaseURL()
                    oEvent.getSource().removeAllHeaderFields()
                    oEvent.getSource().addHeaderField(new Item({ key: "filename", text: oFileObject.name }));
                    oEvent.getSource().addHeaderField(new Item({ key: "mimetype", text: oFileObject.type }));
                    oEvent.getSource().addHeaderField(new Item({ key: "url", text: baseUrl }));
                    //const sUrl = baseUrl + '/odata/v2/dms-service/Attachments(attachmentId='+prNumber+')/content';
                    const sUrl = 'https://port4004-workspaces-ws-qth5k.in30.applicationstudio.cloud.sap/odata/v2/dms-service/Attachments(attachmentId='+prNumber+')/content';
                    //thisRef.getView().getModel("attachmentItemsModel").setProperty("/uploadUrl", sUrl);
                    thisRef.getView().byId("uploadSets").setUploadUrl(sUrl);
                    
                },
                error: function (oError) {
                    sap.m.MessageToast.show("Error adding Product");
                    
                } 
            });*/

           

           
        },
        // Deletes Attachment
        onAttachmentDelete: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext("attachmentItemsModel")
            const oModel = this.getOwnerComponent().getModel("backendMstr");
            var gid = oBindingContext.getObject().gid;
            const sPath = `/Attachments(ID='${sctControllerRef.sctPurchaseReqNo}',app_typ='${sctControllerRef.eTenderMasterAppType}',gid='${gid}')`
            const sFilename = oBindingContext.getProperty("filename")
            const sMessage = sctControllerRef.oBundle.getText("confirmAttachmentDeletion", [sFilename]);
            MessageBox.confirm(sMessage, {
                onClose: ((oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: () => {
                                MessageToast.show(sctControllerRef.oBundle.getText("fileDeletedSuccessfully"));
                                sctControllerRef.loadAttachmentsList()
                            },
                            error: () => {
                                var errorJson = JSON.parse(oError.responseText);
                                sctControllerRef._showServiceError(errorJson)
                                sctControllerRef.loadAttachmentsList()
                            }
                        });
                    }
                })
            });
        },
        onAfterUploadCompleted: function (oEvent) {
            if (oEvent.getParameter("status") === 204) {
                MessageToast.show("Uploaded");
                this.loadAttachmentsList()
            }
            else {
                MessageToast.show("Upload Error");
            }
        },
        // load internal Attachment
        loadAttachmentsList: async function () {          
            var attachmentItemsModel = this.getView().getModel("attachmentItemsModel")
            var oFilterID = new sap.ui.model.Filter("attachID", FilterOperator.EQ, this.attachID);
            
            var oCombinedFilter = new sap.ui.model.Filter({
                filters: [oFilterID],
                and: true
            });
            var filterArray = [oCombinedFilter];
            var attachModel = this.getOwnerComponent().getModel();
            var entityPath = "/attachmentItems";
            attachModel.read(entityPath, {
                filters: filterArray,
                success: function (oData) {
                    attachmentItemsModel.setData({ attachmentItems: oData.results })
                    console.log(attachmentItemsModel)
                },
                error: function (oError) {
                    var errorJson = JSON.parse(oError.responseText);
                    MessageBox.error(errorJson)
                }
            });
        },

        createAttachmentsExtensionModel: function () {
            const oModel = new JSONModel({
                uploadUrl: "",
                fileTypes: "pdf,png",
                mediaTypes: "application/pdf,image/png"
            });
            return oModel;
        },

        onFilenamePress: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            const sPath = oBindingContext.getPath();
    
            const sServiceUrl = oBindingContext.getModel().sServiceUrl;
            const sParsedServiceUrl = sServiceUrl.indexOf("/") === 2 ? sServiceUrl.substring(2) : sServiceUrl;
            const sUrl = sParsedServiceUrl + sPath + "/content";
            window.open(sUrl, '_blank');
          },
    
          onBeforeInitiatingItemUpload: function (oEvent) {

            this.createAttachmentID();
    
            // Retrieve file info
            const oFileObject = oEvent.getParameter("item").getFileObject();
            
            oEvent.getSource().removeAllHeaderFields()
            oEvent.getSource().addHeaderField(new Item({ key: "filename", text: oFileObject.name }));
            oEvent.getSource().addHeaderField(new Item({ key: "mimetype", text: oFileObject.type }));
         
            const sPath = "/attachmentItems(attachID='"+this.attachID+"')"
            const sServiceUrl = this.getView().getModel().sServiceUrl;
            const sParsedServiceUrl = sServiceUrl.indexOf("/") === 2 ? sServiceUrl.substring(2) : sServiceUrl;
    
            const sUrl = sParsedServiceUrl + sPath + "/content";
    
            this.getView().getModel("AttachmentsExtension").setProperty("/uploadUrl", sUrl);        
          },
    
          onUploadCompleted: function (oEvent) {
            oEvent.getSource().removeAllHeaderFields()
            this._refreshModel();
          },
    
          _refreshModel: function () {
            const oModel = this.getView().getModel();
            oModel.refresh();
          },
    
          onDeleteButtonPress: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            const oModel = oBindingContext.getModel();
            const sPath = oBindingContext.getPath();
            const sFilename = oBindingContext.getProperty("filename")
            const sMessage = this.getView().getModel("i18n").getResourceBundle().getText("confirmAttachmentDeletion", [sFilename]);
            MessageBox.confirm(sMessage, {
              onClose: ((oAction) => {
                if (oAction === MessageBox.Action.OK) {
                  oModel.remove(sPath, {
                    error: () => {
                      this._refreshModel()
                    }
                  });
                }
              })
            });
          },   
           generateGUID : function()
           {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }   
    
    });
});