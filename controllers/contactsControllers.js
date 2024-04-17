import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../services/catchAsync.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = catchAsync(async (req, res) => {
  const { _id: owner } = req.user;
  const result = await contactsService.listContacts(owner);
  res.status(200).json(result);
});

export const getOneContact = catchAsync(async (req, res) => {
  const result = await contactsService.getContactById(req.params.id, req.user);

  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const createContact = catchAsync(async (req, res) => {
  const newContacts = await contactsService.addContact(req.body, req.user);

  res.status(201).json(newContacts);
});

export const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Body must have at least one field" });
  }
  res.status(200).json(result);
});

export const updateStatusContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateStatusContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});
