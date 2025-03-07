import {Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {Driver} from "./entities/driver.entity";
import {CreateDriverDto} from "./dto/create-driver.dto";

@Injectable()
export class DriverService extends BaseService{
    constructor(
        @Inject('DRIVER_REPOSITORY')
        private readonly driverRepository: Repository<Driver>
    ) {
        super(driverRepository);
    }

    async create(data: CreateDriverDto) {
        const newDriver = this.driverRepository.create(data);
        return this.driverRepository.save(newDriver);
    }

    handleSelect() {
        return this.driverRepository
            .createQueryBuilder("driver")
            .select([
                'driver.*'
            ])
    }

    async getByUserId(userId: number) {
        return this.driverRepository
            .createQueryBuilder("driver")
            .where("driver.user_id = :userId", {userId})
            .getOne();
    }
}
