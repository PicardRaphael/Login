import React, { useReducer } from "react";
import { State, Reducer, Action } from 'app/interfaces/Signup'

const initialState: State = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const reducer: Reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'setFirstName':
        return {...state, firstName: action.firstName}
      case 'setLastName':
        return {...state, lastName: action.lastName}
      case 'setEmail':
        return {...state, email: action.email}
      case 'setPassword':
        return {...state, password: action.password}
      case 'setConfirmPassword':
        return {...state, confirmPassword: action.confirmPassword}
      default:
        return state
    }
};


interface IContextProps {
    state: State
    dispatch: React.Dispatch<Action>
}
export const SignupStore = React.createContext({} as IContextProps);

export function SignupStoreProvider(props: any) {

    const [state, dispatch] = useReducer(reducer, initialState);
  
    const value = { state, dispatch };
    return (
      <SignupStore.Provider value={value}>{props.children}</SignupStore.Provider>
    );
}