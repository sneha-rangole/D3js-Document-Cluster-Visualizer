### README for Frontend (visualAnalyticsProject)

---

# Document Clustering and Visualization Frontend

This frontend application is part of the Document Clustering and Visualization project. It provides an interactive user interface for clustering documents and visualizing the results.

## Getting Started

### Prerequisites

- **Node.js** (v12 or later)
- **npm** (v6 or later)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/document-clustering-visualization.git
    cd document-clustering-visualization/visualAnalyticsProject
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Application

1. **Start the frontend application:**

    ```bash
    npm start
    ```

    The application will start on `http://localhost:3000`.

## Project Structure

- **src/components/**
  - **DocumentClustering.js:** React component responsible for clustering documents based on their content. Utilizes D3.js for data visualization. Fetches data from the backend API endpoints `/api/extractEntities` and `/api/clusterDocuments`.
  - **MDSPlot.js:** React component responsible for visualizing the results of the Multidimensional Scaling (MDS) analysis. Utilizes Plotly.js for dynamic and interactive visualization. Fetches MDS data from the backend API endpoint `/api/mds`.

## Features

### Document Clustering Component (`DocumentClustering.js`)

- Fetches document data from backend APIs and visualizes clustering results.
- Uses D3.js for creating interactive visualizations of document clusters.

### MDS Visualization Component (`MDSPlot.js`)

- Displays results of MDS analysis to show document similarity in a reduced-dimensional space.
- Uses Plotly.js for interactive and dynamic visualizations.
- Supports hovering and clicking interactions:
  - **Hovering Interactions:** Highlights the corresponding document ID in the list when hovering over a node in the MDS plot.
  - **Click Interactions:** Opens the corresponding document in the workspace when clicking on a node in the plot.

## Technologies Used

- **React.js:** JavaScript library for building user interfaces.
- **D3.js:** JavaScript library for manipulating documents based on data, used for data visualization.
- **Plotly.js:** JavaScript library for creating dynamic and interactive visualizations.
- **Axios:** Promise-based HTTP client for making requests to the backend API endpoints.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- Thanks to the contributors and the open-source community for their valuable tools and libraries.
- Special thanks to the team members and collaborators for their efforts and support.

---

This README provides an overview of the frontend setup and usage for the Document Clustering and Visualization project. For any questions or further assistance, please refer to the project's documentation or contact the maintainers.
