import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const notesInitial =
        [
            {
                _id: "634a7da1ea084c95ef262da7",
                user: "6349357d139ac60f47d08f20",
                title: "My Title",
                description: "Please wake up early",
                tag: "Personal",
                __v: 0,
            },
            {
                _id: "634a88d4ea084c95ef262daa",
                user: "6349357d139ac60f47d08f20",
                title: "New Note",
                description: "starting lec 53 of React tutorial",
                tag: "YouTube",
                __v: 0,
            },
        ];
    
    const [notes, setNotes] = useState(notesInitial);

  return (
    <NoteContext.Provider value={{notes,setNotes}}>{props.children}</NoteContext.Provider>
  );
};
export default NoteState;
