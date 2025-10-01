# 🎯 Pipeline Builder - Visual Node Editor

A modern pipeline builder with drag-and-drop functionality, featuring a dark glassmorphism theme and pastel color palette.

## 🚀 Quick Setup

### Prerequisites

- **Node.js** (v16+) - [Download here](https://nodejs.org/)
- **Python** (v3.8+) - [Download here](https://python.org/)

### Installation & Running

1. **Backend Setup**
   ```bash
   cd backend
   pip install fastapi uvicorn python-multipart
   python3 main.py
   ```
   ✅ **Backend runs on:** `http://localhost:8001`

2. **Frontend Setup** (open new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   ✅ **Frontend opens at:** `http://localhost:3000`

## 🎮 Usage

1. **Add Nodes**: Drag node types from sidebar to canvas
2. **Connect Nodes**: Drag from output handles (right) to input handles (left)
3. **Configure**: Click nodes to edit their properties
4. **Export**: Use submit button to validate and export pipeline

## 🛠️ Technical Details

### Project Structure

```
frontend_technical_assessment/
├── frontend/                 # React application
│   ├── src/
│   │   ├── nodes/           # Node components and configurations
│   │   ├── ui.js            # Main ReactFlow interface
│   │   ├── toolbar.js       # Sidebar with draggable nodes
│   │   ├── submit.js        # Pipeline submission logic
│   │   └── store.js         # Zustand state management
│   ├── public/              # Static assets and custom icons
│   └── package.json         # Frontend dependencies
└── backend/                 # FastAPI server
    ├── main.py             # API endpoints and validation
    └── requirements.txt    # Python dependencies
```

### Key Technologies

- **Frontend**: React 18, ReactFlow, Styled Components, Zustand
- **Backend**: FastAPI, Python, Uvicorn
- **Styling**: CSS-in-JS with glassmorphism effects
- **State Management**: Zustand for reactive state
- **Icons**: Custom SVG icons and Boxicons

## 🔧 Troubleshooting

**Port conflicts:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8001  
lsof -ti:8001 | xargs kill -9
```

**Dependency issues:**
```bash
# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install

# Backend
cd backend && pip install --upgrade fastapi uvicorn python-multipart
```

**Connection issues:**
- Ensure backend is running on port 8001
- Check browser console for errors
- Verify drag direction: output (right) → input (left)

##  API Endpoints

- `GET /` - Health check
- `POST /pipelines/parse` - Validate pipeline structure
- `POST /pipelines/execute` - Execute pipeline analysis

---

**VectorShift Frontend Technical Assessment Implementation**

Built with React 18, FastAPI, ReactFlow, and Styled Components.