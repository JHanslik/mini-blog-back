const fs = require("fs");

const checkIfArticleExists = (req, res, next) => {
    const { slug } = req.params;
    fs.readFile("./articles.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);

            const article = realData.find((article) => article.slug === slug);

            const articleID = realData.findIndex(
                (article) => article.slug === slug
            );

            if (article) {
                req.articles = realData;
                req.article = article;
                req.articleID = articleID;
                next();
            } else {
                res.status(404).json("Article not found");
            }
        }
    });
};

const checkIfArticleAlreadyExist = (req, res, next) => {
    const { slug } = req.params;
    fs.readFile("./articles.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);

            const article = realData.find(
                (article) => article.title === req.body.title
            );

            if (!article) {
                next();
            } else {
                res.status(404).json(
                    "Article's title already used, please change it."
                );
            }
        }
    });
};

module.exports = {
    checkIfArticleExists,
    checkIfArticleAlreadyExist,
};
