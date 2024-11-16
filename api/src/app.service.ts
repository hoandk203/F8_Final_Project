import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  public users = [
    {
      id: 1,
      name: 'John',
      age: 30,
      email: 'john@example.com'
    }
  ]

  getList() {
    return this.users;
  }

  create(user) {
    user.id = 2
    this.users.push(user);
    return user
  }

  update(id, user) {
    // update
  }
}
