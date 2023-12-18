CREATE TABLE sale(
    id int not null auto_increment,
    message text not null,
    start_time timestamp not null default CURRENT_TIMESTAMP,
    end_time timestamp,
    active bool not null default FALSE,
    primary key(id)
);

CREATE TABLE contact(
    id int not null auto_increment,
    fName text not null,
    email text not null,
    meetDate date not null,
    serviceType text not null,
    red text not null,
    primary key(id)
);

