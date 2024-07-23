import React from 'react';
import Plot from 'react-plotly.js';

function MDSPlot({ data,onDocumentSelect }) {
    if (!Array.isArray(data)) {
        console.error('Data must be an array');
        return null; 
    }

    const plotData = data.map((item, index) => {
        if (!item || !item.mds || item.mds.length < 2) {
            console.error('Invalid or incomplete data:', item);
            return { x: [], y: [], type: 'scatter', mode: 'markers', name: `Invalid data ${index}` };
        }
        return {
            x: [item.mds[0]],  // First coordinate
            y: [item.mds[1]],  // Second coordinate
            type: 'scatter',
            mode: 'markers',
            marker: { size: 12 },
            name: `${item.id}` 
        };
    }).filter(item => item.x.length > 0); // Filter out invalid data points

    const handlePlotClick = (event) => {
        if (event.points.length > 0) {
            const docIndex = event.points[0].data.name;
            onDocumentSelect(docIndex);
        }
    };

    return (
        <div>
            <h2>MDS Plot</h2>
            <Plot
                data={plotData}
                layout={{ width: 720, height: 600, title: 'MDS Visualization' }}
                onClick={handlePlotClick}
            />
        </div>
    );
}

export default MDSPlot;