import { createSelector } from 'reselect'

const userSelector = (state) => state.userReducer
export const currentUserSelector = createSelector(
  [userSelector],
  (userReducer) => userReducer.currentUser
)

export const Loading = createSelector(
  [userSelector],
  (userReducer) => userReducer.isSigningIn
)
export const signInFailed = createSelector(
  [userSelector],
  (userReducer) => userReducer.error
)
