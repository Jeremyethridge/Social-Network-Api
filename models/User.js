const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (data) => `${data.value} is not a valid email`,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thoughts",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual("friendCount")
  .get(function () {
    return this.friends.length;
  })
  .set(function (v) {
    this.set(v);
  });

const User = model("user", userSchema);

module.exports = User;