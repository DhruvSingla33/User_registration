require("dotenv").config();
const crypto = require("crypto");

const Otp = require("../models/otp");
const User = require("../models/user");

const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_MINUTES || "10", 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10);

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_PHONE_FROM;

if (!accountSid || !authToken || !twilioFrom) {
  console.warn('Twilio config missing in env. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_FROM');
}

const twilio = require('twilio')(accountSid, authToken);

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}




exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });


    const code = generateOtp();
    const codeHash = hashCode(code);
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

    await Otp.create({ phone, codeHash, expiresAt, attempts: 0 });

      const messageBody = `Your verification code is ${code}. It will expire in ${OTP_EXPIRES_MINUTES} minutes.`;
    await twilio.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_FROM,
      to: phone,
    });

    return res.json({ success: true, message: 'OTP sent via SMS' });
  } catch (err) {
    console.error("sendOtpEmail error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Phone and code required' });
    }

    phone = String(phone).trim();
    const otpDoc = await Otp.findOne({
      where: { phone },
      order: [['createdAt', 'DESC']],
    });

    if (!otpDoc) return res.status(400).json({ success: false, message: 'No OTP found for this phone' });


    if (otpDoc.expiresAt < new Date()) {
      await Otp.destroy({ where: { phone } }); 
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (otpDoc.attempts >= OTP_MAX_ATTEMPTS) {
      await Otp.destroy({ where: { phone } });
      return res.status(429).json({ success: false, message: 'Too many attempts' });
    }

    const codeHash = hashCode(code);
    if (codeHash !== otpDoc.codeHash) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

     await Otp.destroy({ where: { phone } });

    return res.json({ success: true, verified: true });
  } catch (err) {
    console.error("verifyOtpEmail error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.registerUser = async (req, res) => {
  try {
    const { phone, name, firstName, lastName, address } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone Number is required" });
    }

    let user = await User.findOne({ where: { phone } });

    if (user && user.verified) {
      return res.json({
        success: false,
        message: "This phone is already verified and registered.",
        user,
      });
    }

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.address = address || user.address;
      user.verified = true;

      await user.save();
    } else {
      user = await User.create({
        phone,
        name,
        firstName,
        lastName,
        address,
        verified: true,
      });
    }

    res.json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


