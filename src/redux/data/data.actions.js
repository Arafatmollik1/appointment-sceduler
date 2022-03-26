export const addAppointment = (payload) => {
  return { type: 'ADD_APPOINTMENT', payload }
}
export const addAppointmentSuccess = () => {
  return { type: 'ADD_APPOINTMENT_SUCCESS' }
}
export const addAppointmentFailed = (payload) => {
  return { type: 'ADD_APPOINTMENT_FAILED', payload }
}
export const gettingAppointmentsStart = () => {
  return {
    type: 'GETTING_APPOINTMENTS_START',
  }
}
export const gettingAppointmentsSuccess = (payload) => {
  return {
    type: 'GETTING_APPOINTMENTS_SUCCESS',
    payload,
  }
}
export const gettingHospitalStart = () => {
  return {
    type: 'GETTING_HOSPITALS_START',
  }
}
export const gettingHospitalSuccess = (payload) => {
  return {
    type: 'GETTING_HOSPITALS_SUCCESS',
    payload,
  }
}
export const gettingHospitalFailed = () => {
  return {
    type: 'GETTING_HOSPITALS_FAILED',
  }
}
export const deleteAppointment = (payload) => ({
  type: 'DELETE_APPOINTMENT_START',
  payload,
})

export const deleteAppointmentSuccess = (payload) => ({
  type: 'DELETE_APPOINTMENT_SUCCESS',
  payload,
})

export const deleteAppointmentFailed = (payload) => ({
  type: 'DELETE_APPOINTMENT_FAILED',
  payload,
})

export const sendMessage = (payload) => ({
  type: 'SEND_MESSAGE_START',
  payload,
})
export const deleteMessage = (payload) => ({
  type: 'DELETE_MESSAGE_START',
  payload,
})

export const sendMessageSuccess = () => ({
  type: 'SEND_MESSAGE_SUCCESS',
})
export const sendMessageFailed = () => ({
  type: 'SEND_MESSAGE_FAILED',
})
export const commingAllMessages = (payload) => ({
  type: 'COMMING_MESSAGES',
  payload,
})
export const clearSuccess = () => {
  return { type: 'CLEAR_SUCCESS' }
}
