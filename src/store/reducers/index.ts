import { combineReducers } from 'redux';
import AuthenticationReduce from '@src/store/reducers/authenticationReduce';
import storage from '@/src/utils/storage';
import secureStorage from '@src/utils/secureStorage';
import { logOut } from '@src/store/actions/authenticationAction';

const appReducer = combineReducers({
  AuthenticationReduce
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if ('type' in action && action.type === logOut.type) {
    storage.clearStore();
    secureStorage.clearStore();
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
