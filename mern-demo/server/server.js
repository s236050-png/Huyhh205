const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI chưa được cấu hình');
}

app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend đang hoạt động!" });
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Mã sinh viên '${req.body.studentId}' đã tồn tại`
      });
    }

    res.status(400).json({ message: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID sinh viên không hợp lệ' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID sinh viên không hợp lệ' });
    }

    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    res.json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Kết nối MongoDB Atlas thành công!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Không thể kết nối MongoDB:', error.message);
    process.exitCode = 1;
  });