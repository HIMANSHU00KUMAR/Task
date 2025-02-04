const express =require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Mock data endpoint
app.get('/api/form-data', (req, res) => {
    const mockData = {
        quantity: 2,
        price: 25,
        total: 40,
        profit: 11,
        isFromApi: true
    };
    console.log(mockData);
    res.json(mockData);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});