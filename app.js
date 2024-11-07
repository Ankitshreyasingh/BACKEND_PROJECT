const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const userRoute = require("./routes/user");
const userRoutes = require("./routes/userRoutes");
const emailRoutes = require('./routes/emailRoutes');
const { getFDs, addFD, updateFD, deleteFD } = require('./fd/fdController');
const createAdminAccount = require("./scripts/admin");
const { getIndianStocks, getUSStocks, addIndianStock, addUSStock, deleteIndianStock, deleteUSStock, getStocksByPriority } = require('./stocks/stockController');
const { getApprovedLoans, approveLoan } = require('./loan/loanController');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

createAdminAccount(); // Create the admin account on server start

app.use("/user", signupRoute);
app.use("/auth", loginRoute);
app.use("/api", userRoute);
app.use("/api", userRoutes);

//Email
app.use('/api/email', emailRoutes);

// FD Routes
app.get('/api/fds', getFDs);
app.post('/api/fds', addFD);
app.put('/api/fds/:id', updateFD);
app.delete('/api/fds/:id', deleteFD);

// Stock Routes
app.get('/api/stocks/indian', getIndianStocks);
app.get('/api/stocks/us', getUSStocks);
app.post('/api/stocks/indian', addIndianStock);
app.post('/api/stocks/us', addUSStock);
app.delete('/api/stocks/indian/:id', deleteIndianStock);
app.delete('/api/stocks/us/:id', deleteUSStock);

// New endpoint to get stocks by priority
app.get('/api/stocks/indian/priority', async (req, res) => {
  try {
    const stocks = await getStocksByPriority('indian');
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/stocks/us/priority', async (req, res) => {
  try {
    const stocks = await getStocksByPriority('us');
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Loan Routes
app.get('/api/loans/approve', getApprovedLoans); // Get all approved loans
app.post('/api/loans/approve', approveLoan); // Approve a new loan

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
