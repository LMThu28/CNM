const express = require('express');
const port = 3000;
const app = express();
let courses = require('./data.model'); 
const {v4: uuid} = require("uuid");
const CLOUD_FRONT_URL = 'https://d3tdfsda4763yn.cloudfront.net/';
const tableName = 'Subject';
const multer = require('multer');
const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, '');
        },
    });
    function checkFileType(file, cb) {
        const fileTypes = /jpeg| jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
const minetype = fileTypes.test(file.mimetype);
if (extname && minetype) {
 return cb(null, true);
}
return cb("Error: Image Only");
    }
    // const upload = multer({
    //     storage,
    //     limits: { fileSize: 2000000 }, // 2MB
    //     fileFilter(req, file, cb) {
    //         checkFileType(file, cb);        
    //     },
    // });



// Cấu hình multer để upload file
const upload = multer({ dest: 'uploads/' });

// Xử lý yêu cầu POST để tải file lên
app.post('/', upload.single('image'), (req, res) => {
    const { name, courses_type, semester, department } = req.body; // Lấy dữ liệu từ body của yêu cầu
    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const filePath = `images/${Date.now()}.${fileExtension}`;

   

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
// app.post('/', ManagedUpload.single('image'),(req,res)=>{
//     const{}
// })
 // Cấu hình S3
 const s3 = new AWS.S3();
 const params = {
     Bucket: 'uploads3buckettoturial ',
     Key: filePath,
     Body: require('fs').createReadStream(file.path),
     ACL: 'public-read'
 };

 s3.upload(params, (error, data) => {
     if (error) {
         console.log('Lỗi: ', error);
         return res.send('Lỗi Server Nội Bộ');
     } else {
         const newItem = {
             TableName: tableName,
             Item: {
                 'name': name, // Tên môn học
                 'courses_type': courses_type, // Loại môn học
                 'semester': semester, // Học kỳ
                 'department': department, // Khoa
                 'image_url': `${CLOUD_FRONT_URL}${filePath}` // URL của hình ảnh từ CloudFront
             }
         };

         docClient.put(newItem, (err, data) => {
             if (err) {
                 console.log('Lỗi: ', err);
                 return res.send('Lỗi Server Nội Bộ');
             } else {
                 return res.redirect('/');
             }
         });
     }
 });
});

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
