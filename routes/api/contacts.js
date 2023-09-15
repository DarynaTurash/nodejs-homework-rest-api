const express = require('express')

const ctrl = require('../../controllers/contacts');

const {validateBody, isValidId} = require("../../middlewares");

const {schemas} = require("../../models/contact");

const router = express.Router();

router.get('/', ctrl.listContacts);

router.get('/:contactId', isValidId, ctrl.getContactById)

router.post('/', isValidId, validateBody(schemas.addSchema), ctrl.addContact)

router.patch("/:id/favorite", isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:contactId', isValidId, ctrl.removeContact)

router.put('/:contactId', isValidId, ctrl.updateContact)

module.exports = router
