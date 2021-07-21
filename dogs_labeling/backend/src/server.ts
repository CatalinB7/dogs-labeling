import express from "express";
import router from "./routes";
import cors from "cors";
import bodyParser from "body-parser";
import { CustomError } from "./db";

const app = express();
const port = 8080;
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.use(function (err: CustomError, req: any, res: any, next: any) {
  console.log(err.StatusCode, err.message);
  res.status(err.StatusCode).send(err.message);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});