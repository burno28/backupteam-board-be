const express = require("express")
const router = express.Router()

const {getArticles,getArticle,postArticle,putArticle,deleteArticle} = require("../controller/articleController")


router.get("/", getArticles)
//perPage했던 기능
router.get("/:id", getArticle)
//특정게시글 상세열람
router.post("/", postArticle)
//게시글 등록
router.put("/:id", putArticle)
//게시글 수정기능
router.delete("/:id", deleteArticle)
//게시글 삭제
module.exports = router