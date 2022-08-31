const express = require("express");
const fs = require("fs");
const moment = require("moment");
const slugify = require("slugify");
const categoriesArray = require("../categories.json");

const app = express();

const { body, validationResult } = require("express-validator");
const {
    checkIfArticleExists,
    checkIfArticleAlreadyExist,
} = require("../middlewares/articles");

app.get("/", (req, res) => {
    fs.readFile("./articles.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const stringifiedData = data.toString();
            const realData = JSON.parse(stringifiedData);
            console.log(realData);

            res.json(realData);
        }
    });
});

app.get("/:slug", checkIfArticleExists, (req, res) => {
    res.json(req.article);
});

app.post(
    "/",
    checkIfArticleAlreadyExist,
    body("title")
        .isLength({ min: 4 })
        .withMessage("Invalid Title (4 digit minimum)"),
    body("author").isLength({ min: 2 }).withMessage("Invalid Author"),
    body("category")
        .isIn(categoriesArray.map((category) => category.slug))
        .withMessage("Invalid Category"),
    body("description")
        .isLength({ min: 10 })
        .withMessage("Invalid Description"),
    (req, res) => {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.status(400).json(errors);
        } else {
            const article = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                category: req.body.category,
                date: moment().format(),
                slug: slugify(req.body.title, {
                    replacement: "-",
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                }),
            };

            fs.readFile("./articles.json", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const articles = JSON.parse(data.toString());
                    articles.push(article);

                    fs.writeFile(
                        "./articles.json",
                        JSON.stringify(articles),
                        (err) => {
                            console.log(err);
                        }
                    );
                    res.status(201).json(article);
                }
            });
        }
    }
);

app.delete("/:slug", checkIfArticleExists, (req, res) => {
    const clonedArticles = req.articles;
    clonedArticles.splice(req.articleID, 1);

    fs.writeFile("./articles.json", JSON.stringify(clonedArticles), (err) => {
        console.log(err);
        res.json("Article deleted");
    });
});

module.exports = app;
