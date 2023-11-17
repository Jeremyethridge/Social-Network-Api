const { User, Thoughts } = require("../models");

module.exports = {
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getSingleThought: async (req, res) => {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) throw { status: 404, message: "No Thought was found with this id." };

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createThought: async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) throw { status: 404, message: "Thought was created. But no User was found with that id." };

      res.status(201).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateThought: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) throw { status: 404, message: "No thought was found with that id." };

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) throw { status: 404, message: "No thought was found with that id." };

      res.status(200).json({ message: "Thought successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addReaction: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValiators: true, new: true }
      );

      if (!thought) throw { status: 404, message: "No thought was found with that id." };

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) throw { status: 404, message: "No thought was found with that id." };

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};