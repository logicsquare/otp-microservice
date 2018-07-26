const PhoneNumber = require("awesome-phonenumber")

require("dotenv").config()
const { send, json, createError } = require("micro")
const { generateOtp, validateOtp } = require("./lib/otp")
const { sendSMS } = require("./lib/sms")

const exampleNos = [
  PhoneNumber.getExample("SG", "mobile").getNumber(),
  PhoneNumber.getExample("US", "mobile").getNumber()
].join(" or ")

module.exports = async (req, res) => {
  // console.log(req);
  try {
    const { action, mobile, otpReceived } = await json(req)
    if (mobile === undefined) throw createError(400, "Field `mobile` is mandatory!")
    if (!PhoneNumber(mobile).isValid() || !PhoneNumber(mobile).isMobile()) throw createError(400, `'${mobile}' doesn't look like a valid Mobile Phone Number! Try something like ${exampleNos}`)
    if (action === "generate") {
      const { otp, expiry } = await generateOtp(mobile, process.env.OTP_LENGTH, process.env.OTP_EXPIRY)
      const smsText = `OTP: ${otp}. It is valid for aprox ${expiry} minutes`
      await sendSMS(mobile, smsText)
      return `OTP sent to ${mobile}. It is valid for aprox ${expiry} minutes`
    } else if (action === "validate") {
      await validateOtp(mobile, otpReceived)
      return "OTP Validated"
    }
    throw createError(400, "Unknown action! Can be either 'generate' or 'validate'")
  } catch (error) {
    throw createError(500, error.message)
  }
}
