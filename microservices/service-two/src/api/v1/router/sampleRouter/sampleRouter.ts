import express, { Router } from "express";
import { sampleController } from "../../controller/sampleController/sampleController";

const sampleRouter: Router = express.Router();

sampleRouter.get("/test",sampleController)

export default sampleRouter;