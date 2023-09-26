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
    const result = await Contact.findById(contactId);
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
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json({
        message: "contact deleted"
    })
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    
    if (!contact) {
        throw HttpError(404, "Not found");
    }
    
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }
    
    for (const key in updatedFields) {
        if (contact.hasOwnProperty(key)) {
            contact[key] = updatedFields[key];
        }
    }
    
    const result = await Contact.findByIdAndUpdate(contactId, contact, {new: true});
    
    if (!result) {
        throw HttpError(404, "Not found");
    }
    
    res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    if(!req.body) {
        return res.status(400).json({"message": "missing field favorite"});
    }
    const result = await Book.findByIdAndUpdate(id, req.body, {new: true});
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

