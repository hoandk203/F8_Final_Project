drop table if exists vendor cascade;
create table if not exists vendor
(
    id          bigserial,
    name        text,
    location    text,
    email       text,
    vendor_id   int,
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_vendor primary key (id)
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
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_vendor primary key (id)
);

drop table if exists image cascade;
create table if not exists image
(
    id          bigserial,
    path         text,
    url         text,
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_image primary key (id)
);

insert into vendor (name, location, email)
values ('The gioi di dong', 'Ha Noi', 'tgdd@test.com'),
       ('Dien may xanh', 'Ha Noi', 'dmx@test.com');

insert into vendor (name, location, email, vendor_id)
values ('The gioi di dong 1', 'Cau Giay', 'tgdd1@gmail.com', 1),
       ('The gioi di dong 2', 'Thanh Xuan', 'tgdd2@gmail.com', 1),
       ('Dien may xanh 1', 'Hoang Mai', 'dmx1@gmail.com', 2);

drop table if exists location cascade;
create table if not exists location (
    latitude numeric(3, 10),
    longitude numeric(3, 10),
    driver_id bigint,
    constraint pkey_location primary key (latitude, longitude)
);

drop table if exists material cascade;
create table if not exists material
(
    id          bigserial,
    name        text,
    unit_price  numeric(10, 2),
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_material primary key (id)
);

drop table if exists "order" cascade;
create table if not exists "order"
(
    id          bigserial,
    driver_id   bigint,
    vendor_id    bigint,
    image_id    bigint,
    status      text, -- pending, processing, picked up, on moving, done
    payment_status  text, -- unpaid, paid
    total_amount    numeric(10, 2),
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_order primary key (id)
);

drop table if exists order_detail cascade;
create table if not exists order_detail
(
    id          bigserial,
    order_id    bigint,
    material_id bigint,
    weight      numeric(10, 2),
    amount      numeric(10, 2),
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    created_by  bigint,
    modified_at timestamp with time zone NOT NULL DEFAULT now(),
    modified_by bigint,
    deleted_at  timestamp with time zone NOT NULL DEFAULT now(),
    deleted_by  bigint,
    active      boolean DEFAULT TRUE,
    constraint pkey_order_detail primary key (id)
);