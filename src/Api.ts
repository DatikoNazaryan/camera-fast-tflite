import axios, { AxiosResponse } from 'axios';
import { AppState } from 'react-native';
import Account from '@src/utils/Account';
import { fetch } from 'expo/fetch';
import i18n from '@src/locales/i18n';
import qs from 'query-string';
import { UserRegisterRequest, UserLoginRequest, UpdateUserRequest } from '@/src/types/user';

const API_URL = 'http://192.168.31.5:3000';

const api = axios.create({
  baseURL: API_URL,
  adapter: 'fetch',
  env: {
    fetch: (request) => {
      const { url, ...config } = request as Request & {
        _bodyInit?: any
      };
      if (config._bodyInit && !config.body) {
        config.body = config._bodyInit;
      }
      if (config.credentials === 'same-origin') {
        config.credentials = 'omit';
      }
      return fetch(url, config);
    }
  },
  paramsSerializer: (params) => {
    for (const i in params) {
      if (Array.isArray(params[i])) {
        params[i] = params[i].join(',');
      }
    }
    return qs.stringify(params);
  },
  formSerializer: {
    indexes: true
  }
});

api.interceptors.request.use((config) => {
  if (Account.token) {
    config.headers.Authorization = `Bearer ${Account.token}`;
  }
  if (__DEV__) {
    config.headers['If-None-Match'] = '';
  }
  config.headers['Accept-Language'] = i18n.language;
  config.headers['Content-Type'] ||= 'application/json';
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use((config) => config, async (e) => {
  const { status } = e.response || {};
  if (!status && e.code !== 'ERR_CANCELED') {
    console.error('Axios: Response status is missing');
  } else if (status === 401 && AppState.currentState === 'active') {
    // const { store } = await import('@src/store');
    // const { logOut } = await import('@src/store/actions/authentication');
    // Toast.show('Authorization Error', Toast.LONG);
    // store.dispatch(logOut());
  } else if (status >= 500) {
    // const { store } = await import('@src/store');
    // const { setServerError } = await import('@src/store/actions/app');
    // store.dispatch(setServerError(e));
  }
  return Promise.reject(e);
});

class Api {
  private static abortControllers: { [key: string]: AbortController } = {};

  private static createSignal(uid: string, cancelPrevious?: boolean): AbortSignal {
    const controller = new AbortController();
    if (cancelPrevious) {
      this.abort(uid);
    }
    this.abortControllers[uid] = controller;
    return controller.signal;
  }

  private static abort(uid: string): boolean {
    if (this.abortControllers[uid]) {
      this.abortControllers[uid].abort();
      delete this.abortControllers[uid];
      return true;
    }
    return false;
  }

  // registration

  static login(data: UserLoginRequest): Promise<AxiosResponse> {
    return api.post('/api/auth/login', data);
  }

  static registration(data: UserRegisterRequest): Promise<AxiosResponse> {
    return api.post('/api/auth/register', data);
  }

  static updateUser(payload: UpdateUserRequest): Promise<AxiosResponse> {
    return api.patch(
      `/api/auth/users/${payload.userId}`,
      {
        field: payload.field,
        value: payload.value,
      },
    );
  }

  static deleteUser(userId: string ): Promise<AxiosResponse> {
    return api.delete(
      `/api/auth/users/${userId}`,
    );
  }
}

export default Api;
