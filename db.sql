drop table if exists store cascade;
create table if not exists store
(
    id          bigserial,
    name        text,
    location    text,
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone,
    modified_by bigint,
    deleted_at  timestamp with time zone,
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_store primary key (id)
);

drop table if exists vendor cascade;
create table if not exists vendor
(
    id          bigserial,
    name        text,
    location    text,
    email       text,
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone,
    modified_by bigint,
    deleted_at  timestamp with time zone,
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_vendor primary key (id)
);

insert into vendor (name, location, email)
values ('The gioi di dong', 'Ha Noi', 'tgdd@test.com'),
       ('Dien may xanh', 'Ha Noi', 'dmx@test.com');