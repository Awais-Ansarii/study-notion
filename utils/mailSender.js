const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com", // MAIL_HOST
      port: 465,

      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: title,
      //   text: body,
      html: body,
    };
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully--`, info);
    return;
  } catch (err) {
    console.log(`error while sending email--`, err.message);
  }
};

module.exports = mailSender;
