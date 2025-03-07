const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use "outlook", "yahoo", etc.
  auth: {
    user: "khuntbhumit84@gmail.com", // Replace with your email
    pass: "ctgk bync pnti rbxo", // Replace with an App Password (not your email password)
  },
});

const sendMail = async (to, subject, text = "", html = "<div></div>") => {
  try {
    let info = await transporter.sendMail({
      from: '"Urban Services" <khuntbhumit84@gmail.com>', // Sender address
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

const sendConfirmMail = async (to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: '"Urban Services" <khuntbhumit84@gmail.com>', // Sender address
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`📧 Email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail, sendConfirmMail };
