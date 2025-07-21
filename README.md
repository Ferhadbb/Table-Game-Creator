# Game Creator

A web-based tool for creating and managing board games, card games, and other tabletop games.

## Features

- Interactive game board editor
- Drag-and-drop game pieces
- Multiple piece types (tiles, tokens, cards, dice, etc.)
- Real-time property editing
- Rich text rules editor
- Auto-saving
- PDF export
- Responsive design

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Konva.js for canvas manipulation
- Axios for API calls

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication

### Infrastructure
- Docker
- Docker Compose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/game-creator.git
cd game-creator
```

2. Using Docker (recommended):
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

3. Manual Setup:

Frontend:
```bash
cd client
npm install
npm start
```

Backend:
```bash
cd server
npm install
npm run dev
```

### Environment Variables

Create `.env` files in both client and server directories:

Client (.env):
```
REACT_APP_API_URL=http://localhost:5000
```

Server (.env):
```
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_creator
JWT_SECRET=your_jwt_secret
```

## Development

### Project Structure

```
game-creator/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   └── styles/       # CSS and style files
│   └── public/           # Static files
├── server/                # Backend Node.js application
│   └── src/
│       ├── controllers/  # Route controllers
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       └── middleware/   # Custom middleware
└── docker-compose.yml    # Docker composition file
```

### Available Scripts

Frontend:
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Run linter

Backend:
- `npm run dev`: Start development server
- `npm start`: Start production server
- `npm run migrate`: Run database migrations
- `npm test`: Run tests

## Contributing

1. Fork the repository
2. Create your feature branch 
3. Commit your changes 
4. Push to the branch 
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Konva.js](https://konvajs.org/) for the canvas manipulation
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- All other open-source libraries used in this project 
