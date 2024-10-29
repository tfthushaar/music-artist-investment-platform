# Music Artist Investment Platform - Backend

This is the backend for a web application that allows users to invest in musicians' careers, similar to buying stock in a company. Investors can purchase shares in an artist's entire career and benefit from their success.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Contributing](#contributing)

## Features

- User registration and authentication (artist and investor).
- Artists can create profiles and offer shares.
- Investors can browse artists, filter by genre, and buy/sell shares.
- Portfolio management for investors to track share performance.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- dotenv for environment variable management

## Installation

1. **Clone the repository:**

   git clone https://github.com/tfthushaar/music-artist-investment-platform.git

2. **Install dependencies:**

   npm install

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the following:

     MONGO_URI=mongodb://localhost:27017/your_database_name
     JWT_SECRET=your_secret_key
     
   - Replace `your_database_name` with the desired name of your MongoDB database and `your_secret_key` with a secure key.

4. **Start the MongoDB server:**
   If you're using a local MongoDB instance, ensure it's running by executing:

   mongod

## Usage

- To start the server, run:
  node app.js
  
- The server will run on `http://localhost:5000`.

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user (artist or investor).
- `POST /api/auth/login` - Log in and receive a JWT.

### Artist
- `POST /api/artist` - Add a new artist profile and offer shares.
- `GET /api/artist` - Get a list of all artists.

### Investor
- `GET /api/investor` - Browse available artists and filter by genres.
- `POST /api/investor/buy` - Buy shares of an artist.
- `POST /api/investor/sell` - Sell shares of an artist.
- `GET /api/investor/portfolio` - View investor's share performance and details.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any features or fixes.
