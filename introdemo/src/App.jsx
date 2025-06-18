
import {  useEffect, useState } from 'react'
import Note from './components/Note'
import Course from './components/Course'
import axios from 'axios'

import noteService from './services/notes'


// const Button = (props) => {
//   return(
//     <button onClick={props.onClick}>{props.text}</button>
//   )
// }

const SingleContact = (props) => {

  if (props.id !== undefined){
    return (
      <div key={props.id}>
        <p >{props.name+" - "+props.number}</p>
      </div>
    )
  }
  else{
    console.log("id is undefinedid - ", props.id)
    // return (
    //   <p> No match found </p>
    // )
  }

  
  
}


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService.getAll().then(response=>setNotes(response.data))
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    if (newNote.length !==0){
      const noteObject = {
        content: newNote,
        important: Math.random() > 0.25,
      }
  
      noteService.create(noteObject).then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
    }
    else{
      alert("Add something before trying to save")
    }
    
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id)=> {
    const theNote = notes.find(n => n.id ===id)
    const updatedNote = { ...theNote, important: !theNote.important }

    noteService.updateObject(updatedNote.id, updatedNote)
    .then(response => {
      setNotes(notes.map( note => note.id === updatedNote.id? response.data: note))
    })
    

  }

  const handleDeleteOf = (id) => {
    const noteToBeDeleted = notes.find(note => note.id ===id)
    const newnnn = notes.filter(note => note.id !== id)
  
    if( confirm(`Delete -\n ${noteToBeDeleted.content} \n?`, )){
      noteService.deleteObject(id)
      .then(()=>{
        console.log(`${noteToBeDeleted.content} \n - Note deleted successfully`)
        setNotes(newnnn)
      })
      .catch(error => console.log('error ', error))
    } 
     
    

  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)
  console.log("noteToshow: ", notesToShow, "\n notes: ", notes)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note handleDelete ={() => handleDeleteOf(note.id)} toggleImportance={() => toggleImportanceOf(note.id)} key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

// const App = () => {
//   const [notes, setNotes] = useState([])
//   const [newNote, setNewNote] = useState('')
//   const [showAll, setShowAll] = useState(true)

//   useEffect(() => {
//     noteService.getAll().then((response) => {
//       setNotes(response.data)
//     })
//   }, [])

//   const addNote = (event) => {
//     event.preventDefault()
//     const noteObject = {
//       content: newNote,
//       important: Math.random() > 0.5,
//     }

//     axios.post('http://localhost:3001/notes', noteObject).then((response) => {
//       setNotes(notes.concat(response.data))
//       setNewNote('')
//     })
//   }

//   const handleNoteChange = (event) => {
//     setNewNote(event.target.value)
//   }

//   const notesToShow = showAll ? notes : notes.filter((note) => note.important)

//   return (
//     <div>
//       <h1>Notes</h1>
//       <div>
//         <button onClick={() => setShowAll(!showAll)}>
//           show {showAll ? 'important' : 'all'}
//         </button>
//       </div>
//       <ul>
//         {notesToShow.map((note) => (
//           <Note key={note.id} note={note} />
//         ))}
//       </ul>
//       <form onSubmit={addNote}>
//         <input value={newNote} onChange={handleNoteChange} />
//         <button type="submit">save</button>
//       </form>
//     </div>
//   )
// }





// const App = () => {
//   const [persons, setPersons] = useState([]) 
//   const [newName, setNewName] = useState('')
//   const [newNumber, setNewNumber] = useState('')
//   const [searchPerson, setSearchPerson] = useState('')
//   const [showAll, setShowAll] = useState(true)

//   useEffect(() => {
//     fetch('http://localhost:3001/persons')
//     .then(response => response.json())
//     .then(json => {
//       console.log(json)
//       setPersons(json)
//     })
//   }, [] )

//   const addPerson = (event) => {
//     event.preventDefault()
//     if (!(newName.length === 0) && !(persons.some(person => person.name === newName))){
//       const newPerson = {name: (newName), number: newNumber}
      
