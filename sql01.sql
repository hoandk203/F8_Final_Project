insert into vendor (name, location, email)
values ('The gioi di dong', 'Ha Noi', 'tgdd@test.com'),
       ('Dien may xanh', 'Ha Noi', 'dmx@test.com');

insert into store (name, location, vendor_id)
values ('The gioi di dong hoang mai', 'Hoang mai - HN', 1),
       ('The gioi di dong Hai Ba Trung', 'HNT - HN', 1),
       ('Diem may xanh Dong da', 'Dong Da - HN', 1);

insert into store (name, location, vendor_id)
values ('Diem may xanh hoang mai', 'Hoang mai - HN', 2);

drop table if exists store cascade;
create table if not exists store
(
    id          bigserial,
    vendor_id   bigint,
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



select id, name, location, vendor_id, active from store where true;

update store set vendor_id = 2 where id = 3;
update store set vendor_id = 1 where id = 2;

insert into store (name, location, vendor_id) values ('test', 'test', 1);

delete from store where id = 4;
update store set active = false where id = 5;


select store.id,
       store.name        as store,
       store.location,
       json_build_object('id', vendor.id, 'name', vendor.name) as vendor
from store
    join vendor on vendor.id = store.vendor_id;

-- group function
-- count, sum, array funcs

select * from store order by vendor_id, id desc limit 2;

select count(id) from store; -- 5
select sum(id) from store; -- 17

select name, location from store;
select location, array_agg(name) from store group by location;
select vendor_id,
       json_agg(
               json_build_object('id', store.id, 'name', store.name)
       ) as stores
from store group by vendor_id;

-- 2,"{{id: 3}, {id:6}}"
-- 1,"{{id: 1}, {id: 2}, {id: 5}}"

drop table if exists employee cascade;
create table if not exists employee
(
    id          bigserial,
    store_id    int,
    name        text,
    salary      int,
    constraint pkey_employee primary key (id)
);
alter table employee add column active bool default true;

insert into employee (store_id, name, salary)
values (1, 'Hoang', 50),
       (1, 'Hoan', 60),
       (2, 'SOn', 40),
       (3, 'Hoan', 40),
       (6, 'Hoan', 40);

select * from employee;
-- delete id = 1
update employee set active = false where id = 4;

explain analyse select name, count(name), sum(salary) from employee where employee.salary > 40 group by name;
-- Hoan, 1, 60
-- Hoang,1, 50
-- 26.65..28.44

explain analyse select name, count(name), sum(salary) as salary from employee group by name having sum(salary) > 40;
-- Hoan, 2, 100
-- Hoang,1, 50
-- 29.43..31.93

-- lay ds nv dang lam cho cty nay
select * from employee where active;
select * from employee where true group by id having employee.active;


select vendor_id,
       json_agg(
               json_build_object(
                       'id', store.id,
                       'name', store.name,
                       'employees': json_agg(
                            json_build_object(
                                'id', employee.id,
                                'name', employee.name,
                            )
                       )
               )
       ) as stores
from store group by vendor_id;

-- vendor id, vendor name, stores [{id, name}, {id, name}]
-- cost=122.03..25189.73
explain analyse select vendor.id,
       vendor.name ,
       json_agg(
               json_build_object(
                       'id', store.id,
                       'name', store.name,
                       'employees', (
                            select json_agg(
                               json_build_object('id', employee.id, 'name', employee.name))
                            from employee where employee.store_id = store.id
                            )
               )
       ) as stores
from vendor
join store on store.vendor_id = vendor.id
join employee on employee.store_id = store.id
group by vendor.id;

-- 1, "The gioi di dong", "{{id: 1}, {id: 2}}"

explain analyse select * from store where vendor_id in (select id from vendor where name = 'Dien may xanh');

explain analyse select * from store
join vendor on store.vendor_id = vendor.id
where vendor.name = 'Dien may xanh';


select * from store where vendor_id in (1);
select * from vendor;

-- cost=81.99..82.04
explain analyse
with
    stores as (
        select store.id,
               store.name,
               store.vendor_id,
               json_agg(
                       json_build_object(
                               'id', employee.id,
                               'name', employee.name
                       )
               ) as employees
        from store
                 join employee on employee.store_id = store.id
        group by store.id, store.name
    )

select vendor.id,
       vendor.name,
       json_agg(
            json_build_object(
                'id', stores.id,
                'name', stores.name,
                'employees', stores.employees
            )
       )
from vendor
join stores on stores.vendor_id = vendor.id
group by vendor.id, vendor.name;
