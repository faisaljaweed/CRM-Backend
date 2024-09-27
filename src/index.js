import dotenv from 'dotenv';
import connectDB from './db/database.js';
import { app } from './app.js';

dotenv.config({
  path: './env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDb Connection failed ${err}`);
  });
