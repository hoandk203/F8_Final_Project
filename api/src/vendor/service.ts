import { vendors } from './entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorService {
  getList() {
    return vendors;
  }

  getOne(id: number) {
    return vendors.find((vendor) => vendor.id === id);
  }

  create(vendor) {
    vendors.push({ id: 2, ...vendor });
    return vendor;
  }

  update(id: number, vendor) {
    const vendorId = vendors.findIndex((item) => item.id === id);
    vendors[vendorId] = { ...vendors[vendorId], ...vendor };
    return vendor;
  }

  delete(id: number) {
    const vendorId = vendors.findIndex((item) => item.id === id);
    const vendorDeleted = vendors[vendorId];
    vendors.splice(vendorId, 1);
    return vendorDeleted;
  }
}
