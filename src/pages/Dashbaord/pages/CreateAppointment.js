import React, { Component } from 'react'
// import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import moment from 'moment'
// import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'
// import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import SnackBar from 'material-ui/Snackbar'
import Card from 'material-ui/Card'
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper'
import { RadioButton } from 'material-ui/RadioButton'
// import axios from 'axios'
// import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
// import SearchBar from 'material-ui-search-bar'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
// import Dialog from '@mui/material/Dialog'
// import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
// import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
// import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled, alpha } from '@mui/material/styles'
// import { Autocomplete } from '@mui/material'
// import { Divider } from 'material-ui'
// import MenuItem from '@mui/material/MenuItem'
import { connect } from 'react-redux'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import {
  addAppointment,
  gettingHospitalStart,
} from '../../../redux/data/data.actions'
import { toast } from 'react-toastify'
import DateAndTimePicker from '../../../components/DateAndTimePicker'
import emailjs from '@emailjs/browser'
import { Spinner } from '../../../components/spinner/spinner'

// const API_BASE = 'http://localhost:8083/'

const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    // width: '100%',
    // height: '100vh',
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle
      sx={{ m: 0, p: 2 }}
      {...other}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid grey',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

const mapDispatchToProps = (dispatch) => ({
  addApp: (payload) => dispatch(addAppointment(payload)),
  getHospitals: () => dispatch(gettingHospitalStart()),
})

const mapStateToProps = (state) => {
  const { dataReducer } = state
  return {
    success: dataReducer.success,
    hospitals: dataReducer.hospitals || [],
    loading: dataReducer.loading,
  }
}

