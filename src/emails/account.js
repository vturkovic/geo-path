const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendConfirmationEmail = (email, name, token) => {
  sgMail.send({
    to: email,
    from: "vladeeeek@gmail.com",
    subject: `GeoPath confirmation link!`,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <p>
      Dear ${name}, welcome to GeoPath, please follow this
      <a href="https://vturkovic-geo-path.herokuapp.com/confirmation/${token}" target="_blank">link</a>
      to confirm your account!
      </p>
    </body>
    </html>`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "vladeeeek@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. We hope to see you back sometime soon.`,
  });
};

const sendNewPassword = (email, password) => {
  sgMail.send({
    to: email,
    from: "vladeeeek@gmail.com",
    subject: "GeoPath password reset!",
    text: `Your new password is ${password}`,
  });
};

module.exports = {
  sendConfirmationEmail,
  sendCancelationEmail,
  sendNewPassword,
};
