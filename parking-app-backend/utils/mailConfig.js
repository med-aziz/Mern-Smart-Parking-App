import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth : {
            user: 'parkiniiapp@gmail.com',
            pass: 'esaetbkwmgkcbskw'
        }
    }
)
export default transporter