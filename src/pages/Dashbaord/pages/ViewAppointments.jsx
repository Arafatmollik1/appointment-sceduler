import React from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { Eventcalendar, toast } from '@mobiscroll/react'
import moment from 'moment'
import { gettingAppointmentsFromDb } from '../../../firebase/firebase.config'
import { Dialog, FlatButton } from 'material-ui'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAppointment } from '../../../redux/data/data.actions'
import { Loading } from '../../../redux/data/data.selectors'
import { Spinner } from '../../../components/spinner/spinner'
function ViewAppointments() {
  const loading = useSelector(Loading)
  const dispatch = useDispatch()
  const [myEvents, setEvents] = React.useState()
  const [selectedEvent, setselectedEvent] = React.useState(null)
  React.useEffect(() => {
    gettingAppointmentsFromDb().then((res) =>
      setEvents(
        res.map((event) => ({
          start: event.dateAndTime,
          end: moment(event.dateAndTime).add('1h'),
          title: event.reason,
          ...event,
          color: '#7bde83',
        }))
      )
    )
  }, [])
  console.log(loading)
  const responsive = React.useMemo(() => {
    return {
      xsmall: {
        view: {
          calendar: {
            type: 'week',
          },
          agenda: {
            type: 'day',
          },
        },
      },
      custom: {
        // Custom breakpoint
        breakpoint: 600,
        view: {
          calendar: {
            labels: true,
          },
        },
      },
    }
  }, [])
  const onEventClick = React.useCallback((event) => {
    console.log(event)
    setselectedEvent(event.event)
    // toast({
    //   message: event.event.title,
    // })
  }, [])
  const renderAppointmentConfirmation = () => {
    const spanStyle = { color: '#00C853' }
    return (
      <section>
        <p>
          Name:{' '}
          <span style={spanStyle}>{selectedEvent && selectedEvent.name}</span>
        </p>
        <p>
          Number:{' '}
          <span style={spanStyle}>{selectedEvent && selectedEvent.phone}</span>
        </p>
        <p>
          Email:{' '}
          <span style={spanStyle}>{selectedEvent && selectedEvent.email}</span>
        </p>
        <p>
          Appointment:{' '}
          <span style={spanStyle}>
            {selectedEvent &&
              moment(selectedEvent.dateAndTime).format(
                'dddd[,] MMMM Do[,] YYYY'
              )}
          </span>{' '}
          at{' '}
          <span style={spanStyle}>
            {selectedEvent &&
              moment(selectedEvent && selectedEvent.dateAndTime).format(
                'h:mm a'
              )}
          </span>
        </p>
        <p>
          Location:{' '}
          <span style={spanStyle}>
            {selectedEvent && selectedEvent.hospital.hospital_name}
          </span>{' '}
          at{' '}
          <span style={spanStyle}>{selectedEvent && selectedEvent.region}</span>
        </p>
      </section>
    )
  }
  const handleDelete = () => {
    dispatch(deleteAppointment(selectedEvent))

    // setselectedEvent(null)
  }
  const modalActions = [
    <FlatButton
      label="Delete"
      style={{ backgroundColor: '#FF0000  !important' }}
      primary={true}
      onClick={() => {
        if (window.confirm('Are you sure you want to Delete this appointment?'))
          handleDelete()
        setselectedEvent(null)
      }}
    />,
    <FlatButton
      label="Close"
      primary={false}
      onClick={() => setselectedEvent(null)}
    />,
  ]
  return (
    <div>
      <Eventcalendar
        theme="ios"
        themeVariant="light"
        onEventClick={onEventClick}
        clickToCreate={false}
        dragToCreate={false}
        dragToMove={false}
        dragToResize={false}
        data={myEvents}
        responsive={responsive}
      />
      <Dialog
        modal={true}
        open={selectedEvent}
        actions={modalActions}
        title="Appointment details"
      >
        {renderAppointmentConfirmation()}
      </Dialog>
      {loading ? <Spinner /> : null}
    </div>
  )
}

export default ViewAppointments
