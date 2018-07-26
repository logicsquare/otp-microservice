const Redis = require("ioredis")
const redis = new Redis(process.env.REDIS_HOST)

/**
 * Generates a random string comprised of digits of specified length
 * @param {Number} len length of the OTP string
 * @returns {String} The OTP
 * @private
 * Ref: https://stackoverflow.com/a/29640472
 */
function _otpString(len = 4) {
  const x = 10 ** len
  const y = (10 ** (len - 1)) - 1
  return Math.floor(x + ((y - x) * Math.random()))
}

module.exports = {
  generateOtp(id, otpLength = 4, expiry = 10) {
    const otp = _otpString(otpLength)
    return new Promise((resolve, reject) => {
      redis
        .set(`otp:${id}`, otp, "EX", 60 * expiry)
        .then(() => resolve({ id, otp, expiry }))
        .catch(reject)
    })
  },

  validateOtp(id, otp) {
    return new Promise((resolve, reject) => {
      if (process.env.OTP === "no") {
        return resolve("OTP Disabled")
      }
      return redis
        .get(`otp:${id}`)
        .then((result) => {
          if (result === null) throw new Error("E0001: OTP Expired, Used or Non-Existent")
          if (String(result) !== String(otp)) throw new Error("E0002: Incorrect OTP")
          return redis.del(`otp:${id}`)
        })
        .then(() => resolve("OTP Validated"))
        .catch(reject)
    })
  }
}