using my.bookshop as my from '../db/schema';

service CatalogService {
     entity Books as projection on my.Books;
     entity Files as projection on my.Files;
     entity Attachments as projection on my.Attachments;
}