//       axios
//         .post("http://localhost:3001/persons", newPerson)
//         .then(response => {
//           setPersons(persons.concat(newPerson))
//           setNewName("")
//           setNewNumber("")
//           setShowAll(true)
//         })

    
//     }
//     else if((persons.some(person => person.name === newName))){
//       alert(`The name \"${newName}\" already exists in phonebook. Try another.`)
//     }
//     else{
//       alert("Enter value before submitting")
//     }
    

//   }

//   const filterPerson = (event) => {
//     event.preventDefault()
//     const somePerson = persons.find(person => person.name.toLowerCase() === searchPerson.toLowerCase())
//     if ( !(somePerson === undefined)){
//       console.log('inside if: showall, ', showAll)

//       alert(`${somePerson.name} - ${somePerson.number}`)
//       // setSearchPerson('')
//       const newShowAll = false
//       console.log("new show all: ", newShowAll)
      
//       setShowAll(newShowAll)
//       console.log('inside if: showall, ', showAll)
//     }
//     else {
//       console.log('inside else: showall, before ', showAll)
//       const newShowAll = false
//       setShowAll(newShowAll)
//       console.log('inside else: showall after, ', showAll)
//     }
//     console.log("showall- ", showAll)

//   }

//   const handleNameChange = (event) => {
//     const updatedName = event.target.value    
//     setNewName(updatedName)
//   }

//   const handleNumberChange = (event) => {
//     const updatedNumber = event.target.value 
//     setNewNumber(updatedNumber)

//   }

//   const handleSearchPerson = (event) => {
//       const updatedNameForSearch = event.target.value 
//       setSearchPerson(updatedNameForSearch)
//   }


//   return (
//     <div>
//       <h1>Phonebook</h1>
//       <form onSubmit={filterPerson}>
//         Find: <input value={searchPerson} placeholder='Enter a name' onChange={handleSearchPerson} />
//         <button type='submit'>Search</button>
//       </form>
  
//       <br />
//       <br />
//       <h2> Add number</h2>
//       <form onSubmit={addPerson}>
//         <div>
//           name : <input value ={newName} onChange={handleNameChange}/>
//           <br />
//           <br />
//           number:<input value={newNumber} onChange={handleNumberChange}/>
//         </div>
//         <br />
//         <div>
//           <button type="submit" >add</button>
//         </div>
//       </form>
//       <br /><br />
//       <h2>{showAll? "All Numbers": "Search Results"}</h2>
//       {showAll? 
//         persons.map(
//                 person => <SingleContact key={person.id} name={person.name} id={person.id} number={person.number} />
//                 ) 
//         : 
//          (persons.find(person => person.name.toLowerCase() === searchPerson.toLowerCase()) === undefined? <SingleContact  /> 
//          : 
//          <SingleContact name={persons.find(person => person.name.toLowerCase() === searchPerson.toLowerCase()).name} id={persons.find(person => person.name.toLowerCase() === searchPerson.toLowerCase()).id} number={persons.find(person => person.name.toLowerCase() === searchPerson.toLowerCase()).number}/>)
//       }

      
      
//     </div>
//   )
// }

// const App = () => {
//   const [notes, setNotes] = useState([])
//   const [newNote, setNewNote] = useState('')
//   const [showAll, setShowAll] = useState(true)

//   useEffect(() => {
//     console.log('effect')
//     // axios
//     //   .get('http://localhost:3001/notes')
//     //   .then(response => {
//     //     console.log('promise fulfilled')
//     //     setNotes(response.data)
//     //   })
//     fetch('http://localhost:3001/notes')
//       .then(response => response.json())
//       .then(json => {
//         console.log("Text: ", json, "and type of ", typeof json)
//         setNotes(json)
//       })
//   }, [])

//   console.log('render', notes.length, 'notes')

//   return (
//     <div>
//       {notes.map(note => <Note note={note} key={note.id} />)}
//     </div>
//   )
// }
export default App
