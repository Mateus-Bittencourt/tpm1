import express from 'express';
import brandsRouter from './routes/brands.js';

const app = express();
app.use(express.json());
app.use("/brands", brandsRouter);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