const intialState = {
  name: '',
  email: '',
  phone: '',
  reason: '',
  additional_info: '',
  validPhone: true,
  validEmail: true,
  finished: false,
  schedule: [],
  confirmationModalOpen: false,
  appointmentDateSelected: false,
  appointmentMeridiem: 0,
  smallScreen: window.innerWidth < 768,
  stepIndex: 0,
  region: '',
  openModal: false,
  hospital: null,
  hospitalSearch: '',
  dateAndTime: '',
}
class CreateAppointment extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      ...intialState,
      regions: getUniqueListBy(
        this.props.hospitals.map((clinic) => ({ region: clinic.region })),
        'region'
      ),
    }
    this.handleAppointmentDateAndTime =
      this.handleAppointmentDateAndTime.bind(this)
  }
  componentDidMount() {
    // this.props.getHospitals()
  }
  handleSubmit() {
    this.setState({ confirmationModalOpen: false })
    const newAppointment = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      // dateAndTime: moment(this.state.dateAndTime).format('YYYY-MM-DDThh:mm:ss'),
      dateAndTime: this.state.dateAndTime,
      hospital: {
        hospital_id: this.state.hospital.id,
        doctor_email: this.state.hospital.doctor.email,
        hospital_name: this.state.hospital.name,
      },
      reason: this.state.reason,
      additional_info: this.state.additional_info,
      region: this.state.region,
    }

    this.props.addApp(newAppointment)
    this.setState(intialState)
  }

  handleNext = () => {
    const { stepIndex } = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 3,
    })
  }

  handlePrev = () => {
    const { stepIndex } = this.state
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 })
    }
  }
  validateEmail(email) {
    const regex =
      // eslint-disable-next-line
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return regex.test(email)
      ? this.setState({ email: email, validEmail: true })
      : this.setState({ validEmail: false })
  }
  validatePhone(phoneNumber) {
    // eslint-disable-next-line
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return regex.test(phoneNumber)
      ? this.setState({ phone: phoneNumber, validPhone: true })
      : this.setState({ validPhone: false })
  }
  // checkDisableDate(day) {
  //   const dateString = moment(day).format('YYYY-DD-MM')
  //   return (
  //     this.state.schedule[dateString] === true ||
  //     moment(day).startOf('day').diff(moment().startOf('day')) < 0
  //   )
  // }

  handleDBReponse(response) {
    const appointments = response
    const today = moment().startOf('day') //start of today 12 am
    const initialSchedule = {}
    initialSchedule[today.format('YYYY-DD-MM')] = true
    const schedule = !appointments.length
      ? initialSchedule
      : appointments.reduce((currentSchedule, appointment) => {
          const { slot_date, slot_time } = appointment
          const dateString = moment(slot_date, 'YYYY-DD-MM').format(
            'YYYY-DD-MM'
          )
          // eslint-disable-next-line
          !currentSchedule[slot_date]
            ? (currentSchedule[dateString] = Array(8).fill(false))
            : null
          // eslint-disable-next-line
          Array.isArray(currentSchedule[dateString])
            ? (currentSchedule[dateString][slot_time] = true)
            : null
          return currentSchedule
        }, initialSchedule)

    for (let day in schedule) {
      let slots = schedule[day]
      // eslint-disable-next-line
      slots.length
        ? slots.every((slot) => slot === true)
          ? (schedule[day] = true)
          : null
        : null
    }

    this.setState({
      schedule: schedule,
    })
  }
  renderAppointmentConfirmation() {
    const spanStyle = { color: '#00C853' }
    return (
      <section>
        <p>
          Name: <span style={spanStyle}>{this.state.name}</span>
        </p>
        <p>
          Number: <span style={spanStyle}>{this.state.phone}</span>
        </p>
        <p>
          Email: <span style={spanStyle}>{this.state.email}</span>
        </p>
        <p>
          Appointment:{' '}
          <span style={spanStyle}>
            {moment(this.state.dateAndTime).format('dddd[,] MMMM Do[,] YYYY')}
          </span>{' '}
          at{' '}
          <span style={spanStyle}>
            {moment(this.state.dateAndTime).format('h:mm a')}
          </span>
        </p>
        <p>
          Location: <span style={spanStyle}>{this.state.hospital?.name}</span>{' '}
          at <span style={spanStyle}>{this.state.region}</span>
        </p>
      </section>
    )
  }
  renderAppointmentTimes() {
    if (!this.state.isLoading) {
      const slots = [...Array(8).keys()]
      return slots.map((slot) => {
        const appointmentDateString = moment(this.state.appointmentDate).format(
          'YYYY-DD-MM'
        )
        const time1 = moment().hour(9).minute(0).add(slot, 'hours')
        const time2 = moment()
          .hour(9)
          .minute(0)
          .add(slot + 1, 'hours')
        const scheduleDisabled = this.state.schedule[appointmentDateString]
          ? this.state.schedule[
              moment(this.state.appointmentDate).format('YYYY-DD-MM')
            ][slot]
          : false
        const meridiemDisabled = this.state.appointmentMeridiem
          ? time1.format('a') === 'am'
          : time1.format('a') === 'pm'
        return (
          <RadioButton
            label={time1.format('h:mm a') + ' - ' + time2.format('h:mm a')}
            key={slot}
            value={slot}
            style={{
              marginBottom: 15,
              display: meridiemDisabled ? 'none' : 'inherit',
            }}
            disabled={scheduleDisabled || meridiemDisabled}
          />
        )
      })
    } else {
      return null
    }
  }

  renderStepActions(step) {
    const { stepIndex } = this.state

    return (
      <div style={{ margin: '12px 0' }}>
        <RaisedButton
          label={stepIndex === 3 ? 'Finish' : 'Next'}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={() => {
            stepIndex === 3
              ? this.setState({ confirmationModalOpen: true })
              : this.handleNext()
          }}
          backgroundColor="#00C853 !important"
          style={{ marginRight: 12, backgroundColor: '#00C853' }}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    )
  }
  renderRegionSelect() {
    return (
      <FormControl fullWidth style={{ margin: '20px 0' }}>
        <InputLabel id="demo-simple-select-label">Region</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.region}
          label="Region"
          onChange={(e) => this.setState({ region: e.target.value })}
        >
          {this.state.regions.map((region) => (
            <MenuItem value={region.region}>{region.region}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
  renderHospitalsList() {
    return (
      <div>
        <BootstrapDialog
          fullWidth
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              this.setState({ openModal: false })
            }
          }}
          aria-labelledby="customized-dialog-title"
          open={this.state.openModal}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={() => this.setState({ openModal: false })}
          >
            <Typography>
              Pick hospital from {this.state.region || ''}
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) =>
                  this.setState({ hospitalSearch: e.target.value })
                }
                value={this.state.hospitalSearch}
              />
            </Search>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Stack direction={'row'} spacing={2}>
              {this.props.hospitals
                .filter(
                  (filter) =>
                    filter.region === this.state.region &&
                    filter.name
                      .toLowerCase()
                      .includes(this.state.hospitalSearch.toLowerCase())
                )

                .map((clinic) => (
                  <Card
                    style={{ width: '240px', cursor: 'pointer' }}
                    onClick={() => {
                      this.setState({ hospital: clinic, openModal: false })
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={clinic.image_url}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {clinic.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attendants Info:
                        <br />
                        <b>{clinic.doctor.name}</b>
                        <address>{clinic.doctor.email}</address>
                        <address>{clinic.doctor.phone}</address>
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Stack>
          </DialogContent>
          {/* <DialogActions>
            <Button
              autoFocus
              onClick={() => this.setState({ openModal: false })}
            >
              Save changes
            </Button>
          </DialogActions> */}
        </BootstrapDialog>
      </div>
    )
  }
  handleAppointmentDateAndTime(e) {
    console.log(e)
    if (e.value < new Date()) {
      toast.warn('This slot has passed. Select future slots')
      this.setState({ dateAndTime: '' })
    } else {
      this.setState({ dateAndTime: e.valueText })
      this.handleNext()
    }
  }
  render() {
    const {
      finished,
      isLoading,
      smallScreen,
      stepIndex,
      confirmationModalOpen,
      confirmationSnackbarOpen,
      ...data
    } = this.state
    const contactFormFilled =
      data.firstName &&
      data.lastName &&
      data.phone &&
      data.email &&
      data.validPhone &&
      data.validEmail

    const modalActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={() => this.setState({ confirmationModalOpen: false })}
      />,
      <FlatButton
        label="Confirm"
        style={{ backgroundColor: '#00C853 !important' }}
        primary={true}
        onClick={() => this.handleSubmit()}
      />,
    ]
    return (
      <div>
        <section
          style={{
            maxWidth: !smallScreen ? '80%' : '100%',
            margin: 'auto',
            marginTop: !smallScreen ? 20 : 0,
          }}
        >
          <Card
            style={{
              padding: '12px 12px 25px 12px',
              height: smallScreen ? '100vh' : null,
            }}
          >
            <Stepper
              activeStep={stepIndex}
              orientation="vertical"
              linear={false}
            >
              <Step>
                <StepLabel>
                  {this.state.region
                    ? `Region: ${this.state.region}`
                    : 'Select the region that suits you !'}
                </StepLabel>
                <StepContent>
                  {this.renderRegionSelect()}
                  {this.state.region ? this.renderStepActions(0) : null}
                </StepContent>
              </Step>

              <Step>
                <StepLabel>
                  {this.state.hospital
                    ? `Hospital: ${this.state.hospital.name}`
                    : 'Select the hospital'}
                </StepLabel>
                <StepContent>
                  <Button onClick={() => this.setState({ openModal: true })}>
                    View Hospital's
                  </Button>{' '}
                  {this.state.hospital ? this.renderStepActions(1) : null}
                  {this.renderHospitalsList()}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>
                  {this.state.dateAndTime
                    ? `Selected Slot: ${this.state.dateAndTime}`
                    : ' Choose an available day and time slot for your appointment'}
                </StepLabel>
                <StepContent>
                  <DateAndTimePicker
                    hospital={this.state.hospital}
                    handleAppointmentDateAndTime={
                      this.handleAppointmentDateAndTime
                    }
                  />

                  {this.state.dateAndTime ? this.renderStepActions(2) : null}
                </StepContent>
              </Step>
              <Step>
                <StepLabel>
                  Share your contact information with us and we'll send you a
                  reminder
                </StepLabel>
                <StepContent>
                  <p>
                    <section>
                      <TextField
                        style={{ display: 'block' }}
                        name="name"
                        hintText="John Smith"
                        floatingLabelText="Name"
                        onChange={(evt, newValue) =>
                          this.setState({ name: newValue })
                        }
                      />
                      <TextField
                        style={{ display: 'block' }}
                        name="email"
                        hintText="youraddress@gmail.com"
                        floatingLabelText="Email"
                        errorText={
                          data.validEmail ? null : 'Enter a valid email address'
                        }
                        onChange={(evt, newValue) =>
                          this.validateEmail(newValue)
                        }
                      />
                      <TextField
                        style={{ display: 'block' }}
                        name="phone"
                        hintText="+2348995989"
                        floatingLabelText="Phone"
                        errorText={
                          data.validPhone ? null : 'Enter a valid phone number'
                        }
                        onChange={(evt, newValue) =>
                          this.validatePhone(newValue)
                        }
                      />
                      <TextField
                        style={{ display: 'block' }}
                        name="reason"
                        hintText="I want to testify"
                        floatingLabelText="Reason"
                        // errorText={
                        //   data.validPhone ? null : 'Enter a valid phone number'
                        // }
                        onChange={(evt, newValue) =>
                          this.setState({ reason: newValue })
                        }
                        required
                      />
                      <TextField
                        style={{ display: 'block' }}
                        name="additional_info"
                        hintText="Any other optional Reason"
                        floatingLabelText="Additional Info"
                        // errorText={
                        //   data.validPhone ? null : 'Enter a valid phone number'
                        // }
                        onChange={(evt, newValue) =>
                          this.setState({ additional_info: newValue })
                        }
                      />
                      <RaisedButton
                        style={{
                          display: 'block',
                          backgroundColor: '#00C853',
                          marginTop: 20,
                          maxWidth: 100,
                        }}
                        label={
                          contactFormFilled
                            ? 'Schedule'
                            : 'Fill out your information to schedule'
                        }
                        labelPosition="before"
                        primary={true}
                        fullWidth={true}
                        onClick={() =>
                          this.setState({
                            confirmationModalOpen:
                              !this.state.confirmationModalOpen,
                          })
                        }
                        disabled={!contactFormFilled || data.processed}
                      />
                    </section>
                  </p>
                  {this.renderStepActions(4)}
                </StepContent>
              </Step>
            </Stepper>
          </Card>
          <Dialog
            modal={true}
            open={confirmationModalOpen}
            actions={modalActions}
            title="Confirm your appointment"
          >
            {this.renderAppointmentConfirmation()}
          </Dialog>
          <SnackBar
            open={confirmationSnackbarOpen || isLoading}
            message={
              isLoading ? 'Loading... ' : data.confirmationSnackbarMessage || ''
            }
            autoHideDuration={10000}
            onRequestClose={() =>
              this.setState({ confirmationSnackbarOpen: false })
            }
          />
        </section>
        {this.props.loading ? <Spinner /> : null}
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateAppointment)
