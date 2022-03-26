const initialState = {
  message: 'hello',
  sending: false,
  faculties: [],
  loading: false,
  success: false,
  appointments: [],
  hospitals: [],
}

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
    case 'DELETE_APPOINTMENT_START':
    case 'DELETE_FACULTY_START':
      return { ...state, loading: true }
    case 'CLEAR_SUCCESS':
      return { ...state, success: false }
    case 'SEND_MESSAGE_START':
      return { ...state, sending: true }
    case 'SEND_MESSAGE_SUCCESS':
      return { ...state, sending: false }
    case 'SEND_MESSAGE_FAILED':
      return { ...state, sending: false }
    case 'COMMING_MESSAGES':
      return { ...state, messages: action.payload }
    case 'ADD_FACULTY':
      return { ...state, sending: true }
    case 'SIGN_OUT_SUCCESS':
      return { ...state, appointments: [] }
    case 'ADD_APPOINTMENT_SUCCESS':
    case 'DELETE_APPOINTMENT_SUCCESS':
      return Object.assign({}, state, {
        loading: false,
        success: true,
      })

    case 'ADD_APPOINTMENT_FAILED':
      return Object.assign({}, state, {
        loading: false,
        success: true,
      })
    case 'ADD_FACULTY_FAILED':
      return Object.assign({}, state, {
        sending: false,
        success: false,
      })
    case 'GETTING_APPOINTMENTS_SUCCESS':
      return Object.assign({}, state, {
        appointments: action.payload,
        loading: false,
      })
    case 'GETTING_HOSPITALS_SUCCESS':
      return Object.assign({}, state, {
        hospitals: action.payload,
        loading: false,
      })
    default:
      return state
  }
}
