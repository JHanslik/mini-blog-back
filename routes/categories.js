const express = require("express");
const fs = require("fs");
const slugify = require("slugify");
const articlesArray = require("../articles.json");

const app = express();

const { body, validationResult } = require("express-validator");
const {
    checkIfCategoryExists,
    checksforCategoryList,
    checkIfCategoryAlreadyExist,
} = require("../middlewares/categories");

app.get("/", (req, res) => {
    fs.readFile("./categories.json", (err, data) => {
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

app.get("/:slug", checksforCategoryList, (req, res) => {
    res.json(req.articles);
});

app.post(
    "/",
    checkIfCategoryAlreadyExist,
    body("name")
        .isLength({ min: 2 })
        .withMessage("Invalid Name (2 digit minimum)"),
    body("description").exists().withMessage("Invalid Description"),
    (req, res) => {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.status(400).json(errors);
        } else {
            const category = {
                name: req.body.name,
                description: req.body.description,
                slug: slugify(req.body.name, {
                    replacement: "-",
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                }),
            };

            fs.readFile("./categories.json", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    const categories = JSON.parse(data.toString());
                    categories.push(category);

                    fs.writeFile(
                        "./categories.json",
                        JSON.stringify(categories),
                        (err) => {
                            console.log(err);
                        }
                    );
                    res.status(201).json(category);
                }
            });
        }
    }
);

app.delete("/:slug", checkIfCategoryExists, (req, res) => {
    const articlesInCategory = articlesArray.filter(
        (article) => article.category === req.category.slug
    );
    if (articlesInCategory.length > 0) {
        res.json("Category has articles, please delete them before.");
    } else {
        const clonedCategories = req.categories;
        clonedCategories.splice(req.categoryID, 1);

        fs.writeFile(
            "./categories.json",
            JSON.stringify(clonedCategories),
            (err) => {
                console.log(err);
                res.json("Category deleted");
            }
        );
    }
});

module.exports = app;
