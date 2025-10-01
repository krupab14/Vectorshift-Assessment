# Code Explanation

## Frontend Files

### `frontend/src/store.js`
**Purpose:** Central state store that holds all nodes and edges data, manages adding/removing nodes, and tracks pipeline state across the entire application

### `frontend/src/App.js`
**Purpose:** Entry point component that initializes the React application and renders the main UI

### `frontend/src/ui.js`
**Purpose:** Main canvas workspace where users build pipelines by dragging nodes and connecting them with edges

### `frontend/src/toolbar.js`
**Purpose:** Side panel that displays all available node types that users can drag onto the canvas to build their pipeline

### `frontend/src/submit.js`
**Purpose:** Submit button that sends the completed pipeline to the backend server for processing and validation

### `frontend/src/draggableNode.js`
**Purpose:** Makes individual node types in the toolbar draggable so users can drag them from toolbar to canvas

### `frontend/src/nodes/BaseNode.js`
**Purpose:** Shared foundation for all node types - handles common features like styling, delete buttons, form rendering, and connection handles

### `frontend/src/nodes/nodeFactory.js`
**Purpose:** Decides which specific node component to render based on the node type (Input, LLM, Output, etc.)

### `frontend/src/nodes/nodeConfigurations.js`
**Purpose:** Defines how each node type looks and behaves - colors, sizes, input fields, and connection points

### `frontend/src/nodes/inputNode.js`
**Purpose:** Creates input nodes that serve as data entry points for the pipeline

### `frontend/src/nodes/outputNode.js`
**Purpose:** Creates output nodes that serve as data exit points for the pipeline

### `frontend/src/nodes/textNode.js`
**Purpose:** Creates text processing nodes that can manipulate text and use variables from other nodes

### `frontend/src/nodes/llmNode.js`
**Purpose:** Creates AI language model nodes that can process text using different AI models

## Backend Files

### `backend/main.py`
**Purpose:** Web server that receives pipeline data from frontend, analyzes it, and returns processing results

### `backend/test_server.py`
**Purpose:** Testing script to verify that the backend API is working correctly

## Configuration Files

### `frontend/package.json`
**Purpose:** Defines what external libraries the frontend needs and how to build/run the application

### `frontend/public/index.html`
**Purpose:** Base HTML page that loads and displays the React application in the browser

### `frontend/public/manifest.json`
**Purpose:** Tells browsers how to treat the app when installed as a web app on devices

## Overall Purpose
This is a visual pipeline builder where users drag and drop nodes to create data processing workflows, connect them together, and send the result to a backend for execution.