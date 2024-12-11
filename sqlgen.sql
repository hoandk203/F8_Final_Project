create table vendor
(
    active      boolean   default true not null,
    id          serial
        constraint "PK_931a23f6231a57604f5a0e32780"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    name        varchar,
    location    varchar,
    email       varchar
);

alter table vendor
    owner to postgres;

create table store
(
    vendor_id   integer,
    active      boolean   default true not null,
    id          serial
        constraint "PK_f3172007d4de5ae8e7692759d79"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    name        varchar,
    location    varchar,
    email       varchar
);

alter table store
    owner to postgres;

create table image
(
    active      boolean   default true not null,
    id          serial
        constraint "PK_d6db1ab4ee9ad9dbe86c64e4cc3"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    path        varchar
        constraint "UQ_f03b89f33671086e6733828e79c"
            unique,
    url         varchar
        constraint "UQ_602959dc3010ff4b4805ee7f104"
            unique
);

alter table image
    owner to postgres;

create table location
(
    latitude  numeric(3, 10) not null,
    longitude numeric(3, 10) not null,
    driver_id integer        not null,
    constraint pkey_location
        primary key (latitude, longitude)
);

alter table location
    owner to postgres;

create table material
(
    id          bigserial
        constraint pkey_material
            primary key,
    name        text,
    unit_price  numeric(10, 2),
    created_at  timestamp with time zone default now() not null,
    created_by  bigint,
    modified_at timestamp with time zone default now() not null,
    modified_by bigint,
    deleted_at  timestamp with time zone default now() not null,
    deleted_by  bigint,
    active      boolean                  default true
);

alter table material
    owner to postgres;

create table "order"
(
    id             bigserial
        constraint pkey_order
            primary key,
    driver_id      bigint,
    store_id       bigint,
    image_id       bigint,
    status         text,
    payment_status text,
    total_amount   numeric(10, 2),
    created_at     timestamp with time zone default now() not null,
    created_by     bigint,
    modified_at    timestamp with time zone default now() not null,
    modified_by    bigint,
    deleted_at     timestamp with time zone default now() not null,
    deleted_by     bigint,
    active         boolean                  default true
);

alter table "order"
    owner to postgres;

create table order_detail
(
    id          bigserial
        constraint pkey_order_detail
            primary key,
    order_id    bigint,
    material_id bigint,
    weight      numeric(10, 2),
    amount      numeric(10, 2),
    created_at  timestamp with time zone default now() not null,
    created_by  bigint,
    modified_at timestamp with time zone default now() not null,
    modified_by bigint,
    deleted_at  timestamp with time zone default now() not null,
    deleted_by  bigint,
    active      boolean                  default true
);

alter table order_detail
    owner to postgres;

