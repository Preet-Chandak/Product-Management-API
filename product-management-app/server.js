const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add JWT dependency
const app = express();
const JWT_SECRET = '123'; 

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

const User = mongoose.model('User', userSchema);

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error('Error authenticating user:', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

// View products (accessible to all users)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

// Add product (accessible only to admins)
app.post('/add', authenticateUser, async (req, res) => {
    try {
        // Extract product details from request body
        const { name, description, price } = req.body;

        // Create a new product instance
        const newProduct = new Product({
            name: name,
            description: description,
            price: price
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.json(savedProduct); // Return the saved product
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

// Update product (accessible only to admins)
app.put('/products/:productId', authenticateUser, async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;

        // Find the product by ID and update its details
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name: name,
            description: description,
            price: price
        }, { new: true }); // { new: true } returns the updated document

        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
});

// Delete product (accessible only to admins)
app.delete('/products/:productId', authenticateUser, async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        res.json(deletedProduct);
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
