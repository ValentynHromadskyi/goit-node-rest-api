import multer from "multer";
import path from "path";
import { v4 } from "uuid";

import HttpError from "../helpers/HttpError.js";

// config storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cbk) => {
    cbk(null, path.join("tmp"));
  },
  filename: (req, file, cbk) => {
    const extension = file.mimetype.split("/")[1];
    cbk(null, `${req.user.id}-${v4()}.${extension}`);
  },
});

// config filter
const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith("image/")) {
    cbk(null, true);
  } else {
    cbk(new HttpError(400, "Please, upload images only.."), false);
  }
};

// create multer middleware
export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
}).single("avatar");
