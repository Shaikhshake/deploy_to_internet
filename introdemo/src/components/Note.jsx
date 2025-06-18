const Note = ({ note, toggleImportance, handleDelete}) =>{
    return (
      <li key={note.id}>
        {note.content+"  "}
        <button onClick={toggleImportance}>{note.important? "Make not important": "Make important"}</button>
        <button onClick={handleDelete}>Delete ME</button>
      </li>
    )
  }

export default Note