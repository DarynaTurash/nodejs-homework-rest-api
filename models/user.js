const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require("../middlewares");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const labels = ["starter", "pro", "business"];

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: labels,
        default: "starter"
      },
      token: {
        type: String,
        default: "",
      },
      avatarURL: {
        type: String,
        required: true,
    },
      verify: {
        type: Boolean,
        default: false,
    },
      verificationCode: {
        type: String,
        required: [true, 'Verify token is required'],
      }
}, {versionKey: false, timestamps: true});

userSchema.post("save", (error, doc, next) => {
    handleMongooseError(error, next);
});

const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string().valid(...labels),
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
});

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...labels).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema,
    emailSchema
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}