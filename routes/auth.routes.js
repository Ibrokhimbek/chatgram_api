const { sendCode, verifyCode } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/verifyEmail", sendCode);
router.post("/verifyCode", verifyCode);

module.exports = router;
