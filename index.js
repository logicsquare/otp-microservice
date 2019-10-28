const PhoneNumber = require("awesome-phonenumber")

require("dotenv").config()
const { json, createError } = require("micro")
const { generateOtp, validateOtp } = require("./lib/otp")
const { sendSMS } = require("./lib/sms")

const exampleNos = [
  PhoneNumber.getExample("SG", "mobile").getNumber(),
  PhoneNumber.getExample("US", "mobile").getNumber()
].join(" or ")

/**
 * @api {POST} / Generate or Validate an OTP
 * @apiName otp
 * @apiGroup OTP
 * @apiVersion  1.0.0
 * @apiPermission PUBLIC
 * @apiDescription This microservice generates as well as validates an OTP sent to a valid mobile number
 *
 * @apiParam  {String} action Either "validate" or "generate"
 * @apiParam  {String} mobile A valid mobile number (e.g. +6581234567 or +12015550123)
 * @apiParam  {String} [otpReceived] The OTP received `'validate' Only`
 */
module.exports = async (req, res) => {
  // console.log(req);
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Request-Method", "*")
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT")
  // res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader("Access-Control-Allow-Headers", "authorization, origin, x-requested-with, x-http-method-override, content-type, Overwrite, Destination, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token")
  
  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  try {
    const { action, mobile, otpReceived } = await json(req)
    if (action === undefined) throw createError(400, "Field `action` is mandatory!")
    if (mobile === undefined) throw createError(400, "Field `mobile` is mandatory!")
    if (action === "validate" && otpReceived === undefined) throw createError(400, "Field `otpReceived` is mandatory when `action`=='validate'!")
    if (!PhoneNumber(mobile).isValid() || !PhoneNumber(mobile).isMobile()) throw createError(400, `'${mobile}' doesn't look like a valid Mobile Phone Number! Try something like ${exampleNos}`)
    if (action === "generate") {
      const { otp, expiry } = await generateOtp(mobile, process.env.OTP_LENGTH, process.env.OTP_EXPIRY)
      const smsText = `OTP: ${otp}. It is valid for aprox ${expiry} minutes`
      await sendSMS(process.env.SMS_SERVICE, mobile, smsText)
      return `OTP sent to ${mobile}. It is valid for aprox ${expiry} minutes`
    } else if (action === "validate") {
      await validateOtp(mobile, otpReceived)
      return "OTP Validated"
    }
    throw createError(400, "Unknown `action`! Can be either 'generate' or 'validate'")
  } catch (error) {
    throw createError(500, error.message)
  }
}
