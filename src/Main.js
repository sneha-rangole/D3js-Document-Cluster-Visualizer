import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Style/Main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentClustering from './Javascript/DocumentClustering';
import App from './App';
import { useNavigate } from 'react-router-dom';

function Navigation() {
    let navigate = useNavigate(); 
    return (
        <nav className='navigate-btn-bar'>
            <ul>
                <li>
                    <button className="medium-size" onClick={() => navigate("/")}>Home</button>
                </li>
                <li>
                    <button className="medium-size" onClick={() => navigate("/clustering")}>Document Clustering</button>
                </li>
            </ul>
        </nav>
  );
}

function Main() {
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState([]);

  useEffect(() => {
    // Fetching all file names and their contents from Dataset folder
    const fetchFilesAndContents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files');
        const filesData = Object.entries(response.data.fileContents).map(([name, content]) => ({ name, content }));
        setFileContents(filesData); // Updates the fileContents state with file contents in array format
        setFiles(filesData.map(file => file.name));
      } catch (error) {
        console.error('Error fetching files and contents:', error);
      }
    };

    fetchFilesAndContents();
  }, []);

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<App files={files} />} />
          <Route path="/clustering" element={<DocumentClustering files={fileContents} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Main;