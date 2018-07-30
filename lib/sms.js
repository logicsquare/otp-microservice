const Twilio = require("twilio")
const fetch = require("node-fetch")
const querystring = require("querystring")


module.exports = {
  /**
   * @param {*} service. enum["twilio", "textlocal"]
   * @param {*} toNo
   * @param {*} msg
   */
  sendSMS(service = "twilio", toNo, msg) {
    return new Promise((resolve, reject) => {
      if (service === "twilio") {
        const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        twilio.messages.create({
          body: msg,
          to: toNo, // Text this number
          from: process.env.TWILIO_FROM_NO // From a valid Twilio number
        })
          .then((message) => {
            console.log("Twilio Response (message.sid): ", message.sid)
            resolve("OK")
          })
          .catch((err) => {
            console.log("Twilio Error: ", err)
            reject(err)
          })
      } else if (service === "textlocal") {
        const query = querystring.stringify({
          apiKey: process.env.TEXTLOCAL_APIKEY,
          numbers: toNo,
          message: msg,
          sender: process.env.TEXTLOCAL_SENDER
        })
        fetch(`${process.env.TEXTLOCAL_SERVICE_EP}?${query}`)
          .then(res => res.json())
          .then((resp) => {
            console.log(resp);
            if (resp.status === "failure") {
              return reject(new Error("FAILED TO SEND SMS"))
            }
            return resolve("OK")
          })
          .catch((err) => {
            console.log(err.message);
            return reject(new Error("FAILED TO SEND SMS"))
          })
      } else {
        reject(new Error("No Valid Service Name Provided!!"))
      }
      // return "Done!!"
    })
    // const destNos = (!Array.isArray(toNos)) ? [toNos] : toNos
    // Service: PLIVO
  }
}
