create table image
(
    id          serial
        constraint "PK_d6db1ab4ee9ad9dbe86c64e4cc3"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    path        varchar
        constraint "UQ_f03b89f33671086e6733828e79c"
            unique,
    url         varchar
        constraint "UQ_602959dc3010ff4b4805ee7f104"
            unique
);

alter table image
    owner to neondb_owner;

create table location
(
    latitude    numeric(10, 7)         not null,
    longitude   numeric(10, 7)         not null,
    driver_id   integer                not null,
    id          serial
        constraint "PK_876d7bdba03c72251ec4c2dc827"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null
);

alter table location
    owner to neondb_owner;

create table material
(
    id          serial
        constraint "PK_0343d0d577f3effc2054cbaca7f"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    name        varchar                not null,
    unit_price  numeric(10, 2)         not null
);

alter table material
    owner to neondb_owner;

create table order_detail
(
    id          serial
        constraint "PK_0afbab1fa98e2fb0be8e74f6b38"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    order_id    integer                not null,
    material_id integer                not null,
    weight      integer                not null,
    amount      numeric(10, 2)         not null
);

alter table order_detail
    owner to neondb_owner;

create table "order"
(
    driver_id          integer,
    active             boolean   default true                         not null,
    id                 serial
        constraint "PK_1031171c13130102495201e3e20"
            primary key,
    created_at         timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by         integer,
    modified_at        timestamp,
    modified_by        integer,
    deleted_at         timestamp,
    deleted_by         integer,
    status             varchar   default 'pending'::character varying not null,
    store_id           integer,
    amount             numeric(10, 2)                                 not null,
    scrap_image_url    varchar                                        not null,
    staff_id           integer,
    proof_image_url    varchar,
    declined_driver_id integer[] default '{}'::integer[],
    canceled_driver_id integer[] default '{}'::integer[]
);

alter table "order"
    owner to neondb_owner;

create table "user"
(
    id          serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    password    varchar                not null,
    email       varchar                not null
        constraint "UQ_e12875dfb3b1d92d7d7c5377e22"
            unique,
    role        varchar                not null
);

alter table "user"
    owner to neondb_owner;

create table email_verification
(
    id         serial
        constraint "PK_b985a8362d9dac51e3d6120d40e"
            primary key,
    email      varchar                 not null
        constraint "UQ_3ffc9210f041753e837b29d9e5b"
            unique,
    code       varchar(6)              not null,
    expires_at timestamp               not null,
    created_at timestamp default now() not null,
    is_used    boolean   default false not null
);

alter table email_verification
    owner to neondb_owner;

create table refresh_token
(
    id          serial
        constraint "PK_b575dd3c21fb0831013c909e7fe"
            primary key,
    token       varchar   not null,
    uuid        varchar,
    "userId"    integer   not null,
    "expiresAt" timestamp not null,
    "createdAt" timestamp default ('now'::text)::timestamp(6) with time zone
);

alter table refresh_token
    owner to neondb_owner;

create table identity_document
(
    id              serial
        primary key,
    user_id         integer                not null,
    active          boolean   default true not null,
    created_at      timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by      integer,
    modified_at     timestamp,
    modified_by     integer,
    deleted_at      timestamp,
    deleted_by      integer,
    front_image_url varchar                not null,
    back_image_url  varchar                not null,
    status          varchar                not null
);

alter table identity_document
    owner to neondb_owner;

create table driver
(
    user_id              integer                                     not null,
    identity_document_id integer                                     not null,
    active               boolean   default true                      not null,
    created_at           timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by           integer,
    modified_at          timestamp,
    modified_by          integer,
    deleted_at           timestamp,
    deleted_by           integer,
    id                   serial
        constraint "PK_61de71a8d217d585ecd5ee3d065"
            primary key,
    fullname             varchar                                     not null,
    date_of_birth        varchar                                     not null,
    gst_number           varchar                                     not null,
    address              varchar                                     not null,
    city                 varchar                                     not null,
    country              varchar                                     not null,
    phone_number         varchar,
    status               varchar   default 'idle'::character varying not null
);

alter table driver
    owner to neondb_owner;

create table vehicle
(
    id                   serial
        constraint "PK_187fa17ba39d367e5604b3d1ec9"
            primary key,
    created_at           timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by           integer,
    modified_at          timestamp,
    modified_by          integer,
    deleted_at           timestamp,
    deleted_by           integer,
    active               boolean   default true not null,
    driver_id            integer                not null,
    vehicle_plate_number varchar                not null,
    vehicle_color        varchar                not null,
    vehicle_image        varchar                not null,
    vehicle_rc_image     varchar                not null,
    status               varchar                not null
);

