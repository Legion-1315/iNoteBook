const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1 : Get all the Notes using : GET"/api/notes/getuser". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal error occured");
  }
});

// Route 2 : Add a new Notes using : POST"/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title with atleast 3 characters").isLength({
      min: 3,
    }),
    body("description", "description must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal error occured");
    }
  }
);


// Route 2 : Add a new Notes using : POST"/api/notes/addnote". Login required
router.put(
  "/updatenote/:id",
  fetchUser,
  async (req, res) => {
      const { title, description, tag } = req.body;
      //create a newnote object
      const newNote = {};
      if (title) {
          newNote.title = title;
      }
      if (description) {
          newNote.description = description;
      }
      if (tag) {
          newNote.tag = tag;
      }

      //find the note to be updated and update it after verifying that the user is actually the real user who has written the note.
      let note = await Notes.findById(req.params.id);
      
      if (!note)
      {
          return res.status(404).send("Not Found");
      }

      if (note.user.toString() !== req.user.id)
      {
          return res.status(401).send("Not Allowed")
      }

      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

      res.send(note);
  }
);

module.exports = router;
