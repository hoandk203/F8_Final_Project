
import { DataSource } from 'typeorm';
import {Vendor} from "./vendor/entity";
import {Image} from "./image/entity";
import {Location} from "./location/entity"
import {Material} from "./material/entity";
import {Order} from "./order/entity";
import {OrderDetail} from "./orderDetail/entity";
import {Store} from "./store/entity";

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
                    OrderDetail
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
