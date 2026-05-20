# Streamo 🎬

Streamo is a modern, high-fidelity full-stack video streaming web application designed with a dark-mode theme mimicry of popular media distribution grids. It enables creators to publish, index, filter, and stream multimedia content securely via asset management routing networks.

---

# 🛠️ Tech Stack & Workspace Architecture

The workspace is configured as a dual-folder monorepo containing both the decoupled client presentation layer and the data processing server backend runtime.

## Project Layout Tree

```text
STREAMO/
├── streamo-client/        # React 19 + Vite 8 Frontend Ecosystem
│   ├── src/
│   │   ├── Components/    # Layout Modules (Header, Home, VideoPlayerPage, etc.)
│   │   ├── utils/         # State Interceptors & Slice Matrices (menuSlice, userSlice)
│   │   ├── App.jsx        # Root Presentation Routing Deck
│   │   └── main.jsx       # Document Object Model Ingestion Node
│
├── streamoBE/             # Node.js + Express 5 Data Engine
│   ├── src/
│   │   ├── config/        # Cloud Registries & DB Connections
│   │   ├── Controller/    # Business Validation & Parsing Logic
│   │   ├── Middleware/    # Binary Multiform Ingestion Filters (Multer)
│   │   ├── Model/         # Database Document Collections (Mongoose Schema Vectors)
│   │   └── Routes/        # Routing Endpoints Matrix
│   └── server.js          # Main Entry Runtime Execution Node
```

---

# Framework & Dependency Registry

## Frontend (streamo-client)

* **Core Runtime:** React ^19.2.6 & React-DOM ^19.2.6
* **Build Tooling:** Vite ^8.0.12 with Tailwind CSS ^4.3.0 integration
* **State Management:** Redux Toolkit ^2.11.2 & React-Redux ^9.2.0
* **Routing & Networking:** React Router Dom ^7.15.0 & Axios ^1.16.1
* **UI Essentials:** Lucide React ^1.14.0 (Icons) & Motion ^12.38.0 (Animations)

## Backend (streamoBE)

* **Core Server:** Express ^5.2.1 running on Node.js
* **Database ODM:** Mongoose ^9.6.2 (MongoDB validation layer)
* **Security & Auth:** Bcrypt ^6.0.0 & JsonWebToken ^9.0.3
* **File Management:** Multer ^2.1.1 (Multipart Form data processing)
* **Validation & Cross-Origin:** Validator ^13.15.3, CORS ^2.8.6, & Dotenv ^17.4.2

---

# ✨ Core Application Features

## Dynamic Media Streams

Immersive custom HTML5 interactive media players rendering raw backend asset paths smoothly.

## Unified Search Architecture

Fully synced Header input bar interacting dynamically with the Home catalog grid payload matrix via active URL parameter injections (`/?q=...`).

## Granular Filter Strips

Category indexing vectors (Tech, Music, Gaming, Cooking, Web Development, Podcasts) to safely toggle client viewports without redundant database round-trips.

## Multipart Binary Uploads

Secure FormData validation channels handling decoupled video buffers and image thumbnail streams via backend `.fields()` parameters.

## Adaptive Global Sessions

Active client authentication synchronization powered by Redux slices, offering protective safe fallbacks if string elements like names or user profile avatars evaluate blank.

---

# 🚀 Getting Started & Installation Setup

Follow these linear terminal command sequences to pull dependencies and establish local runtime orchestration pipelines.

## 1. Prerequisites

Ensure you have the following packages running locally inside your machine environment variables:

* Node.js (v18.x or greater recommended)
* MongoDB Instance (Local daemon connection strings or Atlas URI profiles)

---

# 2. Setting Up Backend Server (streamoBE)

Change into the server working repository subdirectory:

```bash
cd streamoBE
```

Ingest necessary dependencies listed in the file tree:

```bash
npm install
```

Initialize a `.env` configuration file inside the root of your `streamoBE/` project space:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/streamo
```

Spin up the backend process using the Nodemon monitor loop:

```bash
npm start
```

---

# 3. Setting Up Frontend UI Client (streamo-client)

Pivot into the client presentation directory structure out of your workspace split node:

```bash
cd ../streamo-client
```

Compile required package dependency modules:

```bash
npm install
```

Boot up the local hot-reloading development server grid environment:

```bash
npm run dev
```

Access the web client UI view portal directly at:

```text
http://localhost:5173
```

---

# 🔒 Security & Data Lifecycle Layout

## Client Integrity

Secure clean wiping methods automatically run on clear user logout routines (`localStorage.removeItem`), kicking navigation matrices immediately to the baseline home root page index.

## Intercept Validation

Client requests use standardized intercept networks mapping traffic flows directly across backend connection boundaries like:

```text
http://localhost:5000
```

---

# 🌐 GitHub Repository

Add your GitHub repository link here:

```text
https://github.com/WilliamMark1963/Streamo.git
```

---

# 📸 Application Screenshots

## Home Page

*Add screenshot here*

```md
![Home Page](./screenshots/home.png)
```

## Video Player Page

*Add screenshot here*

```md
![Video Player](./screenshots/player.png)
```

## Upload Dashboard

*Add screenshot here*

```md
![Upload Dashboard](./screenshots/upload.png)
```

## Authentication Pages

*Add screenshot here*

```md
![Authentication](./screenshots/auth.png)
```

---

# 📌 Future Enhancements

* Adaptive video quality streaming
* Playlist management architecture
* Live comments & reaction systems
* AI-powered recommendation indexing
* Watch history synchronization
* Cloud storage integrations

---

# 📄 License

This project is built for educational and portfolio demonstration purposes.

---

# 👨‍💻 Author

Developed with passion using React, Node.js, MongoDB, and Express.
