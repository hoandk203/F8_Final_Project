import { Injectable } from '@nestjs/common';
import { stores } from './entity';

@Injectable()
export class StoreService {
  getListStore() {
    return stores;
  }

  getStore(id: number) {
    return stores.find((item) => item.id === id);
  }

  createStore(store) {
    stores.push({ id: 2, ...store });
    return store;
  }

  updateStore(id: number, store) {
    const storeId = stores.findIndex((item) => item.id === id);
    stores[storeId] = { ...stores[storeId], ...store };
    return store;
  }

  deleteStore(id: number) {
    const storeId = stores.findIndex((item) => item.id === id);
    const storeDeleted = stores[storeId];
    stores.splice(storeId, 1);
    return storeDeleted;
  }
}
