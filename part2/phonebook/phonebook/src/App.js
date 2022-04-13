import { useState, useEffect } from "react";
import personService from './services/persons'

const People = ({ people, removePerson }) => {
  return (
    <div>
      {people.map((person) => {
        return (
          <Person person={person} key={person.name} removePerson={removePerson}/>
        );
      })}
    </div>
  );
};

const Person = ({ person, removePerson }) => {
  return (
    <p>
      {person.name} {person.number} <button onClick={() => removePerson(person)}> delete </button>
    </p>
  );
};

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    // Get an array of all names in database

    let names = persons.map((person) => person.name);

    // Check if person being added is already in database

    if (names.includes(newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        
        let addedPerson = persons.find(person => person.name === newName);

        let newPerson = {...addedPerson,
        number: newNumber}
        
        personService
        .update(newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== addedPerson.id ? person : returnedPerson))
        })
        setNewName("");
        setNewNumber("");
      }
    } else {
      personService
        .create({
          name: newName,
          number: newNumber,
        })
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
        });
      setNewName("");
      setNewNumber("");
    }
  };

  const removePerson = (deletedPerson) => {
    
    if(window.confirm(`Do you really want to delete ${deletedPerson.name}?`)) {
      personService
      .deletePerson(deletedPerson.id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })      
    }
    
  }

  const filteredPeople =
    filter !== ""
      ? persons.filter((person) => {
          return person.name.toLowerCase().includes(filter.toLowerCase());
        })
      : persons;

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new entry</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <People people={filteredPeople} removePerson={removePerson} />
    </div>
  );
};

export default App;