alter table vehicle
    owner to neondb_owner;

create table store
(
    vendor_id       integer,
    active          boolean   default true                         not null,
    id              serial
        constraint "PK_f3172007d4de5ae8e7692759d79"
            primary key,
    created_at      timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by      integer,
    modified_at     timestamp,
    modified_by     integer,
    deleted_at      timestamp,
    deleted_by      integer,
    name            varchar,
    location        varchar,
    city            varchar,
    phone           varchar,
    email           varchar,
    cancelled_order integer   default 0                            not null,
    completed_order integer   default 0                            not null,
    user_id         integer,
    status          varchar   default 'pending'::character varying not null
);

alter table store
    owner to neondb_owner;

create table vendor
(
    id          serial
        constraint "PK_931a23f6231a57604f5a0e32780"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    name        varchar                not null,
    email       varchar                not null,
    user_id     integer
);

alter table vendor
    owner to neondb_owner;

create table "store-location"
(
    latitude    numeric(10, 7)         not null,
    longitude   numeric(10, 7)         not null,
    store_id    integer                not null,
    id          serial
        constraint "PK_a3bb9340de6938ba19940bbd73c"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null
);

alter table "store-location"
    owner to neondb_owner;

CREATE TYPE payment_status_enum AS ENUM ('pending', 'success', 'failed', 'canceled');
CREATE TYPE payment_method_enum AS ENUM ('vnpay', 'cash', 'bank_transfer');
CREATE TYPE issue_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE issue_creator_role_enum AS ENUM ('admin', 'store', 'driver');

create table payment
(
    id               serial
        constraint "PK_fcaec7df5adf9cac408c686b2ab"
            primary key,
    "orderId"        integer                                                    not null
        constraint "FK_d09d285fe1645cd2f0db811e293"
            references "order",
    amount           numeric(10,2)                                                    not null,
    status           payment_status_enum default 'pending'::payment_status_enum not null,
    method           payment_method_enum default 'vnpay'::payment_method_enum   not null,
    "transactionId"  varchar,
    "transactionRef" varchar,
    "paymentData"    json,
    "createdAt"      timestamp           default now()                          not null,
    "updatedAt"      timestamp           default now()                          not null,
    active           boolean             default true                           not null,
    "paymentUrl"     varchar
);

alter table payment
    owner to neondb_owner;

create table issue
(
    id              serial
        constraint "PK_f80e086c249b9f3f3ff2fd321b7"
            primary key,
    created_at      timestamp         default ('now'::text)::timestamp(6) with time zone,
    created_by      integer,
    modified_at     timestamp,
    modified_by     integer,
    deleted_at      timestamp,
    deleted_by      integer,
    active          boolean           default true                      not null,
    order_id        integer                                             not null,
    store_id        integer                                             not null,
    driver_id       integer,
    issue_name      varchar                                             not null,
    description     text                                                not null,
    status          issue_status_enum default 'open'::issue_status_enum not null,
    creator_role    issue_creator_role_enum                             not null,
    resolved_at     timestamp,
    message_count   integer           default 0                         not null,
    issue_image_url varchar                                             not null,
    user_id         integer
);

alter table issue
    owner to neondb_owner;

create index "IDX_13898061045a92139eb47df05c"
    on issue (order_id);

create index "IDX_f2ee1362a4451933966e101aa0"
    on issue (store_id);

create index "IDX_044d9246a78f1dac52035fa5a9"
    on issue (driver_id);

create index "IDX_2067bb78ce5b812013d3c68357"
    on issue (user_id);

create table issue_messages
(
    id          serial
        constraint "PK_883edf1f683c6bf4380b3cfcbe9"
            primary key,
    created_at  timestamp default ('now'::text)::timestamp(6) with time zone,
    created_by  integer,
    modified_at timestamp,
    modified_by integer,
    deleted_at  timestamp,
    deleted_by  integer,
    active      boolean   default true not null,
    issue_id    integer                not null,
    sender_id   integer                not null,
    message     text                   not null,
    file_ids    text
);

alter table issue_messages
    owner to neondb_owner;

create index "IDX_bcc55dcd96f6de3e9ae16b7a7a"
    on issue_messages (issue_id);

create index "IDX_8504cd2d0e31fcb79afb7b5d78"
    on issue_messages (sender_id);

