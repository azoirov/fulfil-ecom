const HomeController = require("../controllers/HomeController");
const {
    ProductsGET,
    CartAddPOST,
    CartPlusPATCH,
    CartMinusPATCH,
    ProductsSearchGET,
    CartGET,
    ProductGET,
    CommentPOST,
    CommentLikePOST,
    CommentDisLikePOST,
    CommentLikeDELETE,
    CommentDisLikeDELETE,
    OrderPOST,
} = require("../controllers/ProductsController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const router = require("express").Router();

router.get("/", HomeController);
router.get("/products/search", ProductsSearchGET);
router.get("/products/:category_id", ProductsGET);
router.get("/cart", AuthMiddleware, CartGET);
router.get("/product/:product_slug", ProductGET);

router.post("/products/cart/:product_id", AuthMiddleware, CartAddPOST);
router.post("/product/comment/:product_id", AuthMiddleware, CommentPOST);
router.patch("/products/cart/plus/:product_id", AuthMiddleware, CartPlusPATCH);
router.patch(
    "/products/cart/minus/:product_id",
    AuthMiddleware,
    CartMinusPATCH
);

router.post("/comment/like/:comment_id", AuthMiddleware, CommentLikePOST);
router.post("/comment/dislike/:comment_id", AuthMiddleware, CommentDisLikePOST);
router.delete("/comment/like/:comment_id", AuthMiddleware, CommentLikeDELETE);
router.delete(
    "/comment/dislike/:comment_id",
    AuthMiddleware,
    CommentDisLikeDELETE
);

router.post("/order", AuthMiddleware, OrderPOST);

module.exports = {
    path: "/",
    router,
};
