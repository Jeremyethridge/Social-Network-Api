const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
  createdAt: { type: Date, defualt: Date.now },
  reactionBody: String,
  username: String,
});

const thoughtSchema = new Schema(
  {
    thoughtText: { type: String, required: true, minlength: 1, maxlength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual("reactionCount")
  .get(function () {
    return this.reactions.length;
  })
  .set(function (v) {
    this.set(v);
  });

thoughtSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.createdAt = ret.createdAt.toLocaleString();
    return ret;
  },
});

const Thoughts = model("thoughts", thoughtSchema);

module.exports = Thoughts;