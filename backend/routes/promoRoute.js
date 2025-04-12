import express from "express";
import { createPromo, deletePromo, listPromos, validatePromo } from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/create", createPromo);
promoRouter.get("/list", listPromos);
promoRouter.delete("/delete/:id", deletePromo);
promoRouter.post("/validate", validatePromo);

export default promoRouter;
