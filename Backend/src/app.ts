import express, { Response, Request } from "express";
import * as dotenv from 'dotenv'
import { authRouter } from "./routes/auth.routes";
import { router as postRouter } from "./routes/post.routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewears/error-handler";
import auth from "./middlewears/auth";
import { COOKIE_SECRET } from "./config";
import { categoryRouter } from "./routes/category.routes";
import { rolesRouter } from "./routes/roles.route";
import { userRouter } from "./routes/user.routes";
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
dotenv.config()

const port = process.env.PORT;
const app = express();

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: false
});

// Log the configuration
// console.log(cloudinary.config());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  }

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json({limit: '100mb'}))
app.use(cookieParser(COOKIE_SECRET))

app.use('/', authRouter);
app.use('/post', postRouter);
app.use('/category', categoryRouter);
app.use('/roles', rolesRouter);
app.use('/user', userRouter);

app.get('/protected', auth, async (req: Request, res: Response) => {
  return res.send("Howdy!")
})

// app.get('/protected', auth, async (req: Request, res: Response) => {
//      // Use the uploaded file's name as the asset's public ID and 
//     // allow overwriting the asset with new versions
//     let imagePath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
//     const options = {
//         use_filename: true,
//         unique_filename: true,
//         overwrite: true,
//         folder: '/profile-pictures'
//       };
  
//       try {
//         // Upload the image
//         const result = await cloudinary.uploader.upload(imagePath, options);
//         console.log(result);
//         return res.json(result);
//       } catch (error) {
//         console.error(error);
//       }
//     return res.json({hey: "Howdy"})
// })

app.use('*', (req, res) => {
    res.json({ err: 'Invalid Request' })
})

app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running at ${port}`);
});