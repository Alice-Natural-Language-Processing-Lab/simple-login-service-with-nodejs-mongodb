'use strict';

const UnverifiedUser = require('../../models/unverified-account');
const OTP = require('../../models/otp');
const { VERIFY_EMAIL } = require('../../constants/otp-types');
const { sendEmailVerificationLink } = require('../../services/send-otp');
const { hash: hashPassword } = require('../../lib/password');

const signup = async (req, res, next) => {
  try {
    req.body.password = await hashPassword(req.body.password);
    let user = new UnverifiedUser(req.body);
    user = await user.save();
    let otp = new OTP({ userId: user.id, type: VERIFY_EMAIL });
    otp = await otp.save();
    sendEmailVerificationLink(otp.otp, otp.id, user.email);
    res.json({ message: 'Verification Link Sent To Your Email' });
  } catch (error) {
    next(error);
  }
};

module.exports = signup;
