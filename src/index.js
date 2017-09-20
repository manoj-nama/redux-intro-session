import { createStore, combineReducers, applyMiddleware } from 'redux';

const userInitialState = {
  users: [1, 2, 3],
  loading: false
};
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'INC': {
      const newUsers = [...state.users];
      newUsers.push(action.val);
      return { users: newUsers, loading: state.loading };
    }
    case 'CHANGE_NAME': {
      const newState = { ...state };
      newState.loading = true;
      return newState;
    }
    default: {
      return state;
    }
  }
};

const productsIS = {
  products: [4, 5, 6]
};
const productsReducer = (state = productsIS, action) => {
  switch (action.type) {
    case 'INC': {
      const newProducts = [...state.products];
      newProducts.push(action.val);
      return { products: newProducts };
    }
    default: {
      return state;
    }
  }
};

const reducers = combineReducers({
  users: userReducer,
  products: productsReducer
});

const logger = store => next => action => {
  console.log(`Action ${action.type} was fired!`, action);
  return next(action);
}
const asyncMiddleware = store => next => action => {
  if(typeof action === 'function') {
    action(store.dispatch);
  } else {
    return next(action);
  }
};

const middlewares = applyMiddleware(asyncMiddleware, logger);

const store = createStore(reducers, middlewares);

store.subscribe(() => {
  console.log("Store updated", store.getState());
});

const changeName = () => {
  return dispatch => {
    dispatch({type: 'AJAX_STARTED'});
    setTimeout(() => {
      const users = [1,2,3,4];
      dispatch({type: 'AJAX_COMPLETED', users});
    }, 5000);
  }
}

store.dispatch(changeName());
store.dispatch({ type: 'INC', val: 1 });
store.dispatch({ type: 'INC', val: 2 });
store.dispatch({ type: 'INC', val: 1 });
store.dispatch({ type: 'DEC', val: 3 });
store.dispatch({ type: 'INC', val: 5 });
store.dispatch({ type: 'DEC', val: 1 });
