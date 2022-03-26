const initialState = {
  currentUser: null,
  error: null,
  isSigningIn: false,
  users: [],
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return Object.assign({}, state, { currentUser: action.payload })
    case 'SIGN_IN_WITH_GOOGLE_START':
    case 'SIGN_IN_WITH_EMAIL_START':
    case 'SIGN_UP_START':
      return Object.assign({}, state, {
        isSigningIn: true,
        error: null,
      })
    case 'SIGN_IN_SUCCESS':
      return Object.assign({}, state, {
        isSigningIn: false,
        currentUser: action.payload,
        error: null,
      })
    case 'SIGN_IN_FAILED':
      return Object.assign({}, state, {
        isSigningIn: false,
        error: action.payload,
      })

    case 'SIGN_OUT_SUCCESS':
      return Object.assign({}, state, {
        currentUser: null,
        error: null,
        isSigningIn: false,
      })
    case 'SIGN_OUT_FAILED':
      return Object.assign({}, state, {
        error: action.payload,
      })
    case 'CLEAR_ERROR':
      return Object.assign({}, state, {
        error: null,
      })
    case 'GETTING_USERS':
      return Object.assign([], state, { users: action.payload })
    default:
      return state
  }
}
