import { createSelector } from 'reselect'

const dataSelector = (state) => state.dataReducer
export const messages = createSelector(
  [dataSelector],
  (dataReducer) => dataReducer.messages
)

export const Loading = createSelector(
  [dataSelector],
  (dataReducer) => dataReducer.loading
)
export const Success = createSelector(
  [dataSelector],
  (dataReducer) => dataReducer.success
)
export const appointmentsSelector = createSelector(
  [dataSelector],
  (dataReducer) => dataReducer.appointments
)
// export const facultySelectorByParam = (urlParams) =>
//   createSelector([facultySelectorList], (faculties) => {
//     return faculties.filter((faculty) => {
//       return faculty.personal.fm_name
//         .toLowerCase()
//         .includes(urlParams.toLowerCase())
//     })
//   })

// export const facultySelectorByUid = (uid) =>
//   createSelector([facultySelectorList], (faculties) => {
//     return faculties.filter((faculty) => faculty.id === uid)
//   })

// export const topFacultySelector = createSelector(
//   [facultySelectorList],
//   (faculties) => faculties.slice(0, 4)
// )
// const universities = []
// export const getUniversities = createSelector(
//   [facultySelectorList],
//   (faculties) => {
//     faculties.map((faculty) => universities.push(faculty.faculty.fm_university))
//     return universities
//   }
// )
// const departments = []
// export const getDepartments = createSelector(
//   [facultySelectorList],
//   (faculties) => {
//     faculties.map((faculty) => departments.push(faculty.faculty.fm_department))
//     return departments
//   }
// )

// var courses = []
// export const getCourses = createSelector([facultySelectorList], (faculties) => {
//   faculties.map(
//     (faculty) => (courses = [...courses, ...faculty.faculty.fm_courses])
//   )
//   return courses
// })
// var experties = []
// export const getExperties = createSelector(
//   [facultySelectorList],
//   (faculties) => {
//     faculties.map(
//       (faculty) => (experties = [...experties, ...faculty.faculty.fm_experties])
//     )
//     return experties
//   }
// )
