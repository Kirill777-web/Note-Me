const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
// installed package to generate unique ids
const { v4: uuidv4 } = require('uuid');
// Path to db.json file
const dbFilePath = path.join(__dirname, '../db/db.json');

// GET /api/notes: This should return all notes from db.json.
router.get('/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// POST /api/notes: This will receive a new note, save it to db.json, and return the new note to the client.
router.post('/notes', (req, res) => {
  const newNote = {
    ...req.body,
    id: uuidv4(),
  };

  // Read the db.json file, add the new note, and write it back
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 4), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// DELETE /api/notes/:id: This will delete the note with the given id from db.json.
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  // Read the current notes
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) throw err;

    const allNotes = JSON.parse(data);
    const newNoteList = allNotes.filter((note) => note.id !== noteId);

    // Write the updated notes back to db.json
    fs.writeFile(dbFilePath, JSON.stringify(newNoteList, null, 4), (err) => {
      if (err) throw err;
      res.json(newNoteList);
    });
  });
});

module.exports = router;
