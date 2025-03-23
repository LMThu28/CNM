const express = require('express');
const port = 3000;
const app = express();
let courses = require('./data.model'); 

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views')); 

// Config view
app.set('view engine', 'ejs'); 
app.set('views', './views'); 

// Hiển thị danh sách môn học
app.get('/', (req, res) => {
    return res.render('index', { courses });
});

// Thêm môn học
app.post('/save', (req, res) => {
    const id = Number(req.body.id);
    const name = req.body.name;
    const courses_type = req.body.courses_type;
    const semester = req.body.semester;
    const department = req.body.department;

    if (!id || !name || !courses_type || !semester || !department) {
        return res.redirect('/'); 
    }

    courses.push({ id, name, courses_type, semester, department });
    return res.redirect('/');
});

// Xóa môn học
app.post('/delete', (req, res) => {
    const selectedIds = Object.keys(req.body).map(Number); // Lấy danh sách ID cần xóa

    if (selectedIds.length > 0) {
        courses = courses.filter(course => !selectedIds.includes(course.id)); // Cập nhật danh sách
    }

    return res.redirect('/'); // Load lại trang sau khi xóa
});


// Khởi chạy server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
