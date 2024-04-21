import { model, Schema, Types } from "mongoose";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
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
    owner: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { versionKey: false }
);

export const Contact = model("Contact", contactsSchema);
