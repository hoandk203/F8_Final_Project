import {Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {Driver} from "./entities/driver.entity";

@Injectable()
export class DriverService extends BaseService{
    constructor(
        @Inject('DRIVER_REPOSITORY')
        private readonly driverRepository: Repository<Driver>
    ) {
        super(driverRepository);
    }


}
