const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, 
    secure: true,
    auth: {
        user: "dturash@meta.ua",
        pass: META_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);


const sendEmail = async (data) => {
    const email = {
        from: "dturash@meta.ua",
        ...data,
    };

    try {
        await transport.sendMail(email);
        console.log("Email sent successfully");
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = sendEmail;