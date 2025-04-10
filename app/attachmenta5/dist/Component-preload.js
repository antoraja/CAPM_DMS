//@ui5-bundle attachmenta5/Component-preload.js
sap.ui.require.preload({
	"attachmenta5/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","attachmenta5/model/models"],(e,t)=>{"use strict";return e.extend("attachmenta5.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");this.getRouter().initialize()}})});
},
	"attachmenta5/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("attachmenta5.controller.App",{onInit(){}})});
},
	"attachmenta5/controller/View1.controller.js":'var attachRef;sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/core/Item"],(e,t,a,o)=>{"use strict";return e.extend("attachmenta5.controller.View1",{onInit(){var e=new a;this.getView().setModel(e,"attachmentItemsModel");attachRef=this;attachRef.loadAttachmentsList()},fileSizeExceed:function(e){t.show(cegControllerRef.oBundle.getText("fileSizeMustNotExceed5MB"))},fileType:function(){t.show(cegControllerRef.oBundle.getText("onlyPdfFilesAreAllowed"))},getBaseURL:function(){var e=this.getOwnerComponent().getManifestEntry("/sap.app/id");var t=e.replaceAll(".","/");var a=jQuery.sap.getModulePath(t);return a},onDownTempPressed:function(e){var a=this.getView().byId("tableInput").getValue();var o=this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/mainService").uri;if(a===""){this.getView().byId("tableInput").setValueState("Error");t.show("Please Provide a Table Name")}else{this.getView().byId("tableInput").setValueState("None");var r=window.open(o+"TableStructureSet(\'"+a+"\')/$value");if(r===null){t.show("Error generating template")}else{t.show("Template Downloaded Successfully")}}},onImport:function(e){var a=this.getView().byId("fileUploader");var o=a.oFileUpload.files;var r=this.getView().getModel("priceEstimationItemsModel");var n=this.getView().getModel("ExcelItemsModel");var s=this.getView().getModel("attachment");var l=this.getView().getModel("attachmentItemsModel");if(!o||o.length===0){sap.m.MessageToast.show("Please select a file first.");return}var i=o[0];var c=new FileReader;c.onload=function(e){var a=e.target.result;var o=(new Date).getTime()+i.name;var r=window.location.protocol+"//"+window.location.host;const n=i.type;var l={ID:"",content:a,filename:o,mime:n,url:r};s.create("/Attachments",l,{success:function(e,t){attachRef.loadAttachmentsList()},error:function(e){var a=e.message||(e.responseText?JSON.parse(e.responseText).error.message.value:"Unknown error");t.show("Error: "+a);console.log("Error upload File:",e)}})};c.readAsBinaryString(i)},onChange:async function(e){var a=this.byId("fileUploader");var o=a.getParameter("files");var r=o.files[0];var n=this;this.fileName=r.name;this.fileType=r.type;for(var s=0;s<this.getView().byId("radioButtonGroup").getButtons().length;s++){if(this.getView().byId("radioButtonGroup").getButtons()[s].getSelected()){this.operation=this.getView().byId("radioButtonGroup").getButtons()[s].getText()}}var l=new FileReader;l.onload=function(e){var a=e.currentTarget.result.match(/[^\\r\\n]+/g)[0].split("\\t").length;var o=e.currentTarget.result.match(/[^\\r\\n\\t]+/g);var r={Content:o};var s={slug:a+","+n.fileName+","+n.fileType+","+n.operation};n.getModel().create("/TableStructureSet",r,{headers:s,success:function(e,a){t.show("Data Uploaded Successfully!")},error:function(e){t.show("Data Uploaded Failed!")}})};l.readAsBinaryString(r)},onAttachmentAdded:async function(e){const t=e.getParameter("item").getFileObject();var a=(new Date).getTime()+t.name;const o=t.type;const r=e.getSource();const n=this.getView().getModel("attachment").oMessageParser._serviceUrl;const s=n+"/Attachments";this.getView().getModel("attachmentItemsModel").setProperty("/uploadUrl",s);r.removeAllHeaderFields();r.addHeaderField(new UploadCollectionParameter({name:"Slug",value:a}));r.addHeaderField(new UploadCollectionParameter({name:"Content-Type",value:o}));const l=await fetch(n,{method:"HEAD",credentials:"include"}).then(e=>e.headers.get("x-csrf-token"));if(l){r.addHeaderField(new sap.m.UploadCollectionParameter({name:"x-csrf-token",value:l}))}},onAfterUploadCompleted:function(){attachRef.loadAttachmentsList();this._uploadFile.close()},loadAttachmentsList:async function(){var e=this.getView().getModel("attachmentItemsModel");var t=this.getOwnerComponent().getModel("attachment");var a="/Attachments";t.read(a,{success:function(t,a){e.setData({attachmentItems:t.results});console.log(e);e.setProperty("/created",false)},error:function(e){console.log("Error in Attachment list:",e)}})},uploadFile:function(e){var a=this.getView().getModel("attachment");var o=this.getView().getModel("attachmentItemsModel");var r={ID:""};a.create("/Attachments",r,{success:function(e,t){attachRef.fileID=e.ID;o.setProperty("/created",true);attachRef.openFileAttachment()},error:function(e){var a=e.message||(e.responseText?JSON.parse(e.responseText).error.message.value:"Unknown error");t.show("Error: "+a);console.log("Error upload File:",e)}})},openFileAttachment:function(){var e=attachRef.getView();if(this._uploadFile){this._uploadFile.destroy();this._uploadFile=null}this._uploadFile=sap.ui.xmlfragment(e.getId(),"attachmenta5.view.uploadFile",this);e.addDependent(this._uploadFile);var t=this.getView().getModel("attachmentItemsModel");this._uploadFile.setModel(t);this._uploadFile.open()}})});\n',
	"attachmenta5/i18n/i18n.properties":'# This is the resource bundle for attachmenta5\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=App Title\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=App Title\n\n#XFLD,36\nattachmenta5-attachmenta5.flpTitle=attachmenta5\n',
	"attachmenta5/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"attachmenta5","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.17.1","toolsId":"8539cced-c8d4-493c-a3ff-1d884d07290f"},"dataSources":{"attachment":{"uri":"odata/v2/catalog/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"attachmenta5-attachmenta5":{"semanticObject":"attachmenta5","action":"attachmenta5","title":"{{attachmenta5-attachmenta5.flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"dependencies":{"minUI5Version":"1.134.1","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"attachmenta5.i18n.i18n"}},"attachment":{"dataSource":"attachment","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","controlAggregation":"pages","controlId":"app","transition":"slide","type":"View","viewType":"XML","path":"attachmenta5.view","async":true,"viewPath":"attachmenta5.view"},"routes":[{"name":"RouteView1","pattern":":?query:","target":["TargetView1"]}],"targets":{"TargetView1":{"id":"View1","name":"View1"}}},"rootView":{"viewName":"attachmenta5.view.App","type":"XML","id":"App","async":true}},"sap.cloud":{"public":true,"service":"a5approuter"}}',
	"attachmenta5/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"attachmenta5/view/App.view.xml":'<mvc:View controllerName="attachmenta5.controller.App"\n    displayBlock="true"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"attachmenta5/view/View1.view.xml":'<mvc:View controllerName="attachmenta5.controller.View1"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:l="sap.ui.layout"\n    xmlns:u="sap.ui.unified"\n    \txmlns:core="sap.ui.core"\n    xmlns:upload="sap.m.upload"\n    xmlns:uxap="sap.uxap"\n    \n\n    ><OverflowToolbar id="otb3"><Label text="DMS - File Upload"/><ToolbarSpacer/><Button press="uploadFile" text="Create"/></OverflowToolbar><Table\n        id="attachments-table"\n        sticky="HeaderToolbar,ColumnHeaders"\n        width="auto"\n        class="sapFDynamicPageAlignContent"\n      \n        items="{\n            path:\'attachmentItemsModel>/attachmentItems\'\n        }"><headerToolbar><OverflowToolbar id="attachments-table-overflowToolbar"><ToolbarSpacer id="attachments-table-overflowToolbar-toolbarSpacer"/><upload:ActionsPlaceholder\n                    id="attachments-table-overflowToolbar-upload"\n                    placeholderFor="UploadButtonPlaceholder"/></OverflowToolbar></headerToolbar><dependents   ><plugins.UploadSetwithTable              \n\n                httpRequestMethod="Post"\n                uploadUrl="{attachmentItemsModel>/uploadUrl}"\n                instantUpload="true"\n                uploadEnabled="true"\n                mode="SingleSelectMaster"\n                multiple="false"\n                cloudFilePickerEnabled="true"\n                fileSizeExceeded="fileSizeExceed"\n                fileTypeMismatch="fileType"\n                actions="attachments-table-overflowToolbar-upload"\n                beforeInitiatingItemUpload="onAttachmentAdded"\n                uploadCompleted="onAfterUploadCompleted"><rowConfiguration ><upload.UploadItemConfiguration\n                        fileNamePath="fileName"\n                        mediaTypePath="mediaType"\n                        previewablePath="previewable"\n                        fileSizePath="fileSize"\n                        isTrustedSourcePath="trustedSource"/></rowConfiguration></plugins.UploadSetwithTable></dependents><columns><Column width="40%" ><Label text="{i18n>filename}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdBy}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdAt}"/></Column><Column width="10%" hAlign="End"/></columns><ColumnListItem ><Link \n                wrapping="true"               \n                text="{attachmentItemsModel>filename}"\n                target="_blank"\n                href="{attachmentItemsModel>url}"/><Text              \n                text="{attachmentItemsModel>createdBy}"/><Text               \n                text="{path: \'attachmentItemsModel>createdAt\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'dd/MM/yyyy HH:mm:ss\' }}"/><Button                \n                icon="sap-icon://decline"\n                type="Transparent"\n                press="onAttachmentDelete"/></ColumnListItem></Table><u:FileUploader\n\t\t\tid="fileUploader"\n\t\t\tname="myFileUpload"\n            uploadUrl="/"           \n            enabled="{inputEnableModel>/isInputEnabled}"\t\t\t\n\t\t\ttooltip="Browser and Upload Items"\n            sameFilenameAllowed="true"\n            buttonText="Upload File"\n            buttonOnly="true"\n            uploadOnChange="true"\n            change="onImport"/><RadioButtonGroup id="radioButtonGroup"><buttons><RadioButton id="radioButton1" text="Insert"/><RadioButton id="radioButton2" text="Modify"/><RadioButton id="radioButton3" text="Delete"/></buttons></RadioButtonGroup><Button text="Execute Upload" press="onExecuteUpload" type="Emphasized" enabled="true"></Button><u:FileUploader id="fileUploaders" name="myFileUpload" tooltip=""  uploadOnChange="false" typeMissmatch="handleTypeMissmatch"\n\t\t\t\t\t\t\t\tchange="onChange"/><Input id="tableInput" width="100%" type="Text" placeholder="Enter Table Name ..." showSuggestion="true" suggestionItems="{/TableListSet}"\n\t\t\t\t\t\t\t\t\tshowValueHelp="true" valueHelpRequest="onValueHelpRequest" suggest="onSuggest" liveChange="onLiveChange"><suggestionItems><core:Item text="{NameOfTable}"/></suggestionItems></Input><Button text="Download Template" press="onDownTempPressed" enabled="true"></Button></mvc:View>',
	"attachmenta5/view/uploadFile.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:l="sap.ui.layout"\n    xmlns:u="sap.ui.unified"\n    xmlns:upload="sap.m.upload"\n    xmlns:uxap="sap.uxap"><Dialog ><Table\n        id="attachments-table"\n        sticky="HeaderToolbar,ColumnHeaders"\n        width="auto"\n        class="sapFDynamicPageAlignContent"\n      \n        items="{\n            path:\'attachmentItemsModel>/attachmentItems\'\n        }"><headerToolbar><OverflowToolbar id="attachments-table-overflowToolbar"><ToolbarSpacer id="attachments-table-overflowToolbar-toolbarSpacer"/><upload:ActionsPlaceholder\n                    id="attachments-table-overflowToolbar-upload"\n                    placeholderFor="UploadButtonPlaceholder"/></OverflowToolbar></headerToolbar><dependents   ><plugins.UploadSetwithTable              \n                uploadEnabled ="{attachmentItemsModel>/created}"\n                httpRequestMethod="Post"\n                uploadUrl="{attachmentItemsModel>/uploadUrl}"\n                instantUpload="false"\n                multiple="false"\n                cloudFilePickerEnabled="true"\n                fileSizeExceeded="fileSizeExceed"\n                fileTypeMismatch="fileType"\n                actions="attachments-table-overflowToolbar-upload"\n                beforeInitiatingItemUpload="onAttachmentAdded"\n                uploadCompleted="onAfterUploadCompleted"><rowConfiguration ><upload.UploadItemConfiguration\n                        fileNamePath="fileName"\n                        mediaTypePath="mediaType"\n                        previewablePath="previewable"\n                        fileSizePath="fileSize"\n                        isTrustedSourcePath="trustedSource"/></rowConfiguration></plugins.UploadSetwithTable></dependents><columns><Column width="40%" ><Label text="{i18n>filename}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdBy}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdAt}"/></Column><Column width="10%" hAlign="End"/></columns><ColumnListItem ><Link \n                wrapping="true"               \n                text="{attachmentItemsModel>filename}"\n                target="_blank"\n                href="{attachmentItemsModel>url}"/><Text              \n                text="{attachmentItemsModel>createdBy}"/><Text               \n                text="{path: \'attachmentItemsModel>createdAt\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'dd/MM/yyyy HH:mm:ss\' }}"/><Button                \n                icon="sap-icon://decline"\n                type="Transparent"\n                press="onAttachmentDelete"/></ColumnListItem></Table></Dialog></core:FragmentDefinition>  \n'
});
//# sourceMappingURL=Component-preload.js.map
