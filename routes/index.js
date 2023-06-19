const express = require("express");
const router = express.Router();
const itemsRouter = require("./Items");
const authRouter = require("./Auth");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use("/items", itemsRouter);
router.use("/auth", authRouter);

module.exports = router;
