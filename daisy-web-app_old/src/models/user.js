import _ from 'lodash';

class User {
  constructor (skeleton = {}) {
    const {
      email,
      profileImageUrl,
      nickname,
    } = _.cloneDeep(skeleton);

    this.email = email;
    this.profileImageUrl = profileImageUrl;
    this.nickname = nickname;
  }
};

export default User;
