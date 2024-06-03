import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",

    auth: {
        user: "neoscoder.dev@gmail.com",
        pass: 'zfjwcysoncxzdkmd',
    }
})

export default transporter;
