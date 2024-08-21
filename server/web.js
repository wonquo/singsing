const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//표준시간대 설정
//cors 설정
var cors = require("cors");
app.use(cors());

// 세션라이브러리를 통한 쿠기 설정
app.use(cookieParser());
app.use(
  session({
    secret: "dnsjrb505@",
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: "localhost",
      path: "/",
      maxAge: 24 * 6 * 60 * 10000,
      sameSite: "strict",
      httpOnly: true,
      secure: true,
    },
  })
);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "./build")));

// 미들웨어 설정
app.use(bodyParser.json());

// 라우트 설정(post 요청을 처리할 수 있는 라우트 설정)
//호출 url 디버깅을 위해 로그를 남김
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

console.log("app.js");
console.log(app.get("env"));

app.use("/api/users", require("./routes/usersRoutes")); //사용자 라우트
app.use("/api/business", require("./routes/businessRoutes")); //사업자 라우트
app.use("/api/login", require("./routes/loginRoutes")); //로그인 라우트
app.use("/api/vendor", require("./routes/vendorRoutes")); //거래처 라우트
app.use("/api/product", require("./routes/productRoutes")); //상품 라우트
app.use("/api/payment", require("./routes/paymentRoutes")); //결제 라우트
app.use("/api/sales", require("./routes/salesRoutes")); //판매 라우트
app.use("/api/excel", require("./routes/excelRoutes"));
app.use("/api/expense", require("./routes/expenseRoutes")); //경비 라우트
app.use("/api/commonCode", require("./routes/commonCodeRoutes")); //commonCode 라우트
app.use("/api/purchase", require("./routes/purchaseRoutes")); //purchase 라우트
app.use("/api/cmn", require("./routes/cmnRoutes")); //cmn 라우트
app.use("/api/todo", require("./routes/todoRoutes")); //todo 라우트

// 모든 요청에 대해 index.html 전송
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413 && "body" in err) {
    res.status(413).send("요청 엔터티가 너무 큽니다");
  } else {
    next();
  }
});

let server;
const PORT = process.env.PORT || 3000;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https
    .createServer(
      {
        key: fs.readFileSync(__dirname + `/` + "key.pem", "utf-8"),
        cert: fs.readFileSync(__dirname + `/` + "cert.pem", "utf-8"),
      },
      app
    )
    .listen(PORT);
  console.log(`Server is running on port ${PORT}`);
} else {
  server = app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
