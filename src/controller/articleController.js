const {getAllArticles, getAticle, createArticle,upadateMyArticle,deleteMyArticle} = require("../repositories/index")
const jwt = require("jsonwebtoken")
const {jwtConfig} = require("../config/config")



//perPage했던 기능
const getArticles = async (req, res) => {
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
}//lastPage 기억안남

//특정게시글 상세열람
const getTheArticle = async (req,res) => {
    const {id} = req.params
  
    const article = await getAticle(id)
    if(!article) {
      return res.status(404).json({message: "해당하는 글이 없습니다"})
    }
    res.json(article)
  }

//게시글 등록
const postArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" });
    }
    const { title, contents } = req.body
    connection.query(`insert into bongjin_articles_1 (title, contents) values("${title}", "${contents}");`, () => {

        res.json({ message: "article is on air" })
    })
};



//게시글 수정기능
const putArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "for members only" })
    }
    const { id } = req.params
    const { title, contents } = req.body
    connection.query(`update bongjin_articles_1 set title = "${title}" , contents = "${contents}" where id = ${id}`, (error, rows, fields) => {
        res.json({ message: "수정 완료" })
    })
};


//게시글 삭제
const deleteArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "로그인해주세요" })
    }
    const { id } = req.params
    connection.query(`delete from bongjin_articles_1 where id = "${id}"`, (error, rows, fields) => {
        res.json("삭제 완료")
    })
};
// //게시글 상위 10개 가져오는 API,이제 안씀
// const tenRecentArticles = async(req, res) => {

//     const articles =  connection.query("select * from articles order by id desc")
//     const tenArticles = [articles]
//     res.send(tenArticles.splice(0, 10))
// };


module.exports = {
    getArticles,
    getTheArticle,
    postArticle,
    putArticle,
    deleteArticle
  }