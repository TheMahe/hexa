import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve static files from the "node_modules" directory
app.use('/node_modules', express.static(path.join(process.cwd(), 'node_modules')));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});