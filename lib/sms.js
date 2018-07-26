module.exports = {
  /**
  * @param {*} toNo
  * @param {*} msg
  */
  sendSMS(toNo, msg) {
    return new Promise((resolve, reject) => {
      resolve(msg)
    })
  }
}