import { takeLatest, put } from 'redux-saga/effects'
import {
  addAppointmentInDb,
  deleteDbAppointment,
  deleteDbMessage,
  gettingAppointmentsFromDb,
  gettingHospitalsFromDb,
  sendMessageInDb,
} from '../../firebase/firebase.config'
import { gettingUsers } from '../user/users.sagas'
import {
  sendMessageSuccess,
  sendMessageFailed,
  addAppointmentSuccess,
  addAppointmentFailed,
  gettingAppointmentsSuccess,
  gettingHospitalSuccess,
  gettingHospitalFailed,
  deleteAppointmentFailed,
  deleteAppointmentSuccess,
} from './data.actions'
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'

let serviceId = 'service_mit8rf8'
let templateId = 'template_r58sfcl'
let emailUserId = 'Mu2UP1XpstqejldSf'
export function* sendingMessage({ payload }) {
  try {
    yield sendMessageInDb(payload)
    yield put(sendMessageSuccess())
    alert('Message send successfully, We will contact you soon!')
  } catch (e) {
    alert(e.message)
    yield put(sendMessageFailed())
  }
}

export function* sendingMessageStart() {
  yield takeLatest('SEND_MESSAGE_START', sendingMessage)
}

export function* deleteMessage({ payload }) {
  try {
    yield deleteDbMessage(payload)
    yield alert('Deleted')
    yield gettingUsers()
  } catch (e) {
    alert(e.message)
  }
}
export function* deleteMessageStart() {
  yield takeLatest('DELETE_MESSAGE_START', deleteMessage)
}

export function* gettingAppointments() {
  try {
    const appointments = yield gettingAppointmentsFromDb()
    yield put(gettingAppointmentsSuccess(appointments))
  } catch (e) {
    alert(e.message)
  }
}
export function* gettingAppointmentsStart() {
  yield takeLatest('GETTING_APPOINTMENTS_START', gettingAppointments)
}

export function* gettingHospitals() {
  try {
    // yield addAppointment({ message: 'hello' })
    const hospitals = yield gettingHospitalsFromDb()
    yield put(gettingHospitalSuccess(hospitals))
  } catch (e) {
    alert(e.message)
    yield put(gettingHospitalFailed(e.message))
  }
}
export function* gettingHospitalsStart() {
  yield takeLatest('GETTING_HOSPITALS_START', gettingHospitals)
}

export function* addAppointment({ payload }) {
  try {
    yield addAppointmentInDb(payload)
    yield emailjs
      .send(
        serviceId,
        templateId,
        {
          reply_to: payload.email,
          message: `You have booked an appointment at ${payload.dateAndTime} located at ${payload.hospital.hospital_name}, ${payload.region}`,
        },
        emailUserId
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
    yield emailjs
      .send(
        serviceId,
        templateId,
        {
          reply_to: payload.hospital.doctor_email,
          from_name: payload.name,
          message: `You have new appointment from ${payload.name} at ${payload.dateAndTime} located at ${payload.hospital.hospital_name}, ${payload.region}`,
        },
        emailUserId
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
    yield toast.success('Appointment Createad Successfully')
    history.back()
    yield put(addAppointmentSuccess())

    // yield window.location.reload()
  } catch (er) {
    alert(er.message)
    yield put(addAppointmentFailed(er.message))
  }
}

export function* addAppointmentStart() {
  yield takeLatest('ADD_APPOINTMENT', addAppointment)
}

export function* deleteAppointment({ payload }) {
  try {
    yield deleteDbAppointment(payload)
    yield emailjs
      .send(
        serviceId,
        templateId,
        {
          reply_to: payload.email,
          message: `You have deleted your appointment that was at ${payload.dateAndTime}, located at ${payload.hospital.hospital_name}, ${payload.region}`,
        },
        emailUserId
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
    yield emailjs
      .send(
        serviceId,
        templateId,
        {
          reply_to: payload.hospital.doctor_email,
          from_name: payload.name,
          message: `You appointment from ${payload.name} at ${payload.dateAndTime} located at ${payload.hospital.hospital_name}, ${payload.region} has been deleted`,
        },
        emailUserId
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
    yield put(deleteAppointmentSuccess())
    // yield toast.success('Appointment Deleted')
    // yield gettingAppointments()
    yield alert('Appointment deleted')
    yield window.location.reload()
  } catch (e) {
    yield put(deleteAppointmentFailed())
    alert(e.message)
  }
}
export function* deleteAppointmentStart() {
  yield takeLatest('DELETE_APPOINTMENT_START', deleteAppointment)
}
