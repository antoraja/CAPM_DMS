using sap.dms as dms from '../db/interactions';

service dms_service {     
    entity attachmentItems as projection on dms.attachmentItems;
}
