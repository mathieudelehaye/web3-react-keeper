import React, { useEffect, useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Note from "./components/Note"
import CreateArea from "./components/CreateArea"
import { dkeeper_backend as dkeeper } from "../../declarations/dkeeper_backend"

function App() {

    const [notes, setNotes] = useState([]);

    async function addNote(note) {
        // Optimistically add to UI first
        // Add new node at the beginning
        setNotes((prevValue) => [note, ...prevValue]);

        try {
            await dkeeper.createNote(note.title, note.content);
        } catch (error) {
            console.error("Failed to create note:", error);
            // Rollback on failure - remove the last added note
            setNotes((prevValue) => prevValue.slice(1));
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []); // `[]`: use the effect only once rather than at each rendering.

    async function fetchData() {
        const notes = await dkeeper.readNotes();
        setNotes(notes);
    }

    async function deleteNote(id) {
        const savedNote = notes[id];
        
        // Optimistically delete to UI first
        setNotes((prevValue) => (
            prevValue.filter((_, index) => (index !== id))
        ))

        try {
            await dkeeper.removeNote(id);
        } catch (error) {
            console.error("Failed to delete note:", error);
            // Rollback - restore the note at its original position
            setNotes((prevValue) => {
                const newArray = [...prevValue];
                newArray.splice(id, 0, savedNote);
                return newArray;
            });
        }
    }

    return (
        <div>
            <Header />
            <CreateArea onAdd={addNote} />
            {notes.map((note, index) => (
                < Note onDelete={deleteNote} key={index} id={index} title={note.title} content={note.content} />
            ))}
            <Footer />
        </div>
    )
}

export default App