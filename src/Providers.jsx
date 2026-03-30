import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReduxReducer from './utils/reduxStorage';

const store = configureStore({
  reducer: {
    dataStore: ReduxReducer,
  },
});

const Providers = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
