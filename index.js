import express from 'express';
import 'dotenv/config';
import usersRouter from './routes/users.js';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);


app.get('/', (req, res) => {
  res.send('GET request to the root')
})


app.listen(8000, () => {
console.log(`Listening on port 8000`)
})

