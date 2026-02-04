require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON body

const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

const storeRoutes = require('../routes/stores');
app.use('/api/stores', storeRoutes);

const dataRoutes = require('../routes/data');
app.use('/api/data', dataRoutes);

const adminRoutes = require('../routes/admin');
app.use('/admin', adminRoutes); // Mount admin routes at /admin

app.get('/', (req, res) => {
    res.send('Field Reporter Backend API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
