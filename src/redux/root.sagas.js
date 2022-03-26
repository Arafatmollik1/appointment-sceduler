import { all, call } from 'redux-saga/effects'

import {
  signInWithGoogleStart,
  signInWithEmailStart,
  settingUserPersistenceStart,
  signOut,
  signUp,
  gettingUsersStart,
  approveUserStart,
  forgetPasswordStart,
  changePasswordStart,
} from './user/users.sagas'
import {
  sendingMessageStart,
  deleteMessageStart,
  gettingAppointmentsStart,
  addAppointmentStart,
  deleteAppointmentStart,
  gettingHospitalsStart,
} from './data/data.sagas'

export default function* rootSaga() {
  yield all([
    call(settingUserPersistenceStart),
    call(signInWithGoogleStart),
    call(signInWithEmailStart),
    call(signOut),
    call(signUp),
    call(gettingUsersStart),
    call(approveUserStart),
    call(forgetPasswordStart),
    call(changePasswordStart),
    call(sendingMessageStart),
    call(deleteMessageStart),
    call(addAppointmentStart),
    call(gettingAppointmentsStart),
    call(deleteAppointmentStart),
    call(gettingHospitalsStart),
  ])
}
