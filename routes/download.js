var express = require('express');
var multer = require('multer');
var upload = multer()
var router = express.Router();
var fs = require('fs');
var path = require('path');
var http=require("http");
var https=require("https");

var dirPath = path.join(__dirname, '../', "download", "ynyh");
fs.mkdirSync(dirPath, { recursive: true });

/* GET users listing. */
router.get('/document/:fileName', function(req, res, next) {
  res.setHeader('Content-Type', 'application/msword');
  let fileName = req.params.fileName;
  if(fileName.endsWith('.msword')){
    fileName = fileName.replace('.msword', '.doc');
  }
  const _path = path.join(__dirname, '..', 'public', fileName);
  res.set({
    'Content-Length': '123',
    ETag: '12345'
  })
  res.send(fs.readFileSync(_path));
});

router.get('/ynyh', function(req, res, next) {
  res.render('ynyh', { title: '一念永恒' });
});

router.post('/ynyh', upload.none(), async function(req, res, next) {
  const {body: {start, end}} = req;
  res.render('ynyh', { title: '一念永恒', msg: `${start}-${end} 集已经加入下载队列！` });
  for(let i=start;i<=end;i++){
    console.log(i);
    const u = `https://mp3.aikeu.com/23073/${i}.m4a`;
    let URL = await getUrl(u);
    URL = await getUrl(URL);
    const status = await download(URL, path.join(dirPath, `${i}.m4a`));
  }
});

const getUrl = function(url){
  const request = url.startsWith('https')?https:http;
  return new Promise(function(resolve, reject) {
    request.get(url,(res)=>{
      const _url = res.headers.location;
      console.log('location:', _url);
      if(_url){
        resolve(_url);
      }else{
        resolve();
      }
    });
  });
}

var download = function(url, dest) {
  var file = fs.createWriteStream(dest);
  const request = url.startsWith('https')?https:http;
  return new Promise(function(resolve, reject) {
    request.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        console.log(dest+'下载完成！');
        file.close(resolve(true));
      });
    }).on('error', function(err) {
      fs.unlink(dest);
      reject();
    });
  })
  
};

module.exports = router;
