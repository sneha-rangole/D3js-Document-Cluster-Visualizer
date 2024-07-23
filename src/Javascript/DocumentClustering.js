import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import DocumentContent from './DocumentContent';
import '../Style/DocumentClustering.css';

function DocumentClustering({ files }) {
    const [clusters, setClusters] = useState([]);
    const [clusterName, setClusterName] = useState('');
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (files.length > 0) {
            clusterDocuments(files);
        }
    }, [files]);

    async function fetchEntities(content) {
        try {
            const response = await axios.post('http://localhost:5000/api/extractEntities', { text: content });
            return response.data.entities;
        } catch (error) {
            console.error('Error fetching entities:', error);
            return [];
        }
    }

    async function clusterDocuments(files) {
        try {
            const documentsWithEntitiesPromises = files.map(async (file) => {
                const entities = await fetchEntities(file.content);
                return {
                    name: file.name,
                    content: file.content,
                    entities,
                };
            });

            const documentsWithEntities = await Promise.all(documentsWithEntitiesPromises);

            const response = await axios.post('http://localhost:5000/api/clusterDocuments', { documents: documentsWithEntities });
            setClusters(response.data.clusters);
        } catch (error) {
            console.error('Error clustering documents:', error);
            setClusters([]);
        }
    }

    function handleClusterClick(clusterIndex) {
        const cluster = clusters[clusterIndex];
        setClusterName(cluster.clusterName);
        setSelectedCluster(cluster);
        setSelectedFiles(cluster.documents.map(file => file.name));
    }

    useEffect(() => {
        drawClusters();
    }, [clusters]);

    function drawClusters() {
        d3.select('#cluster-container svg').remove();
        const svg = d3.select('#cluster-container').append('svg').attr('width', '100%').attr('height', '100vh');
        const clusterColors = d3.scaleOrdinal(d3.schemeCategory10);
        const simulationData = clusters.map((cluster, index) => ({
            index: index,
            radius: Math.sqrt(cluster.documents.length) * 10,
            cluster: cluster.clusterName // Assuming clusterName property exists
        }));

        const simulation = d3.forceSimulation(simulationData)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 2))
            .stop();

        for (let i = 0; i < 120; ++i) simulation.tick();

        svg.selectAll('.cluster')
            .data(simulation.nodes())
            .enter()
            .append('circle')
            .attr('class', 'cluster')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .attr('fill', (d, i) => clusterColors(i))
            .on('mouseover', function (event, d) {
              d3.select('#tooltip')
                  .style('opacity', 1)
                  .html(`Cluster: ${d.cluster}<br>Files (${clusters[d.index].documents.length}):<br> 
                         ${clusters[d.index].documents.map(file => file.name).join(', ')}`)
                  .style('left', (event.pageX + 20) + 'px')
                  .style('top', (event.pageY - 20) + 'px');
            })
            .on('mouseout', function () {
                d3.select('#tooltip').style('opacity', 0);
            })
            .on('click', (event, d) => handleClusterClick(d.index));

        svg.selectAll('.cluster-label')
            .data(simulation.nodes())
            .enter()
            .append('text')
            .attr('class', 'cluster-label')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .text(d => d.cluster);
    }

    return (
        <div>
            <h1>Clusters {clusterName}</h1>
            <div className="clusters-and-content-container">
                <div id="cluster-container"></div>
                {selectedCluster && (
                    <DocumentContent
                        selectedFiles={selectedFiles}
                        fileContents={selectedCluster.documents.reduce((acc, curr) => {
                            acc[curr.name] = curr.content;
                            return acc;
                        }, {})}
                    />
                )}
            </div>
            <div id="tooltip" className="tooltip"></div>
        </div>
    );
}

export default DocumentClustering;