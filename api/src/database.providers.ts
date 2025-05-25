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
import {StoreLocation} from "./modules/store-location/store-location.entity";
import {Payment} from "./modules/payment/entities/payment.entity";
import { Issue } from './modules/issue/entities/issue.entity';
import { IssueMessage } from './modules/issue-message/entities/issue-message.entity';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            console.log('DATABASE_URL:', process.env.DATABASE_URL);
            
            const dataSource = new DataSource({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                },
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
                    Vehicle,
                    StoreLocation,
                    Payment,
                    Issue,
                    IssueMessage
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
