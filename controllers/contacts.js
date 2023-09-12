const contacts = require('../models/contacts');

const { HttpError, ctrlWrapper } = require('../helpers/index');

const listContacts = async (req, res) => {
    const result = await contacts.listContacts();
    res.status(200).json(result);
};

const getContactById = async (req, res) => {
    const {contactId} = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
        throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
};

const addContact = async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Missing required name, email, or phone field' });
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
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
    
    const result = await contacts.updateContact(contactId, contact);
    
    if (!result) {
        throw HttpError(404, "Not found");
    }
    
    res.status(200).json(result);
};


module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    removeContact: ctrlWrapper(removeContact),
}

