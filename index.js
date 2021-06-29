import { registerRootComponent } from 'expo';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers'

const store = createStore(reducer, applyMiddleware(thunk));

import App from './App';
import React from 'react';
import { Provider } from 'react-redux';

const RNRedux = () => (
  <Provider store = { store }>
    <App />
  </Provider>
)

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(RNRedux);
