const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const CookieParser = require("cookie-parser");
const { PORT } = require("../config");

const app = express();

app.listen(PORT, () => console.log(`SERVER READY AT localhost://${PORT}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(morgan("tiny"));
app.use("/public", express.static(path.join(__dirname, "public")));

fs.readdir(path.join(__dirname, "routes"), (err, files) => {
    if (!err) {
        files.forEach((file) => {
            const routePath = path.join(__dirname, "routes", file);
            const Route = require(routePath);
            if (Route.path && Route.router)
                app.use(`/api/${Route.path}`, Route.router);
        });
    }
});
