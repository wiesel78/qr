// Router
import { createHashHistory } from 'history';

// Redux
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import { createRootReducer } from './reducers/root-reducer';



// Create Redux Store
export const history = createHashHistory();
export function configureStore(preloadedState : any) {
    const store = createStore(
      createRootReducer(history), 
      preloadedState,
      compose(
        applyMiddleware(
          routerMiddleware(history),
        ),
      ),
    )
  
    return store
  }

export const store = configureStore({});