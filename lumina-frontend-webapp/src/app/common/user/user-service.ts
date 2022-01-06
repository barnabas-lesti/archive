import { Injectable } from '@angular/core';

import { User } from './user';

@Injectable()
export class UserService {
  private user: User = {
    id: 'sktwi114kjigoxn2',
    email: 'barnabas.lesti@gmail.com',
    fullName: 'Barnabas Lesti',
    imageUrl: 'https://avatars.githubusercontent.com/u/11849644?s=460&u=b2d225761ed41f52eb8012c09b31ac8e971a6294&v=4',
  };

  constructor() {}

  getUser(): User {
    return this.user;
  }
}
