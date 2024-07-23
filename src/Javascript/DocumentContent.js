import React from 'react';
import '../App.css';

// Document Content Display
function DocumentContent({ selectedFiles, fileContents }) {
  return (
    <div>
      <h2 className='title'>Selected Files:</h2>
      <div className='file-list'>
        {selectedFiles.map((file, index) => (
          <div className='content-wrapper' key={index}>
            <div className='file-content-title'>{file}</div> 
            <div>
              <pre className='file-content'>{fileContents[file]}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentContent;