const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./db_config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối database
async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Đã kết nối Azure SQL thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối:', err.message);
  }
}
connectDB();

// GET lời chúc
app.get('/api/wishes', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Wishes ORDER BY Hearts DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Lỗi truy vấn database');
  }
});

// POST lời chúc
app.post('/api/wishes', async (req, res) => {
  const { nickname, wishText } = req.body;
  if (!nickname || !wishText) return res.status(400).json({ message: 'Thiếu thông tin' });
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('nickname', sql.NVarChar(100), nickname)
      .input('wishText', sql.NVarChar(500), wishText)
      .query('INSERT INTO Wishes (Nickname, WishText) VALUES (@nickname, @wishText)');
    res.json({ message: '🌸 Gửi lời chúc thành công!' });
  } catch (err) {
    res.status(500).send('Lỗi khi thêm lời chúc');
  }
});

// PUT thả tim
app.put('/api/wishes/:id/heart', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await sql.connect(dbConfig);
    await pool.request().input('id', sql.Int, id)
      .query('UPDATE Wishes SET Hearts = Hearts + 1 WHERE Id = @id');
    res.json({ message: '❤️ Đã thả tim!' });
  } catch (err) {
    res.status(500).send('Lỗi cập nhật tim');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại port ${PORT}`));
