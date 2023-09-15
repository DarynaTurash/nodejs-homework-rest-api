const {Schema, model} = require('mongoose');
const Joi = require("joi");

const {handleMongooseError} = require("../middlewares");

const contactSchema = new Schema({
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
}, {versionKey: false, timestamps: true})

const Contact = model("contact", contactSchema);

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
};

module.exports = {
    Contact,
    schemas,
}