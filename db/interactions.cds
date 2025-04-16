namespace sap.dms;

using {
      cuid,
      managed,   
} from '@sap/cds/common';

entity attachmentItems : managed {        
    key attachID    : String;
        folderId    : String;
        objectId    : String;
        content     : LargeBinary
        @Core.MediaType: mediaType;
        mediaType   : String
        @Core.IsMediaType;
        filename    : String;       
        url         : String;
}
