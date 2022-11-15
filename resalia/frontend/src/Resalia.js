import { createContext, useReducer } from 'react';

export const Resalia = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNUP':
      return state;
    case 'USER_LOGOUT':
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function ResaliaProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Resalia.Provider value={value}>{props.children}</Resalia.Provider>;
}
