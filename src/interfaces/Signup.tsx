export interface State {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

export interface Reducer {
    (state: State, action: Action): State
}

export type Action =
  | { type: 'setFirstName', firstName: string }
  | { type: 'setLastName', lastName: string }
  | { type: 'setEmail', email: string}
  | { type: 'setPassword', password: string}
  | { type: 'setConfirmPassword', confirmPassword: string}
