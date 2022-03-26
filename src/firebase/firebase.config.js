import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth'
import {
  doc,
  getFirestore,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore'
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { store } from '../redux/store'

// const firebaseConfig = {
//   apiKey: 'AIzaSyAZe1x41vl5v6CZkPYS7Xp9sXM9Ob-peaE',
//   authDomain: 'appointment-scheduling-94e48.firebaseapp.com',
//   projectId: 'appointment-scheduling-94e48',
//   storageBucket: 'appointment-scheduling-94e48.appspot.com',
//   messagingSenderId: '298616759818',
//   appId: '1:298616759818:web:6905b57ee0939dc415e1f3',
//   measurementId: 'G-MV7D36GQES',
// }
const firebaseConfig = {
  apiKey: "AIzaSyAVdpfk7A7KAPifC9E1wQ4UXwgTWGS3LoA",
  authDomain: "appointment-schedular-db573.firebaseapp.com",
  projectId: "appointment-schedular-db573",
  storageBucket: "appointment-schedular-db573.appspot.com",
  messagingSenderId: "794215624641",
  appId: "1:794215624641:web:f1f637146b81e89788c940",
  measurementId: "G-T7E82G5J0E"
}
// Initialize Firebase
const firebase = initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore(firebase)
export const googleProvider = new GoogleAuthProvider()
export const getdoc = getDoc

export const googleSignIn = async () =>
  await signInWithPopup(auth, googleProvider)
export const emailSignUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
export const emailSignIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)
export const logout = signOut(auth)

export const isUserAuthenticated = () => {
  return new Promise((res, rej) => {
    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        unsub()
        res(user)
      },
      rej
    )
  })
}
export const createUserInFirestore = async (user, additionalData) => {
  if (!user) {
    console.log('No user found')
    return
  }
  const { displayName, email } = user
  const createdAt = new Date()
  const docRef = doc(db, 'users', `${user.uid}`)
  // const appointment = doc(db, 'users', `${user.uid}`, 'appointments', )
  const docSnap = await getDoc(docRef)

  try {
    if (docSnap.exists()) {
      console.log('Already Exists - Not Overwrited')
    } else {
      // doc.data() will be undefined in this case
      await setDoc(docRef, {
        displayName,
        email,
        createdAt,
        isAdmin: false,
        approve: false,
        id: user.uid,
        ...additionalData,
      })
      // return dbUser
    }
  } catch (error) {
    console.log('eoorr', error.message)
  }
  return docRef
}
export const fetchingUsers = async () => {
  const dataRef = await getDocs(collection(db, 'users'))
  let users = []
  dataRef.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    users.push(doc.data())
  })
  return users
}
export const fetchingMessages = async () => {
  const dataRef = await getDocs(collection(db, 'visitors'))
  let messsages = []
  dataRef.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    messsages.push(doc.data())
  })
  return messsages
}
export const approveDbUser = async ({ payload }) => {
  const userRef = await doc(db, 'users', `${payload.id}`)
  if (payload.manage) {
    await updateDoc(userRef, {
      approve: true,
    })
  } else {
    await deleteDoc(doc(db, 'users', `${payload.id}`))
  }
}
export const passwordForget = async ({ payload }) => {
  sendPasswordResetEmail(auth, payload)
    .then(() => {
      alert('Password Reset Email Sent Check your mail')
    })
    .catch((error) => {
      // ..
    })
}
export const passwordChange = async ({ payload }) => {
  const user = auth.currentUser
  if (user) {
    updatePassword(user, payload)
      .then(() => {
        alert('Password Changed Successfully')
      })
      .catch((error) => {
        // An error ocurred
        alert('error')
        // ...
      })
  } else {
    alert('Sign in again to change password')
  }
}
export const sendMessageInDb = async (payload) => {
  // doc.data() will be undefined in this case
  const rand = Math.floor(Math.random() * 2.5 * 10)
  const docRef = doc(db, 'visitors', `${rand}`)
  await setDoc(docRef, { id: rand, ...payload })
}
export const deleteDbMessage = async (id) => {
  await deleteDoc(doc(db, 'visitors', `${id}`))
}

export const deleteDbAppointment = async (appointment) => {
  let { userReducer } = store.getState()

  await deleteDoc(
    doc(
      db,
      'users',
      `${userReducer.currentUser.id}`,
      'appointments',
      appointment.id
    )
  )
  const newDocRef = doc(db, 'hospitals', appointment.hospital.hospital_id)

  await updateDoc(newDocRef, {
    busySlots: arrayRemove({
      start: appointment.dateAndTime,
      end: appointment.dateAndTime,
    }),
  })
}
// Firebase User till up
// const storage = getStorage()

