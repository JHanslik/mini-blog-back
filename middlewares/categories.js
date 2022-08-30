const fs = require("fs");

const checkIfCategoryExists = (req, res, next) => {
    const { slug } = req.params;
    fs.readFile("./categories.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);

            const category = realData.find(
                (category) => category.slug === slug
            );

            const categoryID = realData.findIndex(
                (category) => category.slug === slug
            );

            if (category) {
                req.categories = realData;
                req.category = category;
                req.categoryID = categoryID;
                next();
            } else {
                res.status(404).json("Article not found");
            }
        }
    });
};

const checkIfCategoryAlreadyExist = (req, res, next) => {
    const { slug } = req.params;
    fs.readFile("./categories.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);

            const category = realData.find(
                (category) => category.name === req.body.name
            );

            if (!category) {
                next();
            } else {
                res.status(404).json("Category already exist");
            }
        }
    });
};

const checksforCategoryList = (req, res, next) => {
    const { slug } = req.params;
    fs.readFile("./categories.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);

            const category = realData.find(
                (category) => category.slug === slug
            );

            if (category) {
                fs.readFile("./articles.json", (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const stringifiedData = data.toString();
                        const realData = JSON.parse(stringifiedData);

                        const articles = realData.filter(
                            (article) => article.category === slug
                        );
                        console.log(articles);
                        if (articles.length > 0) {
                            req.articles = articles;
                            next();
                        } else {
                            res.status(404).json("Articles not found");
                        }
                    }
                });
            } else {
                res.status(404).json("Category not found");
            }
        }
    });
};

module.exports = {
    checkIfCategoryExists,
    checksforCategoryList,
    checkIfCategoryAlreadyExist,
};
