import secureStorage from '@src/utils/secureStorage';
import { User } from '@src/types/user';

class Account {
  static #token: string | null = null;

  static #profile: User | null = null;

  static get token() {
    if (this.#token === null) {
      this.#token = secureStorage.getString('customers.token') || '';
    }

    return this.#token;
  }

  static set token(token: string | null) {
    if (token) {
      secureStorage.setString('customers.token', token);
    } else {
      secureStorage.removeItem('customers.token');
    }

    this.#token = token;
  }

  static get profile(): User | null {
    if (this.#profile === null) {
      this.#profile = secureStorage.getMap('customers.profile') as User | null;
    }

    return this.#profile;
  }

  static set profile(profile: User | null) {
    if (profile) {
      secureStorage.setMap('customers.profile', profile);
    } else {
      secureStorage.removeItem('customers.profile');
    }

    this.#profile = profile;
  }

  static clear() {
    this.token = null;
    this.profile = null;
  }
}

export default Account;
