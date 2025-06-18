const Course = ({ course }) => {
    const { id, name, parts } = course
    return (
      <div>
        <h1>{name}</h1>
        {parts.map(
          element => 
          <p key={element.id}> 
            {element.name+ " "+ element.exercises} 
          </p> 
          )
        }
        <b>Total of {parts.map(element => element.exercises).reduce((sum,current) => sum + current, 0 )} exercises</b>
      </div>
    )
  }


export default Course