const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const port = 5000;
const articlesRoute = require("./routes/articles");
const categoriesRoute = require("./routes/categories");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/article", articlesRoute);
app.use("/category", categoriesRoute);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
