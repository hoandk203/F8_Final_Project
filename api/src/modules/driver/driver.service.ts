import {Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {Driver} from "./entities/driver.entity";
import {CreateDriverDto} from "./dto/create-driver.dto";
import {UpdateDriverDto} from "./dto/update-driver.dto";
import {IdentityDocument} from "../identity-document/entities/identity-document.entity";

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

    async update(id: number, data: UpdateDriverDto) {
        await this.driverRepository.update(id, {
            ...data,
            modifiedAt: new Date(),
        });
        return this.getOne(id);
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

    async getList() {
        // Lấy danh sách driver kèm theo status của identity_document
        return this.driverRepository
            .createQueryBuilder("driver")
            .leftJoinAndSelect("identity_document", "doc", "driver.identity_document_id = doc.id")
            .select([
                'driver.id as id',
                'driver.fullname as fullname',
                'driver.date_of_birth as date_of_birth',
                'driver.gst_number as gst_number',
                'driver.address as address',
                'driver.city as city',
                'driver.country as country',
                'driver.phone_number as phone_number',
                'driver.created_at as created_at',
                'doc.status as document_status'
            ])
            .where("driver.active = :active", {active: true})
            .orderBy("driver.id", "DESC")
            .getRawMany();
    }

    async getOne(id: number) {
        return this.driverRepository
            .createQueryBuilder("driver")
            .leftJoinAndSelect("identity_document", "doc", "driver.identity_document_id = doc.id")
            .select([
                'driver.id as id',
                'driver.user_id as user_id',
                'driver.identity_document_id as identity_document_id',
                'driver.fullname as fullname',
                'driver.date_of_birth as date_of_birth',
                'driver.gst_number as gst_number',
                'driver.address as address',
                'driver.city as city',
                'driver.country as country',
                'driver.phone_number as phone_number',
                'doc.status as document_status'
            ])
            .where("driver.id = :id", {id})
            .andWhere("driver.active = :active", {active: true})
            .getRawOne();
    }

    searchByName(name: string) {
        const query = this.driverRepository
            .createQueryBuilder("driver")
            .select([
                'driver.*',
                'identity_document.status as document_status',
            ])
            .innerJoin(IdentityDocument, "identity_document", "identity_document.id = driver.identity_document_id")
            .where("lower(driver.fullname) LIKE :name", {name: `%${name.toLowerCase()}%`})
            .andWhere("driver.active = :active", {active: true})
            .orderBy("driver.id", "DESC");

        return query.getRawMany();
    }
}
