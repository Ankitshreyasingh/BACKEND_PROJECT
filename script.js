const app = require('./app');
const { initializeFile } = require('./utils/file'); // Updated path to utils
const { createUserTable } = require('./models/userModel');

const PORT = process.env.PORT || 8081;

initializeFile();
createUserTable();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
