// express 사용하기
const express = require("express");
const cors = require("cors");
const app = express();
// heroku에서 지정하는게 있으면 그 포트 번호를 사용하고 없으면 8080 사용하도록 설정
const port = process.env.PORT || 8080;
// const port = 8080;
const models = require('./models');

app.use(cors());
// 해당 이미지 파일을 화면에 보여줄때 입력한 경로대로 보여주기 위해 세팅 (이걸 해줘야 화면에서 이미지 미리보기를 할 수 있음)
app.use("/upload", express.static("upload"));

// 업로드 이미지를 관리하는 스토리지 서버로 multer 사용
const multer = require('multer');
// 이미지 파일이 업로드 되면 어디에 어떻게 저장할건지 지정함
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cd) {
            // 어디에 저장할건지 지정
            cd(null, 'upload/');
        },
        filename: function(req, file, cd){
            // 어떤 이름으로 저장할건지 지정
            // 파일에 있는 원본 이름으로 저장함
            cd(null, file.originalname);
        }
    })
});

// json 형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(express.json());
// 브라우저의 CORS 이슈를 막기 위해 사용하는 코드
app.use(cors());

// get 방식 응답 지정 (if문으로 적을 필요없이 바로 method방식 적어주면 됨)
app.get('/products', async (req, res)=>{
    // get 방식 쿼리 데이터 전송
    // const queryString = req.query;
    // console.log(queryString);
    // console.log(queryString.id);
    // res.send({데이터 직접 넣기});

    // sequelize 사용하여 데이터베이스 조회하기
    // findAll: 전체 항목 조회
    // findOne: 하나만 조회
    // 조건을 지정할 수 있음
    // limit: 항목 갯수 지정
    // order: 정렬 변경
    // attributes: 원하는 컬럼만 선택
    models.Product.findAll({
        limit: 8,
        order: [
            ["createdAt", "DESC"]
        ],
        attributes: [
            "id",
            "name",
            "price",
            "seller",
            "createdAt",
            "imageUrl"
        ]
    })
    .then((result) => {
        res.send({
            product: result
        })
    })
    .catch((error) => {
        console.error(error);
        res.send("데이터를 가져오지 못했습니다.");
    })
});

// post 방식 응답 지정
app.post('/products', async(req, res)=>{
    const body = req.body;
    // console.log(body);
    const { name, description, price, seller, imageUrl } = body;
    // Product 테이블에 데이터를 삽입하기
    // models.테이블이름.create({})
    models.Product.create({
        // 변수명과 이름이 똑같으면 한번만 적어주면 됨
        name,
        description,
        price,
        seller,
        imageUrl
    }).then((result)=>{
        console.log("상품 생성 결과 : ", result);
        res.send({
            result,
        })
    })
    .catch((error)=>{
        console.log(error);
        res.send("상품 업로드에 문제가 발생했습니다.");
    })
    // res.send('상품이 잘 등록되었습니다.');
})

// get 방식 경로 파라미터 관리하기
app.get('/products/:id', async(req, res) => {
    const params = req.params;
    console.log(params);
    // res.send('파라미터 관리하기');
    // select 할때 하나만 찾을때는 findOne 사용
    models.Product.findOne({
        // 조건절
        where: {
            id: params.id
        }
    })
    .then((result) => {
        res.send({
            product: result,
        })
    })
    .catch((error) => {
        console.error(error);
        res.send('상품 조회에 문제가 생겼습니다.');
    })
})

// 이미지 파일을 post로 요청했을때 upload 폴더에 이미지 저장하기
app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: file.destination + file.filename
    })
})

// delete 삭제하기
app.delete('/products/:id', async(req, res) => {
    const params = req.params;
    console.log('삭제');
    models.Product.destroy({ where: { id: params.id } })
    .then( res.send(
        "상품이 삭제 되었습니다."
    ));
})

// banners로 요청이 왔을때 응답하기
app.get('/banners', (req, res) => {
    models.Banner.findAll({
        limit: 3,
        attributes: ["id", "imageUrl", "href"]
    })
    .then((result) => {
        res.send({
            banners: result,
        })
    })
    .catch((error) => {
        console.error(error);
        res.send("에러가 발생했습니다.");
    })
})

// 설정한 app을 실행 시키기
app.listen(port, ()=>{
    console.log('그린램프 서버가 돌아가고 있습니다.');
    models.sequelize
    // 데이터베이스와 동기화(sqlite와 연결) 시킴
    .sync()
    .then(()=>{
        console.log('DB 연결 성공');
    })
    .catch(function(err){
        console.error(err);
        console.log('DB 연결 에러');
        process.exit();
    })
})