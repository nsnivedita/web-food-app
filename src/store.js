
import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {changeState} from './state';


//const reducer=combineReducers(changeState);



  export const init = () => {
    
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
    const store = createStore(changeState, composeEnhancers(applyMiddleware(thunk)));
  
    return store;
  }
  