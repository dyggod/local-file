var express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { getReadableFileSizeString } = require('../utils/common');

var router = express.Router();

const uploadFolder = path.join(__dirname, '../public/uploads/');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 上传文件
router.post('/upload', multer({ dest: 'public/uploads/' }).single('file'), function(req, res, next) {
  const file = req.file;
  console.log('file: ', file);
  const filePath = file.path;
  let fileName = file.originalname;
  // 如果有同名文件，那么在文件名后面加上(),()内为数字，从1开始，直到没有同名文件
  const existFiles = fs.readdirSync(uploadFolder);
  let i = 1;
  while (existFiles.includes(fileName)) {
    const index = fileName.lastIndexOf('.');
    const name = fileName.slice(0, index);
    const ext = fileName.slice(index);
    fileName = name + '(' + i + ')' + ext;
    i++;
  }
  console.log('fileName: ', fileName);
  // // 重命名文件
  fs.renameSync(filePath, uploadFolder + fileName);
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
  const files = fs.readdirSync(uploadFolder);
  // 遍历files，读取每个文件的大小、类型
  const data = files.map(file => {
    const stats = fs.statSync(uploadFolder + file);
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
  // 读取文件，返回文件流
  const filePath = path.join(__dirname, '../public' + fileUrl);
  let readStream = fs.createReadStream(filePath);
  res.set({
    'Content-Type': 'application/octet-stream',
  });
  // 设置文件名
  const fileName = fileUrl.slice(fileUrl.lastIndexOf('/') + 1);
  res.set('Content-Disposition', 'attachment; filename=' + fileName);
  // 读取文件流，返回给客户端
  readStream.pipe(res);
});



module.exports = router;
