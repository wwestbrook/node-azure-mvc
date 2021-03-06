import express from 'express';
import moviesRouter from './routers/MoviesRouter';
import * as path from 'path';
import { connect } from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as OpenAPI from 'express-openapi';
import { readFileSync } from 'fs';

dotenv.config();

connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, dbName: 'movies' }
)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log(
            `MongoDB connection error - could not connect to ${
                process.env.MONGODB_URL
            }`
        );
        console.error(err);
    });

// Creates a new Express app instance
const app = express();

// Initializes OpenAPI
// OpenAPI.initialize({
//     app,
//     apiDoc: JSON.parse(
//         readFileSync(path.join(__dirname, '../docs/v1/openapi.json'), 'utf-8')
//     ),
//     paths: []
// });

// Allow CORS
app.use(cors());

// Sets up the view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Parses JSON in body
app.use(express.json());

// Handles /movies routes
app.use('/movies', cors(), moviesRouter);

// app.use('/', (req, res) => res.send('Hello world from index!'));

const port = process.env.PORT || 5000;

// Starts the app on the configured port, then calls the callback when
// the app successfully starts.
app.listen(port, () => {
    console.log(`Listening on port ${port}: http://localhost:${port}`);
});
