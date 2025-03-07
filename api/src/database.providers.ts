
import { DataSource } from 'typeorm';
import {Vendor} from "./modules/vendor/vendor.entity";
import {Image} from "./modules/image/image.entity";
import {Location} from "./modules/location/location.entity"
import {Material} from "./modules/material/material.entity";
import {Order} from "./modules/order/order.entity";
import {OrderDetail} from "./modules/order-detail/order-detail.entity";
import {Store} from "./modules/store/store.entity";
import {User} from "./modules/users/entities/user.entity";
import {EmailVerification} from "./modules/email-verification/entities/email-verification.entity";
import {RefreshToken} from "./modules/refresh-token/entities/refresh-token.entity";
import {IdentityDocument} from "./modules/identity-document/entities/identity-document.entity";
import {Driver} from "./modules/driver/entities/driver.entity";
import {Vehicle} from "./modules/vehicle/entities/vehicle.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: process.env.DB_TYPE as any,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT as any,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [
                    Store,
                    Vendor,
                    Image,
                    Location,
                    Material,
                    Order,
                    OrderDetail,
                    User,
                    EmailVerification,
                    RefreshToken,
                    IdentityDocument,
                    Driver,
                    Vehicle
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
