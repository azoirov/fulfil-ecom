const {
    UsersGET,
    CreateAdminPATCH,
    UserDELETE,
    CategoriesGET,
    CategoryPOST,
    CategoryPATCH,
    CategoryDELETE,
    ProductsGET,
    ProductsPOST,
    ProductOptionPOST,
    ProductsFilterGET,
    ProductsDELETE,
    ProductsPATCH,
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
router.delete(
    "/categories/delete/:category_id",
    AdminMiddleware,
    CategoryDELETE
);

router.get("/products", AdminMiddleware, ProductsGET);
router.post("/products/create/:category_id", AdminMiddleware, ProductsPOST);
router.post(
    "/products/option/create/:product_id",
    AdminMiddleware,
    ProductOptionPOST
);
router.get("/products/filter", AdminMiddleware, ProductsFilterGET);
router.delete("/products/delete/:product_id", AdminMiddleware, ProductsDELETE);
router.patch("/products/update/:product_id", AdminMiddleware, ProductsPATCH);
module.exports = {
    path: "/admin",
    router,
};
