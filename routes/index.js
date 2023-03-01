var express = require('express');
const multer = require('multer');
const fs = require('fs');
const { getReadableFileSizeString } = require('../utils/common');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 上传文件
router.post('/upload', multer({ dest: 'uploads/' }).single('file'), function(req, res, next) {
  const file = req.file;
  const filePath = file.path;
  const fileName = file.originalname;
  fs.renameSync(filePath, 'uploads/' + fileName);
  res.send({
    code: 0,
    msg: '上传成功',
    data: {
      file: {
        name: fileName,
        size: file.size,
        type: file.mimetype,
      }
    }
  });
});

// 获取文件列表
router.get('/file/list', function(req, res, next) {
  const files = fs.readdirSync('uploads/');
  // 遍历files，读取每个文件的大小、类型
  const data = files.map(file => {
    const stats = fs.statSync('uploads/' + file);
    console.log('stats: ', stats);
    return {
      name: file,
      size: getReadableFileSizeString(stats.size),
      url: '/uploads/' + file,
    }
  });

  console.log('files: ', files);
  res.send({
    code: 0,
    msg: '获取成功',
    data: {
      files: data,
    }
  });
});

// 文件下载
router.get('/file/download', function(req, res, next) {
  const fileUrl = req.query.url;
  const fileName = fileUrl.split('/').pop();
  res.download('uploads/' + fileName, fileName);
});



module.exports = router;
