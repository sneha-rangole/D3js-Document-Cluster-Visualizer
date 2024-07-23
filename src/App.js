import React, { useState , useEffect } from 'react';
import './App.css';
import DocumentIDList from './Javascript/DocumentIDList';
import DocumentContent from './Javascript/DocumentContent';
import MDSPlot from './Javascript/MDSPlot';
import axios from 'axios';

function App({ files }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});

  const [mdsData, setMdsData] = useState([]);

    useEffect(() => {
        // Fetching MDS data from the server
        const fetchMDSData = async () => {
            try {
              const response = await axios.get('http://localhost:5000/api/mds');
              const filteredData = response.data.filter(item => item.mds && item.mds.length === 2);
              setMdsData(filteredData) 
            } catch (error) {
                console.error('Failed to load MDS data:', error);
            }
        };

        fetchMDSData();
    }, []);

    const handleDocumentSelect = docId => {
      setSelectedFiles([docId]);
      // Fetch the content for the selected document if needed
      if (docId) {
        fetchFileContent(docId);
      }
    };
  
    const fetchFileContent = async (docId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/files/${docId}`);
        setFileContents({
          ...fileContents,
          [docId]: response.data.content
        });
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    };

  return (
    <div className='document-viewer'>
      <div className='document-id-container'>
        <DocumentIDList
          files={files}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setFileContents={setFileContents}
        />
      </div>
      <div className='vertical-line'></div>
      <div className='document-content-container'>
        <DocumentContent selectedFiles={selectedFiles} fileContents={fileContents} />
      </div>
      <div className='vertical-line'></div>
      <div className='mds-plot'>
        <MDSPlot data={mdsData} onDocumentSelect={handleDocumentSelect} /> 
      </div>
    </div>
  );
}

export default App;