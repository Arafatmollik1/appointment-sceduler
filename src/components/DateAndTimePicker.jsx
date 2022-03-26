import React from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { Datepicker, Page, setOptions } from '@mobiscroll/react'
import Card from 'material-ui/Card'
import moment from 'moment'

setOptions({
  theme: 'ios',
  themeVariant: 'light',
})

function DateAndTimePicker({ hospital, handleAppointmentDateAndTime }) {
  const min = hospital.vaccinationPeriodStart
  const max = hospital.vaccinationPeriodEnd
  console.log(hospital.busySlots)
  return (
    <Card
      style={
        {
          // padding: '12px 12px 25px 12px',
          // width: '80%',
          // margin: '0 auto',
          // height: true ? '100vh' : null,
        }
      }
    >
      <Page className="md-calendar-booking">
        {/* <div className="mbsc-form-group"> */}
        {/* <div className="mbsc-form-group-title">
          Single date & appointment booking
        </div>
        <Datepicker
          display="inline"
          controls={['calendar']}
          min={min}
          max={max}
          labels={singleLabels}
          invalid={singleInvalid}
          pages="auto"
          onPageLoading={onPageLoadingSingle}
        />
      </div> */}
        {/* <div className="mbsc-form-group"> */}
        {/* <div className="mbsc-form-group-title">Select date & time</div> */}
        <Datepicker
          placeholder="Click here to select"
          responsive={{
            xsmall: {
              controls: ['calendar', 'timegrid'],
              display: 'bottom',
              touchUi: true,
            },
            large: {
              controls: ['calendar', 'timegrid'],
              display: 'anchored',
              touchUi: true,
            },
          }}
          display="inline"
          controls={['calendar', 'timegrid']}
          min={min}
          max={max}
          // marked={datetimeLabels}
          minTime={hospital.startDayTime}
          maxTime={hospital.endDayTime}
          stepMinute={15}
          width={null}
          // marked={hospital.busySlots.map((day) => ({
          //   date: new Date(day.start),
          //   color: '#f13f77',
          // }))}
          // invalid={datetimeInvalid}
          invalid={[
            {
              recurring: {
                repeat: 'weekly',
                weekDays: 'SA,SU',
              },
            },
            ...hospital.busySlots,
          ]}
          // onPageLoading={onPageLoadingDatetime}
          cssClass="booking-datetime"
          onChange={(e) => handleAppointmentDateAndTime(e)}
        />
        {/* </div> */}
        {/* <div className="mbsc-form-group">
        <div className="mbsc-form-group-title">
          Booking multiple appointments
        </div>
        <Datepicker
          display="inline"
          controls={['calendar']}
          value={multiple}
          min={min}
          max={max}
          labels={multipleLabels}
          invalid={multipleInvalid}
          pages="auto"
          selectMultiple={true}
          onPageLoading={onPageLoadingMultiple}
        />
      </div> */}
      </Page>
    </Card>
  )
}

export default DateAndTimePicker
