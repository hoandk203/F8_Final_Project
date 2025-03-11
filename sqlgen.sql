drop table if exists vendor cascade;
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

DROP TABLE IF EXISTS store CASCADE;
CREATE TABLE store (
    vendor_id        INTEGER,
    active          BOOLEAN   DEFAULT TRUE NOT NULL,
    id              SERIAL
        CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY,
    created_at      TIMESTAMP DEFAULT ('now'::TEXT)::TIMESTAMP(6) WITH TIME ZONE,
    created_by      INTEGER,
    modified_at     TIMESTAMP,
    modified_by     INTEGER,
    deleted_at      TIMESTAMP,
    deleted_by      INTEGER,
    name            VARCHAR,
    location        VARCHAR,
    city            VARCHAR,
    phone           VARCHAR,
    email           VARCHAR,
    cancelled_order INTEGER DEFAULT 0 NOT NULL,
    completed_order INTEGER DEFAULT 0 NOT NULL
);


alter table store
    owner to postgres;

drop table if exists image cascade;
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

drop table if exists location cascade;
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

drop table if exists material cascade;
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

drop table if exists "order" cascade;
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

drop table if exists order_detail cascade;
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

-- THÊM USERS VÀ DRIVER
-- Bảng users quản lý tất cả người dùng hệ thống (admin, vendor, driver)
drop table if exists "user" cascade;
CREATE TABLE "user" (
                       id SERIAL PRIMARY KEY,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'vendor', 'driver')),
                       active BOOLEAN DEFAULT true NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW(),
                       created_by INTEGER REFERENCES "user"(id),
                       modified_at TIMESTAMP,
                       modified_by INTEGER REFERENCES "user"(id),
                       deleted_at TIMESTAMP,
                       deleted_by INTEGER REFERENCES "user"(id)
);

drop table if exists identity_document cascade;
CREATE TABLE identity_document (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    front_image_url TEXT NOT NULL,
    back_image_url TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES "user"(id),
    modified_at TIMESTAMP,
    modified_by INTEGER REFERENCES "user"(id),
    deleted_at TIMESTAMP,
    deleted_by INTEGER REFERENCES "user"(id)
);

-- Bảng driver mở rộng thông tin cho tài xế (quan hệ 1-1 với users)
drop table if exists driver cascade;
CREATE TABLE driver (
                        user_id INTEGER PRIMARY KEY REFERENCES "user"(id),
                        identity_document_id INTEGER UNIQUE REFERENCES identity_document(id) ON DELETE SET NULL,
                        fullname VARCHAR(50),
                        date_of_birth DATE,
                        gst_number VARCHAR(20),
                        address VARCHAR(50),
                        city VARCHAR(50),
                        country VARCHAR(50),
                        phone_number VARCHAR(20),
--                         status VARCHAR(20) CHECK (status IN ('available', 'busy', 'offline')),
                        active BOOLEAN DEFAULT true NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW(),
                        created_by INTEGER REFERENCES "user"(id),
                        modified_at TIMESTAMP,
                        modified_by INTEGER REFERENCES "user"(id),
                        deleted_at TIMESTAMP,
                        deleted_by INTEGER REFERENCES "user"(id)
);

-- Chỉnh sửa lại bảng vendor để tham chiếu tới users
ALTER TABLE vendor
    ADD COLUMN user_id INTEGER UNIQUE REFERENCES "user"(id),
DROP COLUMN email; -- Email đã có trong bảng users

-- Chỉnh sửa bảng store để thêm quan hệ với users
ALTER TABLE store
    ADD COLUMN user_id INTEGER REFERENCES "user"(id);

-- Chỉnh sửa bảng location (sửa kiểu dữ liệu và thêm FK)
ALTER TABLE location
ALTER COLUMN latitude TYPE NUMERIC(10,6),
    ALTER COLUMN longitude TYPE NUMERIC(10,6),
    ADD CONSTRAINT fk_location_driver FOREIGN KEY (driver_id) REFERENCES driver(user_id);

-- Chỉnh sửa bảng order để cải thiện quan hệ
ALTER TABLE "order"
ALTER COLUMN driver_id TYPE INTEGER USING driver_id::INTEGER,
    ADD CONSTRAINT fk_order_driver FOREIGN KEY (driver_id) REFERENCES driver(user_id),
    ADD CONSTRAINT fk_order_store FOREIGN KEY (store_id) REFERENCES store(id),
    ADD CONSTRAINT fk_order_image FOREIGN KEY (image_id) REFERENCES image(id);

-- Thêm các FK constraint cho các bảng hiện có
ALTER TABLE material
    ADD CONSTRAINT fk_material_created_by FOREIGN KEY (created_by) REFERENCES "user"(id),
    ADD CONSTRAINT fk_material_modified_by FOREIGN KEY (modified_by) REFERENCES "user"(id),
    ADD CONSTRAINT fk_material_deleted_by FOREIGN KEY (deleted_by) REFERENCES "user"(id);

ALTER TABLE order_detail
    ADD CONSTRAINT fk_order_detail_order FOREIGN KEY (order_id) REFERENCES "order"(id),
    ADD CONSTRAINT fk_order_detail_material FOREIGN KEY (material_id) REFERENCES material(id);

