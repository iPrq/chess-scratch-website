<div align="center">
  <h1>♞ Checkmate: The Grandmaster's Study</h1>
  <p><i>A high-end, real-time multiplayer chess experience with an editorial touch.</i></p>

  ![Checkmate UI Banner](./chess-app/public/banner.png)
</div>

---

## 📖 Overview

Welcome to **Checkmate**, a premium full-stack multiplayer chess application modeled on the philosophy of **"The Grandmaster's Study."** Moving beyond typical gamified designs, this application uses a "Tactile Minimalist" aesthetic with deep forest greens, crisp bone-colored creams, and high-contrast typography, treating every match with the elegance of a physical mahogany board. 

Checkmate is built with a sophisticated tech stack ensuring smooth, real-time multiplayer interactions that include shareable invites, a live chat system, and full synchronization under the hood.

---

## ✨ Features

- **⚡ Real-Time Multiplayer Gameplay**
  Powered by STOMP over WebSockets (via SockJS), every move updates across players' screens simultaneously in under 50ms with a robust game state synchronizer.
  
- **💬 In-Game Live Chat**
  Coordinate, converse, and strategize with a sleek integrated chatbot sidebar. Chat operates seamlessly on the existing low-latency WebSocket connections.

- **🎫 Lobby & Invite System**
  Generate unique, secure Game IDs via an intelligent REST API. Host a lobby, share the link, and enter a cohesive waiting room flow to manage matchups before transitioning to the active board.

- **♟ Full Chess Logic & State Management**
  Extensively mapped logical engine managing everything from basic boundaries to complex Pawn Promotions.

- **🖌 Tactile Minimalism & Glassmorphism UI**
  Deep integration of a "Grandmaster's Study" design language using Tailwind CSS v4. Elevated components, "Ghost Borders," and Framer Motion micro-animations create the tactile sensation of a paper on felt. Features fully integrated **Dark** and **Light** modes utilizing `next-themes`.

---

## 🛠 Technical Architecture

This repository is structured as a mono-repo, physically separated into frontend and backend applications with well-defined APIs.

### Backend (`/app`)
Our chess logic and real-time multiplayer routing is driven by a high-performance **Java Spring Boot Engine**:
- **Framework:** Java 21, Spring Boot v4.0.4.
- **Real-Time Communication:** Spring Boot WebSocket (`spring-boot-starter-websocket`) orchestrating concurrent STOMP endpoints.
- **Data Persistence:** MongoDB (`spring-boot-starter-mongodb`) to persist Game State, Chats, and Match Histories.
- **Containerization:** Clean, multi-staged `Dockerfile` and `docker-compose.yml` for zero-friction local deployments.

### Frontend (`/chess-app`)
A next-generation reactive client handling the complex presentation logic and user experience:
- **Framework:** Next.js 16.2.1, React 19 App Router.
- **Styling framework:** Modern TailwindCSS v4 with highly customized layout configurations avoiding standard "1px solid" boundaries.
- **Animations:** Framer Motion (`motion`) creating natural depth, sliding promotion modals, and glowing selection overlays.
- **WebSocket Consumer:** `@stomp/stompjs` & `sockjs-client` providing client-side consumption of real-time server events.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+) & npm
- Java 21 & Maven
- Docker & Docker Compose

### 1. Launching the Backend Server
Navigate to the Spring Boot directory, start dependencies and the service:
```bash
cd app
# Start the MongoDB container
docker-compose up -d

# Run the standard Spring Boot backend
./mvnw spring-boot:run
```

### 2. Launching the Next.js Client
In a separate terminal, transition into the frontend directory:
```bash
cd chess-app

# Install the necessary dependencies
npm install

# Start the interactive development server
npm run dev
```

Visit `http://localhost:3000` to enter the lobby and start a match!

## 🖌 Design System Details
> For a deeper understanding of our unique design requirements (typography scale, "The No-Line Rule," and depth layering), please refer to the primary design documentation located in [`chess-app/DESIGN.md`](./chess-app/DESIGN.md).
