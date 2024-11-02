const { default: mongoose, Schema } = require("mongoose");

const CodeSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: this.email.split("@")[0],
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "User email is required"],
  },
});

const Code = mongoose.model("Code", CodeSchema);
module.exports = Code;
