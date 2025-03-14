const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../products.json');

app.use(express.json());
app.use(cors());

function readProducts() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data) || [];
    } catch (err) {
        console.error("Ошибка чтения JSON:", err);
        return [];
    }
}

function writeProducts(products) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Ошибка записи JSON:", err);
        return false;
    }
}

// Получить все товары
app.get('/products', (req, res) => {
    res.json(readProducts());
});

// Получить товар по ID
app.get('/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: "Товар не найден" });
    res.json(product);
});

// Добавить новый товар
app.post('/products', (req, res) => {
    let products = readProducts();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Обновить товар
app.put('/products/:id', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Товар не найден" });

    products[index] = { id: parseInt(req.params.id), ...req.body };
    writeProducts(products);
    res.json(products[index]);
});

// Удалить товар
app.delete('/products/:id', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id !== parseInt(req.params.id));

    if (products.length === filteredProducts.length) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    writeProducts(filteredProducts);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`API запущено на http://localhost:${PORT}`);
});