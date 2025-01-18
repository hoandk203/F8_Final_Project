import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
    constructor(
        @Inject('LOCATION_REPOSITORY')
        private locationRepository: Repository<Location>,
    ) {
        // super(locationRepository)
    }

    create_or_update(location) {
        return location;
    }

    // handleSelect() {
    //   return this.locationRepository
    //     .createQueryBuilder("location")
    //     .select([
    //       '*'
    //     ])
    // }

    // async findAll(){
    //   return this.vendorRepository
    //     .createQueryBuilder("vendor")
    //     .select([
    //         'vendor.id as id',
    //         'vendor.name as name',
    //     ])
    //     .where({active: true})
    //     .getRawMany()
    // }

    // getOne(id: number) {
    //   return "getOne"
    // }
    //
    // create(vendor) {
    //   return "create"
    // }
    //
    // update(id: number, vendor) {
    //   return "update"
    // }
    //
    // delete(id: number) {
    //   return "delete"
    // }
}
