import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_HOST, UKR_NET_PORT, UKR_NET_PASS, UKR_NET_FROM } = process.env;

const config = {
  host: UKR_NET_HOST,
  port: +UKR_NET_PORT,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASS,
  },
};

const transport = nodemailer.createTransport(config);

export const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};
