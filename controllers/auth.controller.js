const Code = require("../models/Code.model");
const { transporter } = require("../configs/mail.config");
const jwt = require("jsonwebtoken");

exports.sendCode = async (req, res) => {
  const { email } = req.body;

  let verifyCode = Math.floor(Math.random() * 999999) + 1;

  const code = new Code({
    email,
    code: String(verifyCode),
  });

  await code.save();

  transporter.sendMail(
    {
      from: "gym.crm.llc@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verify your email!", // Subject line
      html: `<h1>Code: ${verifyCode}</h1>`, // plain text body
    },
    function (err) {
      if (err) console.log(err);
      else console.log("Email was sent successfully");
    }
  );

  res.send({
    success: true,
    message: "Verification code sent to your email",
  });
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await Code.findOne({ email, code });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (user.code !== code) {
    return res.status(400).send({ message: "Invalid code" });
  }

  await Code.deleteOne({ email, code });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.send({
    success: true,
    message: "Code verified successfully",
    data: {
      token: token,
    },
  });
};
