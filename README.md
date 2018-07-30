This microservice is meant to be used for generating an One Time Password (OTP) for a valid mobile number, SMS it to the said mobile using a SMS carrier (options are `Twilio` and `Text Local`), and later, also to validate the received OTP against the given mobile number.

It may be noted that this microservice may be used _only_ for Identification/Verification and *not* for Authentication/Authorization.

# Running the Micro Service

0. Clone this git repo, `cd` and run `npm install`
1. Rename the file `env.SAMPLE` to `.env` and populate its fields as required. (Note that `.env` file is gitignored, so you need one in each of the environments you will be running the microservice on. For further  details, check [dotenv](https://www.npmjs.com/package/dotenv))
2. To run the microservice in dev mode, use `npm run dev`. In prod, just use `npm start` (works with latest versions of `pm2` as well)
The microservice uses [Zeit's Micro Framework](https://github.com/zeit/micro), whose documentation may be perused if required.

# API

## Generate or Validate an OTP

<p>This same endpoint generates as well as validates an OTP sent to a valid mobile number</p>

	POST /


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| action			| String			|  <p>Either &quot;validate&quot; or &quot;generate&quot;</p>							|
| mobile			| String			|  <p>A valid mobile number (e.g. +6581234567 or +12015550123)</p>							|
| otpReceived			| String			| **optional** <p>The OTP received <code>['validate' Only]</code></p>							|


# TBD
* Restrict number of validation attempts
* Provide Project/App Identification by means of API keys