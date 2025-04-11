//@ui5-bundle attachmenta5/Component-preload.js
sap.ui.require.preload({
	"attachmenta5/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","attachmenta5/model/models"],(e,t)=>{"use strict";return e.extend("attachmenta5.Component",{metadata:{manifest:"json",interfaces:["sap.ui.core.IAsyncContentCreation"]},init(){e.prototype.init.apply(this,arguments);this.setModel(t.createDeviceModel(),"device");this.getRouter().initialize()}})});
},
	"attachmenta5/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],e=>{"use strict";return e.extend("attachmenta5.controller.App",{onInit(){}})});
},
	"attachmenta5/controller/View1.controller.js":'var attachRef;sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/core/Item"],(e,t,a,o)=>{"use strict";return e.extend("attachmenta5.controller.View1",{onInit(){var e=new a;this.getView().setModel(e,"attachmentItemsModel");attachRef=this;attachRef.loadAttachmentsList()},onUpload:function(e){var a=this.getView().byId("fileUploader");var o=a.oFileUpload.files;var s=this.getView().getModel("attachment");if(!o||o.length===0){sap.m.MessageToast.show("Please select a file first.");return}var r=o[0];var n=new FileReader;n.onload=function(e){var a=e.target.result;var o=(new Date).getTime()+r.name;var n=window.location.protocol+"//"+window.location.host;const i=r.type;var l={ID:"",content:a,filename:o,mime:i,url:n};s.create("/Attachments",l,{success:function(e,t){attachRef.loadAttachmentsList()},error:function(e){var a=e.message||(e.responseText?JSON.parse(e.responseText).error.message.value:"Unknown error");t.show("Error: "+a);console.log("Error upload File:",e)}})};n.readAsBinaryString(r)},loadAttachmentsList:async function(){var e=this.getView().getModel("attachmentItemsModel");var t=this.getOwnerComponent().getModel("attachment");var a="/Attachments";t.read(a,{success:function(t,a){e.setData({attachmentItems:t.results});console.log(e);e.setProperty("/created",false)},error:function(e){console.log("Error in Attachment list:",e)}})}})});\n',
	"attachmenta5/i18n/i18n.properties":'# This is the resource bundle for attachmenta5\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=App Title\n\n#YDES: Application description\nappDescription=An SAP Fiori application.\n#XTIT: Main view title\ntitle=App Title\n\n#XFLD,36\nattachmenta5-attachmenta5.flpTitle=attachmenta5\n',
	"attachmenta5/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"attachmenta5","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.17.1","toolsId":"8539cced-c8d4-493c-a3ff-1d884d07290f"},"dataSources":{"attachment":{"uri":"odata/v2/catalog/","type":"OData","settings":{"annotations":[],"odataVersion":"2.0"}}},"crossNavigation":{"inbounds":{"attachmenta5-attachmenta5":{"semanticObject":"attachmenta5","action":"attachmenta5","title":"{{attachmenta5-attachmenta5.flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"dependencies":{"minUI5Version":"1.134.1","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"attachmenta5.i18n.i18n"}},"attachment":{"dataSource":"attachment","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","controlAggregation":"pages","controlId":"app","transition":"slide","type":"View","viewType":"XML","path":"attachmenta5.view","async":true,"viewPath":"attachmenta5.view"},"routes":[{"name":"RouteView1","pattern":":?query:","target":["TargetView1"]}],"targets":{"TargetView1":{"id":"View1","name":"View1"}}},"rootView":{"viewName":"attachmenta5.view.App","type":"XML","id":"App","async":true}},"sap.cloud":{"public":true,"service":"a5approuter"}}',
	"attachmenta5/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"attachmenta5/view/App.view.xml":'<mvc:View controllerName="attachmenta5.controller.App"\n    displayBlock="true"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"><App id="app"></App></mvc:View>',
	"attachmenta5/view/View1.view.xml":'<mvc:View controllerName="attachmenta5.controller.View1"\n    xmlns="sap.m"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns:l="sap.ui.layout"\n    xmlns:u="sap.ui.unified"\n    \txmlns:core="sap.ui.core"\n    xmlns:upload="sap.m.upload"\n    xmlns:uxap="sap.uxap"\n    \n\n    ><OverflowToolbar id="otb3"><Label text="DMS - File Upload"/><ToolbarSpacer/></OverflowToolbar><u:FileUploader\n\t\t\tid="fileUploader"\n\t\t\tname="myFileUpload"\n            uploadUrl="/"           \n            enabled="{inputEnableModel>/isInputEnabled}"\t\t\t\n\t\t\ttooltip="Browser and Upload Items"\n            sameFilenameAllowed="true"\n            buttonText="Upload File"\n            buttonOnly="true"\n            uploadOnChange="true"\n            change="onUpload"/><ScrollContainer height="400px" vertical="true" horizontal="false" class="sapUiSmallMarginBottom"><Table\n      id="attachments-table"\n      sticky="HeaderToolbar,ColumnHeaders"\n      width="auto"\n      growingScrollToLoad="true"\n      class="sapFDynamicPageAlignContent"\n      items="{\n          path:\'attachmentItemsModel>/attachmentItems\'\n      }"><headerToolbar><OverflowToolbar id="attachments-table-overflowToolbar"><ToolbarSpacer id="attachments-table-overflowToolbar-toolbarSpacer"/><upload:ActionsPlaceholder\n                  id="attachments-table-overflowToolbar-upload"\n                  placeholderFor="UploadButtonPlaceholder"/></OverflowToolbar></headerToolbar><columns><Column width="40%" ><Label text="{i18n>filename}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdBy}"/></Column><Column width="20%" demandPopin="true"><Label text="{i18n>createdAt}"/></Column><Column width="10%" hAlign="End"/></columns><ColumnListItem ><Link \n              wrapping="true"               \n              text="{attachmentItemsModel>filename}"\n              target="_blank"\n              href="{attachmentItemsModel>url}"/><Text text="{attachmentItemsModel>createdBy}"/><Text text="{path: \'attachmentItemsModel>createdAt\', type: \'sap.ui.model.type.Date\', formatOptions: { pattern: \'dd/MM/yyyy HH:mm:ss\' }}"/><Button                \n              icon="sap-icon://decline"\n              type="Transparent"\n              press="onAttachmentDelete"/></ColumnListItem></Table></ScrollContainer></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
