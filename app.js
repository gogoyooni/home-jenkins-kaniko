const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.json({
    message: "안녕하세요! Jenkins 파이프라인 테스트 앱입니다.",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
