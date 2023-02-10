import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // grab file url specifically for modules (type statement in package.json)
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // set the directory of assets

/* FILE STORAGE */
const storage = multer.diskStorage({
  // from github repo of multer, save files from website into assets
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
// hit register route, use middleware to upload picture in assets
// create a register controller to handle auth
// Not in routes due to "upload" from multer which must be in index
app.post("/auth/register", upload.single("picture"), register);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));