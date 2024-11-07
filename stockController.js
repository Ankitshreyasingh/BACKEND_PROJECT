const fs = require('fs').promises;
const path = require('path');

// File paths
const indianStocksFilePath = path.join(__dirname, 'indian_stocks.json');
const usStocksFilePath = path.join(__dirname, 'us_stocks.json');

// Utility function to read JSON file
const readJSONFile = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

// Utility function to write JSON file
const writeJSONFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Utility function to calculate priorities
const calculatePriorities = (stocks) => {
  return stocks
    .sort((a, b) => b.currentvalue - a.currentvalue)
    .map((stock, index) => ({ ...stock, priority: index + 1 }));
};

// Function to get all Indian stocks
const getIndianStocks = async (req, res) => {
  try {
    const stocks = await readJSONFile(indianStocksFilePath);
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to get all US stocks
const getUSStocks = async (req, res) => {
  try {
    const stocks = await readJSONFile(usStocksFilePath);
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to add a new Indian stock
const addIndianStock = async (req, res) => {
  try {
    const newStock = req.body;
    const stocks = await readJSONFile(indianStocksFilePath);
    stocks.push(newStock);
    const prioritizedStocks = calculatePriorities(stocks);
    await writeJSONFile(indianStocksFilePath, prioritizedStocks);
    res.status(201).json(newStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to add a new US stock
const addUSStock = async (req, res) => {
  try {
    const newStock = req.body;
    const stocks = await readJSONFile(usStocksFilePath);
    stocks.push(newStock);
    const prioritizedStocks = calculatePriorities(stocks);
    await writeJSONFile(usStocksFilePath, prioritizedStocks);
    res.status(201).json(newStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to delete an Indian stock
const deleteIndianStock = async (req, res) => {
  try {
    const { id } = req.params;
    let stocks = await readJSONFile(indianStocksFilePath);
    stocks = stocks.filter(stock => stock.id !== parseInt(id));
    const prioritizedStocks = calculatePriorities(stocks);
    await writeJSONFile(indianStocksFilePath, prioritizedStocks);
    res.status(200).send('Stock Deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to delete a US stock
const deleteUSStock = async (req, res) => {
  try {
    const { id } = req.params;
    let stocks = await readJSONFile(usStocksFilePath);
    stocks = stocks.filter(stock => stock.id !== parseInt(id));
    const prioritizedStocks = calculatePriorities(stocks);
    await writeJSONFile(usStocksFilePath, prioritizedStocks);
    res.status(200).send('Stock Deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to get stocks by priority
const getStocksByPriority = async (type) => {
  try {
    let filePath;
    if (type === 'indian') {
      filePath = indianStocksFilePath;
    } else if (type === 'us') {
      filePath = usStocksFilePath;
    } else {
      throw new Error('Invalid stock type');
    }
    const stocks = await readJSONFile(filePath);
    return calculatePriorities(stocks);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = { getIndianStocks, getUSStocks, addIndianStock, addUSStock, deleteIndianStock, deleteUSStock, getStocksByPriority };