export const addAppointmentInDb = async (payload) => {
  let { userReducer } = store.getState()
  let id = Math.random().toString(16).slice(2)
  const docRef = doc(
    db,
    'users',
    userReducer.currentUser.id,
    'appointments',
    id
  )

  await setDoc(docRef, { id: id.toString(), ...payload })
  const newDocRef = doc(db, 'hospitals', payload.hospital.hospital_id)
  await updateDoc(newDocRef, {
    busySlots: arrayUnion({
      start: payload.dateAndTime,
      end: payload.dateAndTime,
    }),
  })
}

export const gettingAppointmentsFromDb = async () => {
  let { userReducer } = store.getState()

  const dataRef = await getDocs(
    collection(db, 'users', userReducer.currentUser.id, 'appointments')
  )
  let appointments = []
  dataRef.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    appointments.push(doc.data())
  })
  return appointments
}

export const gettingHospitalsFromDb = async () => {
  const dataRef = await getDocs(collection(db, 'hospitals'))
  let hospitals = []
  dataRef.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    hospitals.push(doc.data())
  })
  return hospitals
}

// Seed the hospitals
const hospitals = [
  {
    name: 'National Eye Center (11-A, Sanda Road, Near MAO College Lahore)',
    image_url:
      'https://media.istockphoto.com/photos/portrait-of-male-doctor-in-white-coat-and-stethoscope-standing-in-picture-id1327024466?b=1&k=20&m=1327024466&s=170667a&w=0&h=vcw4Exhv4pkR8fMVLNXhNESaKq1HbYwJ1iElLlQBxI0=',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'Alabama',

    startDayTime: '08:00',
    endDayTime: '17:59',
    vaccinationPeriodStart: '2022-03-19T00:00',
    vaccinationPeriodEnd: '2022-09-19T00:00',
    busySlots: [],
  },
  {
    name: 'Rashid Hospital (D.H.A Lahore)',
    image_url:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'Alabama',

    busySlots: [],
  },
  {
    name: 'Bahria International Hospital.',
    image_url:
      'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'Alabama',

    busySlots: [],
  },
  {
    name: 'St Thomas Hospitals.',
    image_url:
      'https://images.unsplash.com/photo-1488998527040-85054a85150e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'Alabama',

    busySlots: [],
  },
  {
    name: 'Whittington Hospital',
    image_url:
      'https://images.unsplash.com/photo-1488998527040-85054a85150e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: 'Royal London Hospital',
    image_url:
      'https://media.istockphoto.com/photos/medical-doctor-indoors-portraits-picture-id1323303738?b=1&k=20&m=1323303738&s=170667a&w=0&h=EfPDQj0UOiLRyoZy-ZSWi7XYFeRqL4hG0N7GhDla0_I=',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: 'The London Clinic',
    image_url:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: 'St Marys Hospital',
    image_url:
      'https://study.com/cimages/videopreview/videopreview-full/7hfyoyse54.jpg',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: 'Cleveland Clinic',
    image_url:
      'https://thumbs.dreamstime.com/b/hospital-entrance-emergency-sign-43544491.jpg',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: '	Massachusetts General Hospital',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/f/f4/Royal_Brompton_Hospital-geograph-2105200.jpg',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
  {
    name: 'Toronto General (University Health Network)',
    image_url:
      'https://d2v9ipibika81v.cloudfront.net/uploads/sites/76/USAID-1-1140x684.jpg',
    doctor: {
      name: 'Afraz',
      email: 'afrazmalik321@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'New York city',

    busySlots: [],
  },
   {
    name: 'Vaasa h',
    image_url:
      'https://d2v9ipibika81v.cloudfront.net/uploads/sites/76/USAID-1-1140x684.jpg',
    doctor: {
      name: 'WA',
      email: 'walid.wise6792@gmail.com',
      phone: '+92 323 4242424',
    },

    region: 'Vaasa',

    busySlots: [],
  },
]
// eslint-disable-next-line
const start = async () => {
  for (let i = 0; i < hospitals.length; i++) {
    const element = hospitals[i]

    let id = Math.random().toString(16).slice(2)
    const docRef = doc(db, 'hospitals', id)

    await setDoc(docRef, { id: id.toString(), ...element })
  }
}
//start()
