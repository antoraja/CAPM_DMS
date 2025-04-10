namespace my.bookshop;

using {
    cuid,
    managed
} from '@sap/cds/common';


entity Books {
    key ID    : Integer;
        title : String;
        stock : Integer;
}

entity Files : cuid, managed {
    @Core.MediaType  : mediaType
    content   : LargeBinary;

    @Core.IsMediaType: true
    mediaType : String;
    fileName  : String;
    size      : Integer @optional;
    url       : String  @optional;
}

entity Attachments : cuid, managed {
    folderId    : String;
    objectId    : String;
    content     : LargeBinary
    @Core.MediaType: mediaType;
    mediaType   : String
    @Core.IsMediaType;
    filename    : String;
    size        : Integer;
    url         : String;
    mime:String;

}



// entity Attachments : cuid, managed {

//     folderId   : String;
//     objectId   : String;

//     @Core.MediaType: 'mediaType'
//     content    : LargeBinary;

//     @Core.IsMediaType
//     mediaType  : String;

//     filename   : String;
//     size       : Integer;
//     url        : String;

// }


