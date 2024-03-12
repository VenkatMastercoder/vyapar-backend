import express, { Router } from "express";
import sampleRouter from "./sampleRouter/sampleRouter";

const router: Router = express.Router();

router.use('/sample', sampleRouter);

export default router;