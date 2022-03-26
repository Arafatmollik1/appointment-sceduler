import { takeLatest, put } from 'redux-saga/effects'
import {
  createUserInFirestore,
  isUserAuthenticated,
  googleSignIn,
  emailSignUp,
  logout,
  getdoc,
  emailSignIn,
  approveDbUser,
  fetchingUsers,
  passwordForget,
  passwordChange,
  fetchingMessages,
} from '../../firebase/firebase.config'
import {
  commingAllMessages,
  gettingAppointmentsStart,
} from '../data/data.actions'
import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  getUsers,
  signOutFailed,
} from './user.action'

export function* settingUserPersistence() {
  const user = yield isUserAuthenticated()
  const docRef = yield createUserInFirestore(user)
  if (docRef) {
    const docSnap = yield getdoc(docRef)
    const dbUser = yield docSnap.data()
    yield put(signInSuccess(dbUser))
  }
}

export function* settingUserPersistenceStart() {
  yield takeLatest('CHECKING_USER_PERSISTENCE', settingUserPersistence)
}

export function* signInWithGoogle() {
  try {
    const { user } = yield googleSignIn()
    const docRef = yield createUserInFirestore(user)
    const docSnap = yield getdoc(docRef)
    const dbUser = yield docSnap.data()
    yield put(signInSuccess(dbUser))
    yield put(gettingAppointmentsStart())
  } catch (err) {
    yield put(signInFailed(err.message))
    alert(err.message)
  }
}
export function* signInWithGoogleStart() {
  yield takeLatest('SIGN_IN_WITH_GOOGLE_START', signInWithGoogle)
}

export function* signInWithEmail({ payload }) {
  const { email, password } = payload
  try {
    const { user } = yield emailSignIn(email, password)
    const docRef = yield createUserInFirestore(user)
    const docSnap = yield getdoc(docRef)
    const dbUser = yield docSnap.data()
    yield put(signInSuccess(dbUser))
    yield put(gettingAppointmentsStart())
    // if (dbUser.approve) {
    // } else {
    //   yield alert(
    //     'You have successfully registerd ! Wait for Administrator to approve your registration. After approval you will be able to sign in'
    //   )
    //   yield signOutStart()
    // }
  } catch (error) {
    yield put(signInFailed(error.message))
    alert(error.message)
  }
}
export function* signInWithEmailStart() {
  yield takeLatest('SIGN_IN_WITH_EMAIL_START', signInWithEmail)
}

export function* signOutStart() {
  try {
    yield logout
    yield put(signOutSuccess())
    // const
  } catch (err) {
    yield put(signOutFailed(err.message))
    alert(err.message + 'elo')
  }
}
export function* signOut() {
  yield takeLatest('SIGN_OUT_START', signOutStart)
}

export function* signUpStart({ payload }) {
  try {
    const { email, password, name } = payload
    const { user } = yield emailSignUp(email, password)
    const docRef = yield createUserInFirestore(user, {
      displayName: name,
    })
    const docSnap = yield getdoc(docRef)
    const dbUser = yield docSnap.data()
    yield put(signInSuccess(dbUser))
  } catch (err) {
    yield put(signInFailed(err.message))
    alert(err.message)
  }
}
export function* signUp() {
  yield takeLatest('SIGN_UP_START', signUpStart)
}

export function* gettingUsers() {
  const users = yield fetchingUsers()
  yield put(getUsers(users))
  const messages = yield fetchingMessages()
  yield put(commingAllMessages(messages))
}
export function* gettingUsersStart() {
  yield takeLatest('GETTING_USERS_START', gettingUsers)
}

export function* approveUser(payload) {
  try {
    yield approveDbUser(payload)
    yield gettingUsers()
  } catch (err) {
    alert(err.message)
  }
}
export function* approveUserStart() {
  yield takeLatest('APPROVE_USER', approveUser)
}

export function* forgetPassword(payload) {
  try {
    yield passwordForget(payload)
  } catch (err) {
    alert(err.message)
  }
}
export function* forgetPasswordStart() {
  yield takeLatest('FORGET_PASSWORD', forgetPassword)
}

export function* changePassword(payload) {
  try {
    yield passwordChange(payload)
  } catch (err) {
    alert(err.message)
  }
}
export function* changePasswordStart() {
  yield takeLatest('CHANGE_PASSWORD', changePassword)
}
