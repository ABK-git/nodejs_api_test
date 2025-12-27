const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const server = http.createServer((request, response) => {
  https.get('https://yesno.wtf/api', (apiRes) => {
    let body = '';

    apiRes.on('data', chunk => {
      body += chunk;
    });

    apiRes.on('end', () => {
      try {
        const data = JSON.parse(body);
        const answer = data.answer; // "yes" or "no"

        let imagePath;
        if (answer === 'yes') {
          imagePath = path.join(__dirname, 'images', 'yes.jpg');
        } else {
          imagePath = path.join(__dirname, 'images', 'no.jpg');
        }

        // 画像を読み込んでレスポンス
        fs.readFile(imagePath, (err, image) => {
          if (err) {
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Image not found');
            return;
          }

          response.writeHead(200, {
            'Content-Type': 'image/jpeg'
          });
          response.end(image);
        });

      } catch (e) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('API response error');
      }
    });

  }).on('error', () => {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Failed to fetch API');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
