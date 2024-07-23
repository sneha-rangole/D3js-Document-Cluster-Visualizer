import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
const { PCA } = require('ml-pca');

function MDSPlot() {
    const [mdsData, setMDSData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:5000/api/documentEntityMatrix');
            const matrix = response.data.matrix;
            console.log('Matrix fetched:', matrix); // Log the fetched matrix
            if (isMatrixConsistent(matrix)) {
                const numericMatrix = convertToNumeric(matrix);
                const reducedDimensions = applyMDS(numericMatrix);
                setMDSData(reducedDimensions);
                drawMDSPlot(reducedDimensions);
            } else {
                console.error('Inconsistent array dimensions in the document-entity matrix:', matrix);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }    

    function isMatrixConsistent(matrix) {
        const columns = matrix.length > 0 ? matrix[0].length : 0;
        const consistent = matrix.every((row, index) => {
            const rowLength = row.length;
            if (rowLength !== columns) {
                console.error(`Row ${index + 1} has ${rowLength} columns instead of ${columns}`);
                return false;
            }
            return true;
        });
        return consistent;
    }
    
    function convertToNumeric(matrix) {
        const maxLength = Math.max(...matrix.map(row => row.length));
        return matrix.map(row => {
            const newRow = Array(maxLength).fill(0);
            row.forEach((val, index) => newRow[index] = typeof val === 'number' ? val : 0);
            return newRow;
        });
    }
    
    function applyMDS(matrix) {
        // Reduce dimensionality if needed
        const reducedDimensions = reduceDimensionality(matrix);

        return reducedDimensions;
    }

    function reduceDimensionality(matrix) {
        // Perform PCA
        const pca = new PCA(matrix);

        // Choose the entities for MDS, ensure at least 5 columns
        const selectedColumns = selectColumns(pca.getExplainedVariance(), matrix[0].length);

        // Extract selected columns from the matrix
        const selectedMatrix = matrix.map(row => selectedColumns.map(index => row[index]));

        // Apply PCA again with selected columns
        const pcaSelected = new PCA(selectedMatrix);
        const reducedDimensions = pcaSelected.predict(matrix.length); // Reduce to the original number of samples

        return reducedDimensions;
    }

    function selectColumns(explainedVariance, totalColumns) {
        // Sort columns by explained variance
        const sortedColumns = explainedVariance
            .map((value, index) => ({ index, value }))
            .sort((a, b) => b.value - a.value);

        // Select at least 5 columns with highest variance
        const selectedColumns = sortedColumns.slice(0, Math.min(5, totalColumns));

        // Return the indices of selected columns
        return selectedColumns.map(column => column.index);
    }

    function drawMDSPlot(data) {
        const width = 800;
        const height = 600;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        const svg = d3.select('#mds-plot')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[1]), d3.max(data, d => d[1])])
            .range([height, 0]);

        // Add circles for each data point
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[0]))
            .attr('cy', d => yScale(d[1]))
            .attr('r', 5)
            .style('fill', 'steelblue')
            .style('cursor', 'pointer'); // Add cursor style for better UX

        // Add labels for each data point
        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => xScale(d[0]))
            .attr('y', d => yScale(d[1]) - 10) // Slightly above the circle
            .text((d, i) => `Document ${i + 1}`) // Assuming each row corresponds to a document
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'black');
    }

    return (
        <div>
            <h2 className='title'>MDS Plot</h2>
            <div id="mds-plot"></div>
        </div>
    );
}

export default MDSPlot;