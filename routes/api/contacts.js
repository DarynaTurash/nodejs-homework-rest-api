const express = require('express')

const ctrl = require('../../controllers/contacts');

const {validateBody, isValidId, authenticate} = require("../../middlewares");

const {schemas} = require("../../models/contact");

const router = express.Router();

router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.patch("/:id/favorite", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact)

router.put('/:contactId', authenticate, isValidId, ctrl.updateContact)

module.exports = router
