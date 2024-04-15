import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../services/catchAsync.js";
import { Contact } from "../models/contactsModel.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = catchAsync(async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
});

export const getOneContact = catchAsync(async (req, res) => {
  const { id } = req.params;

  // if (id.length !== 24) {
  //   // throw HttpError(404);
  //   return res.status(400).json({ error: "no user found with this ID" });
  // }
  const result = await contactsService.getContactById(id);

  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const deleteContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});

export const createContact = catchAsync(async (req, res) => {
  const newContacts = await Contact.create(req.body);

  res.status(201).json(newContacts);
});

export const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await contactsService.updateContact(id, req.body);
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

  const result = await contactsService.updateStatusContact(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
});
