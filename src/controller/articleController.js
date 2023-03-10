const { getAllArticles, getTheArticle, createArticle, upadateMyArticle, deleteMyArticle } = require("../repositories/index")
const jwt = require("jsonwebtoken")
const { jwtConfig } = require("../config/config")

//perPage했던 기능
const getArticles = async (req, res) => {
    const { page } = req.query
    const perPage = 10
    const startIndex = ((page || 1) - 1) * perPage //0111참조

    // connection.query(`select count(*) from users`, (error, rows, fields) => {
    //     const lastPage = Math.ceil(rows[0].count / perPage)

    //     connection.query(`select * from users order by id desc limit ${perPage} offset ${startIndex}`, (error, rows, fields) => {
    //         res.json({
    //             pageInfo: {
    //                 perPage,
    //                 lastPage,
    //                 currentPage: page || 1
    //             },
    //             rows
    //         });
    //     })
    // })


    const [lastPage, articles] = await getAllArticles(perPage, startIndex)

    res.json({ pageInfo: { perPage, lastPage, currentPage: page || 1 }, articles })

}//lastPage 기억안남

//특정게시글 상세열람
const getArticle = async (req, res) => {
    const { id } = req.params

    const article = await getTheArticle(id)
    if (!article) {
        return res.status(404).json({ message: "해당 글이 없습니다" })
    }
    res.json(article)
}

//게시글 등록
const postArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.json({ message: "for members only" });
    }
    const { id } = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)
    const { title, contents } = req.body
    await createArticle(id, title, contents)
    res.status(201).json({ message: "article is on air" })
}



//게시글 수정기능
const putArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "for members only" })
    }
    const { id } = req.params
    const article = await getTheArticle(id)
    if(!article) {
        return res.status(401).json({message: "작성자 본인만 수정할 수 있습니다"})
      }
    // const { title, contents } = req.body
    const contents = req.body.contents || article.contents
    const title = req.body.title || article.title
    await upadateMyArticle(id, title, contents)
    res.json({ message: "수정이 완료되었습니다" })
}


//게시글 삭제
const deleteArticle = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(401).json({ message: "로그인해주세요" })
    }
    const { id } = req.params
    // connection.query(`delete from articles where id = "${id}"`, (error, rows, fields) => { 
    // })

    const { id: user_id } = jwt.verify(req.cookies.jwt, jwtConfig.secretKey)
    const article = await getTheArticle(id)
    if (!article) {
        return res.status(404).json({ message: "해당 글이 없습니다"})
    }

    // const isIdCorrect = article.user_id === user_id

    // if (!isIdCorrect) {
    if (article.user_id !== user_id) {
        return res.status(401).json({ message: "작성자 본인만 삭제할 수 있습니다" })
    }
    await deleteMyArticle(article.id)
    res.json("삭제 완료")

}
// //게시글 상위 10개 가져오는 API,이제 안씀
// const tenRecentArticles = async(req, res) => {

//     const articles =  connection.query("select * from articles order by id desc")
//     const tenArticles = [articles]
//     res.send(tenArticles.splice(0, 10))
// };


module.exports = {getArticles,getArticle,postArticle,putArticle,deleteArticle}