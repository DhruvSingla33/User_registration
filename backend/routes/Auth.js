const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, registerUser } = require("../controller/otpcontroller");

router.post("/send-otp-sms", sendOtp);
router.post("/verify-otp-sms", verifyOtp);
router.post("/register-sms", registerUser);

const User = require("../models/user");
router.get("/check-user", async (req, res) => {
  try {
     let { phone} = req.query;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone required (query param "phone")' });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.json({ success: true, exists: false });

    return res.json({
      success: true,
      exists: true,
      verified: user.verified,
      user,
    });
  } catch (err) {
    console.error("check-user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

