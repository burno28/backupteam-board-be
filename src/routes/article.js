

app.get('/articles', (req, res) => {
    const { page } = req.query;
    const perPage = 3;//제 테이블 20개 칼럼이라 임시로 3
    const startIndex = ((page || 1) - 1) * perPage; //0111참조

    connection.query(`select count(*) from bongjin_articles_1`, (error, rows, fields) => {
        const lastPage = Math.ceil(rows[0].count / perPage)

        connection.query(`select * from bongjin_articles_1 order by id desc limit ${perPage} offset ${startIndex}`, (error, rows, fields) => {
            res.json({
                pageInfo: {
                    perPage,
                    lastPage,
                    currentPage: page || 1
                },
                rows
            });
        })
    })
})

//게시글 등록
app.post("/articles", (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" });
    }
    const { title, contents } = req.body
    connection.query(`insert into bongjin_articles_1 (title, contents) values("${title}", "${contents}");`, () => {

        res.json({ message: "article is on air" })
    })
});



//게시글 수정기능
app.put('/articles/:id', (req, res) => {

    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "for members only" })
    }
    const { id } = req.params
    const { title, contents } = req.body

    connection.query(`update bongjin_articles_1 set title = "${title}" , contents = "${contents}" where id = ${id}`, (error, rows, fields) => {

        res.json({ message: "수정 완료" })
    })
});


//게시글 삭제, 주소에 넣을 걸 모르겠다
app.delete("/articles/:id", async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "로그인해주세요" })
    }
    const { id } = req.params
    connection.query(`delete from bongjin_articles_1 where id = "${id}"`, (error, rows, fields) => {
        res.json("삭제 완료")
    })
});
