
import { DataSource } from 'typeorm';
import {Vendor} from "./modules/vendor/vendor.entity";
import {Image} from "./modules/image/image.entity";
import {Location} from "./modules/location/location.entity"
import {Material} from "./modules/material/material.entity";
import {Order} from "./modules/order/order.entity";
import {OrderDetail} from "./modules/order-detail/order-detail.entity";
import {Store} from "./modules/store/store.entity";
import {User} from "./modules/users/entities/user.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'default',
                entities: [
                    Store,
                    Vendor,
                    Image,
                    Location,
                    Material,
                    Order,
                    OrderDetail,
                    User
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
