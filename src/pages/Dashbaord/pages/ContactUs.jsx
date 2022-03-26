import React, { useRef } from 'react'
import emailjs from '@emailjs/browser'

export const ContactUs = () => {
  const form = useRef()

  const sendEmail = (e) => {
    e.preventDefault()
    console.log(form.current)
    emailjs
      .sendForm(
        'service_as7u3cs',
        'template_8phf4kk',
        form.current,
        'WTRrpyS7T0QKAo4I3'
      )
      .then(
        (result) => {
          console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Email</label>
      <input type="email" name="reply_to" />

      <input type="submit" value="Send" />
    </form>
  )
}
