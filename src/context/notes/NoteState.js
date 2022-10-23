import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //Get all Notes
  const getNotes = async () => {
    //Todo API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM0OTM1N2QxMzlhYzYwZjQ3ZDA4ZjIwIn0sImlhdCI6MTY2NTgxODMzM30.B6_si1tteXkiX6AWYqRtX_0ITw_drBNdzIokyoQAhLM",
      },
    });
    const json = await response.json();
    // console.log(json);
    setNotes(json);
  }
  //Add a Note
  const addNote = async (title, description, tag) => {
    //Todo API call
    const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM0OTM1N2QxMzlhYzYwZjQ3ZDA4ZjIwIn0sImlhdCI6MTY2NTgxODMzM30.B6_si1tteXkiX6AWYqRtX_0ITw_drBNdzIokyoQAhLM"
        },
        body: JSON.stringify({title,description,tag})
      });
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM0OTM1N2QxMzlhYzYwZjQ3ZDA4ZjIwIn0sImlhdCI6MTY2NTgxODMzM30.B6_si1tteXkiX6AWYqRtX_0ITw_drBNdzIokyoQAhLM",
      },
      body: JSON.stringify({title,description,tag}),
    });
    const json = response.json();
    // console.log(json);

    //Logic to edit the note
    //we cannot change the state directly in react so to update notes we have to amke a new object using this below command
    let newNote = await JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  };

  //Delete a Note
  const deleteNote = async (id) => {
  //API to delete
  const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM0OTM1N2QxMzlhYzYwZjQ3ZDA4ZjIwIn0sImlhdCI6MTY2NTgxODMzM30.B6_si1tteXkiX6AWYqRtX_0ITw_drBNdzIokyoQAhLM",
    },
  });  
    const json = response.json();
  // console.log(json);  
    
    // console.log("deletion " + id);
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };

  

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, setNotes, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
