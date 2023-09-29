import React, {useEffect, useState} from 'react';
import NavBar from './components/navbar';
import PouchDB from 'pouchdb';
import { MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem, MDBBtn, MDBBtnGroup } from "mdb-react-ui-kit";
import { MDBInput, MDBTextArea, MDBCheckbox } from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const db = new PouchDB('todo-app')
    const remoteDB = new PouchDB('http://localhost:5984/todo-app');

    const replication = db.replicate.to(remoteDB, {
      live: true,
      retry: true,
    }).on('change', (info) => {
      console.log('Replication Change: ', info);
      db.allDocs({include_docs: true}).then((result) =>{
        const documents = result.rows.map((row) => row.doc);
        setData(documents);
      });
    });

    db.allDocs({include_docs: true}).then((result) =>{
      const documents = result.rows.map((row) => row.doc);
      setData(documents);
    });

    return () => {
      replication.cancel();
      db.close();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return; 
    }

    const db = new PouchDB('todo-app');
    if (editingId) {
      db.get(editingId).then((doc) => {
        doc.title = title;
        doc.description = description;
        return db.put(doc);
      });
    } else {
      const newDoc = {
        title,
        description,
        completed:false,
      };
      db.post(newDoc);
    }

    setTitle('');
    setDescription('');
    setEditingId(null);

    db.allDocs({include_docs: true}).then((result) =>{
      const documents = result.rows.map((row) => row.doc);
      setData(documents);
    });
  };

  const handleEdit = (id) => {
    const docEdit = data.find((item) => item._id === id);
    if(docEdit){
      setTitle(docEdit.title);
      setDescription(docEdit.description);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    const db = new PouchDB('todo-app');
    db.get(id).then((doc) => {
      return db.remove(doc);
    })

    db.allDocs({include_docs: true}).then((result) =>{
      const documents = result.rows.map((row) => row.doc);
      setData(documents);
    });
  }

  const handleCheckboxChanged = (id, completed) => {
    const db = new PouchDB('todo-app');
    db.get(id).then((doc) => {
      doc.completed = !completed; // Toggle completion status
      return db.put(doc);
    });

    // Fetch updated data from the local database
    db.allDocs({ include_docs: true }).then((result) => {
      const documents = result.rows.map((row) => row.doc);
      setData(documents);
    });
  };

  return (
    <>
    <NavBar />
    <hr />
    <MDBContainer className="mb-4">
      <form onSubmit={handleSubmit}>
          <MDBInput className="mb-4" placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus type="text" />
          <MDBTextArea className="mb-4" value={description} label="Add a description" onChange={(e) => setDescription(e.target.value)}></MDBTextArea>
        <MDBBtn type='submit'>{editingId ? 'Update Item': 'Add Item'}</MDBBtn>
      </form>
    </MDBContainer>
    <MDBContainer>
      <MDBListGroup>
        <MDBRow>
          {data.map((item) => (
            <MDBListGroupItem className="d-flex" key={item._id}>
              <MDBCol size='md-1'>
              <MDBCheckbox className="mt-3" checked={item.completed} onChange={() => handleCheckboxChanged(item._id, item.completed)} type="checkbox" />
              </MDBCol>

              <MDBCol size='md-5'>
              <div>
                  <div className="fw-bold">{item.title}</div>
                  <div className="text-muted">{item.description}</div>
              </div>
              </MDBCol>

              <MDBCol size='6'>
              <MDBBtnGroup className="mt-2" shadow="0" size="sm">
                  <MDBBtn className="me-2" onClick={() => handleEdit(item._id)}>Edit</MDBBtn>
                  <MDBBtn color="danger" onClick={() => handleDelete(item._id)}>Delete</MDBBtn>
              </MDBBtnGroup>
              </MDBCol>
            </MDBListGroupItem>
          ))}
        </MDBRow>
      </MDBListGroup>
    </MDBContainer>
    </>
  );
}

export default App;
