const asyncHandler = require("express-async-handler");

const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });

  res.status(200).json(goals);
});

// @desc Set goal
// @route SET /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  // console.log(req.body)
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field ");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user._id,
  });

  res.status(200).json(goal);
});

// @desc Update goal
// @route PUT /api/goals
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal Not Found");
  }
 
  const user = User.findById(req.user._id)

  // check for user
  if(!user)
  {
    res.status(401)
    throw new Error("User Not Found");
  }

  // Make sure the logged user matches the goal's user
  
  if(goal.user.toString() !== req.user.id )
  {
    res.status(401)
    throw new Error("unauthorized user ")
  }
  // console.log(req.user)
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);

});

// @desc Delete goal
// @route DELETE /api/goals
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal Not Found");
  }

  const user = User.findById(req.user._id)

  // check for user
  if(!user)
  {
    res.status(401)
    throw new Error("User Not Found");
  }

  // Make sure the logged user matches the goal's user
  
  if(goal.user.toString() !== req.user.id )
  {
    res.status(401)
    throw new Error("unauthorized user ")
  }

  // remove() is deprecated now !!!

  await Goal.deleteOne(goal);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
