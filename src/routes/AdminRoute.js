const {
    UsersGET,
    CreateAdminPATCH,
    UserDELETE,
    CategoriesGET,
    CategoryPOST,
    CategoryPATCH,
} = require("../controllers/AdminController");
const AdminMiddleware = require("../middlewares/AdminMiddleware");

const router = require("express").Router();

/*
    users - GET
    user - DELETE

    categories GET
    products GET

    category POST DELETE PATCH GET
    product POST DELETE PATCH GET
*/

router.get("/users", AdminMiddleware, UsersGET);
router.patch("/users/make-admin/:user_id", AdminMiddleware, CreateAdminPATCH);
router.delete("/users/delete/:user_id", AdminMiddleware, UserDELETE);

router.get("/categories", AdminMiddleware, CategoriesGET);
router.post("/categories/create", AdminMiddleware, CategoryPOST);
router.patch("/categories/update/:category_id", AdminMiddleware, CategoryPATCH);

module.exports = {
    path: "/admin",
    router,
};
