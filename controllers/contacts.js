const {Contact} = require("../models/contact");

const { HttpError, ctrlWrapper } = require('../helpers/index');

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite = true } = req.query;
    const skip = (page - 1) * limit;

    const filter = { owner, favorite: favorite === 'true' }; 

    const result = await Contact.find(filter, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");

    res.status(200).json(result);
};

const getContactById = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findOne({_id: contactId, owner: req.user._id});
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
};

const addContact = async (req, res) => {
    const {_id: owner} = req.user;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Missing required name field' });
    }
    const result = await Contact.create({...req.body, owner});

    res.status(201).json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findOneAndRemove({ _id: contactId, owner: req.user._id });
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json({
        message: "contact deleted"
    })
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    
    const update = {...req.body};
    
    const result = await Contact.findOneAndUpdate({_id: contactId, owner: req.user._id}, update, {new: true});
    
    if (!result) {
        throw HttpError(404, "Not found");
    }
    
    res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    if(!req.body) {
        return res.status(400).json({"message": "missing field favorite"});
    }
    const result = await Contact.findOneAndUpdate({_id: contactId, owner: req.user._id}, req.body, {new: true});
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.json(result);
}

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    removeContact: ctrlWrapper(removeContact),
    updateFavorite: ctrlWrapper(updateFavorite),
}

