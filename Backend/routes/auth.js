const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "yoBroWeAreKillingEit";
const fetchUser = require("../middleware/fetchUser");

//Route 1 : Create a user using: POST "/api/auth/createuser". No login required.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name with atleast 3 characters").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check whether a user with a given email already exist or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with the given email already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      res.json({authToken});
    
    
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal error occured");
    }
  }
);

//Route 2 : Authenticate a user using: POST "/api/auth/login". No login required.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
      {
        return res.status(400).json({error:"Username or Password may be incorrect"})
      }
      
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
      {
        return res.status(400).json({ error: "Username or Password may be incorrect" })
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      res.json({authToken});

    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal error occured");
    }
  }
);

//Route 3 : Get loggedin User details using POST"/api/auth/getuser". Login required.
router.post(
  "/getuser",
  fetchUser,
  async (req, res) => {
    try {
      userid = req.user.id;
      const user = await User.findById(userid).select('-password');
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal error occured");
    }
  });

module.exports = router;
