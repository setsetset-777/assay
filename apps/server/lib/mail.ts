import nodemailer from "nodemailer";

let credentials = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_HOST ?? 587,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_KEY,
};

const isTestAccount = process.env.NODE_ENV !== "production";

if (isTestAccount) {
  const {
    smtp: { host, port },
    user,
    pass,
  } = await nodemailer.createTestAccount();
  credentials = { host, port, user, pass };
}

const { host, port, user, pass } = credentials;
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: { user, pass },
  connectionTimeout: 10000,
  socketTimeout: 20000,
  greetingTimeout: 10000,
});

export const mail = async ({
  from,
  to,
  subject,
  text,
  html,
}: {
  from: string;
  to?: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  if (!to) {
    throw new Error("No destination email provided");
  }

  try {
    const params = {
      from,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(params);

    console.log(`Email sent: ${JSON.stringify(params)}`);

    if (isTestAccount) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (e) {
    throw e;
  }
};
