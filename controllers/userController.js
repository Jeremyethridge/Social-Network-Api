const { User, Thoughts } = require("../models");

module.exports = {

    getUsers: async (req, res) => {
      try {
        const users = await User.find().select("-__v");
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    getSingleUser: async (req, res) => {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .populate("thoughts friends")
          .select("-__v");
  
        if (!user) throw { status: 404, message: "No User found with id." };
  
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    createUser: async (req, res) => {
      try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    updateUser: async (req, res) => {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        );
  
        if (!user) throw { status: 404, message: "No user was found with this id." };
  
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    deleteUser: async (req, res) => {
      try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId });
  
        if (!user) throw { status: 404, message: "No user was found with this id." };
  
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        await User.deleteOne({ _id: userId });
  
        res.status(200).json({ message: "User successfully deleted!" });
      } catch (err) {
        res.status(500).json(err);
      }
    },
    addFriend: async (req, res) => { 
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          { new: true }
        );
  
        if (!user) throw { status: 404, message: "No user was found with this id." };
  
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
    removeFriend: async (req, res) => {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { new: true }
        );
  
        if (!user) throw { status: 404, message: "No user was found with this id." };
  
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    },
  };
