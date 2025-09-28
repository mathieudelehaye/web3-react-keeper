import Debug "mo:base/Debug";
import List "mo:base/List";

actor DKeeper {

  public type Note = {
    title: Text;
    content: Text;
  };

  stable var notes: List.List<Note> = List.nil<Note>();

  public func createNote(title: Text, content: Text) {
    let newNote: Note = {
      title = title;
      content = content;
    };

    notes := List.push<Note>(newNote, notes);
    Debug.print("After creating new note: "#debug_show(notes));
  };

  // Return a serialised array, which is more efficient on frontend, although data are stored as a List object on blockchain for performance reason. 
  public query func readNotes(): async [Note] {
    return List.toArray(notes);
  };

  public func removeNote(id: Nat) {
    let listFront = List.take(notes, id);
    let listBack = List.drop(notes, id+1);
    notes := List.append(listFront, listBack);
    Debug.print("After removing note id "#debug_show(id)#": "#debug_show(notes));
  };
}