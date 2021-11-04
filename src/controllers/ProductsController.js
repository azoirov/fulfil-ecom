const carts = require("../models/CartModel");
const categories = require("../models/CategoryModel");
const products = require("../models/ProductModel");
const { v4 } = require("uuid");
const product_options = require("../models/ProductOptionModel");
const product_images = require("../models/ProductImageModel");
const comments = require("../models/CommentModel");
const { checkJWTToken } = require("../modules/jwt");
const CommentPOSTValidation = require("../validations/CommentPOSTValidation");
const comment_images = require("../models/CommentImageModel");
const path = require("path");
const comment_likes = require("../models/CommentLikeModel");
const comment_dislikes = require("../models/CommentDislikeModel");
const orders = require("../models/OrderModel");
const order_items = require("../models/OrderItemModel");
const OrderValidation = require("../validations/OrderValidation");

module.exports = class ProductsController {
    static async ProductsGET(req, res) {
        try {
            const { category_id } = req.params;
            let { c_page, p_page } = req.query;

            c_page = c_page || 1;
            p_page = p_page || 24;

            let category = await categories.findOne({
                category_id,
            });

            if (!category) throw new Error("Category not found");

            let productList = await products
                .find({
                    category_id,
                })
                .limit(p_page)
                .skip(p_page * (c_page - 1));

            let recProducts = await products.find({
                is_rec: true,
            });
            let bestSellers = await products.find({
                is_best: true,
            });

            let randomRec = [];

            while (randomRec.length < 13 && recProducts.length > 0) {
                let randomNumber = Math.round(
                    Math.random() * recProducts.length
                );
                let product = recProducts.pop(randomNumber);
                randomRec.push(product);
            }

            let randomBest = [];

            while (randomBest.length < 13 && bestSellers.length > 0) {
                let randomNumber = Math.round(
                    Math.random() * bestSellers.length
                );
                let product = bestSellers.pop(randomNumber);
                randomBest.push(product);
            }

            let categoryList = await categories.find();

            res.status(200).json({
                ok: true,
                products: productList,
                recProducts: randomRec,
                bestProducts: randomBest,
                categories: categoryList,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartAddPOST(req, res) {
        try {
            const { product_id } = req.params;

            let product = await products.findOne({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let cart = await carts.findOne({
                product_id,
                user_id: req.user.user_id,
            });

            if (cart) throw new Error("cart is already added");

            await carts.create({
                cart_id: v4(),
                count: 1,
                product_id,
                user_id: req.user.user_id,
            });

            res.status(201).json({
                ok: true,
                message: "Added",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartPlusPATCH(req, res) {
        try {
            const { product_id } = req.params;

            let product = await products.findOne({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let cart = await carts.findOne({
                product_id,
                user_id: req.user.user_id,
            });

            if (!cart) throw new Error("Cart not found");

            await carts.findOneAndUpdate(
                { cart_id: cart.cart_id },
                {
                    count: cart.count + 1,
                }
            );

            res.status(200).json({
                ok: true,
                message: "Plus 1",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartMinusPATCH(req, res) {
        try {
            const { product_id } = req.params;

            let product = await products.findOne({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let cart = await carts.findOne({
                product_id,
                user_id: req.user.user_id,
            });

            if (!cart) throw new Error("Cart not found");

            if (cart.count == 1) {
                await carts.deleteOne({
                    cart_id: cart.cart_id,
                });
            } else {
                await carts.findOneAndUpdate(
                    { cart_id: cart.cart_id },
                    {
                        count: cart.count - 1,
                    }
                );
            }

            res.status(200).json({
                ok: true,
                message: "Minus 1",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsSearchGET(req, res) {
        try {
            const { q } = req.query;
            // let productList = await products.aggregate([
            //     {
            //         $match: {
            //             product_name: {
            //                 $search: q,
            //             },
            //         },
            //     },
            // ]);
            console.log(q);
            let productList = await products.aggregate().search({
                text: {
                    query: q,
                    path: "product_name",
                },
            });
            res.status(200).json({
                ok: true,
                products: productList,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CartGET(req, res) {
        try {
            let cart = await carts.find({
                user_id: req.user.user_id,
            });

            res.status(200).json({
                ok: true,
                cart,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductGET(req, res) {
        try {
            const { product_slug } = req.params;

            let product = await products.findOne({
                product_slug,
            });

            if (!product) throw new Error("Product not found");

            let productOptions = await product_options.find({
                product_id: product.product_id,
            });

            let productImages = await product_images.find({
                product_id: product.product_id,
            });

            let comment = await comments.find({
                product_id: product.product_id,
            });

            for (let c of comment) {
                let likes = await comment_likes.find({
                    comment_id: c.comment_id,
                });
                let dislikes = await comment_dislikes.find({
                    comment_id: c.comment_id,
                });
                if (likes) {
                    c._doc.likes = likes.length;
                }
                if (dislikes) {
                    c._doc.dislikes = dislikes.length;
                }
            }

            let token = req?.cookies?.token || req.headers["authorization"];

            token = checkJWTToken(token);

            if (token) {
                req.user = token;
            }

            let cart;

            if (req.user) {
                cart = await carts.findOne({
                    user_id: req.user.user_id,
                    product_id: product.product_id,
                });
            }

            res.status(200).json({
                ok: true,
                product,
                cart,
                comments: comment,
                productImages,
                productOptions,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentPOST(req, res) {
        try {
            const { product_id } = req.params;

            const { text, star } = await CommentPOSTValidation(req.body);

            let product = await products.findOne({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let comment = await comments.create({
                comment_id: v4(),
                text,
                star,
                user_id: req.user.user_id,
                product_id,
            });
            let files = req.files.image;
            if (files) {
                for (let file of files) {
                    let fileType = file.mimetype.split("/")[0];
                    let fileFormat = file.mimetype.split("/")[1];

                    if (fileType !== "image" && fileType !== "vector") {
                        throw new Error("File type is must be image or vector");
                    }

                    let fileName = `${file.md5}.${fileFormat}`;

                    let filePath = path.join(
                        __dirname,
                        "..",
                        "public",
                        "comment_images",
                        fileName
                    );

                    await file.mv(filePath);

                    let comment_image = await comment_images.create({
                        comment_id: comment._doc.comment_id,
                        image: fileName,
                        comment_image_id: v4(),
                    });
                }
            }

            let commentImages = await comment_images.find({
                comment_id: comment._doc.comment_id,
            });

            res.status(201).json({
                ok: true,
                message: "CREATED",
                comment,
                commentImages,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentLikePOST(req, res) {
        try {
            const { comment_id } = req.params;
            let comment = await comments.findOne({
                comment_id,
            });

            if (!comment) throw new Error("Comment not found");

            let like = await comment_likes.findOne({
                comment_id: comment.comment_id,
                user_id: req.user.user_id,
            });

            if (like) {
                await comment_likes.deleteOne({
                    user_id: req.user.user_id,
                    comment_id: comment.comment_id,
                });
            } else {
                await comment_dislikes.deleteOne({
                    comment_id: comment.comment_id,
                    user_id: req.user.user_id,
                });

                like = await comment_likes.create({
                    user_id: req.user.user_id,
                    comment_id: comment.comment_id,
                    like_id: v4(),
                });
            }

            res.status(201).json({
                ok: true,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentLikeDELETE(req, res) {
        try {
            const { comment_id } = req.params;
            let comment = await comments.findOne({
                comment_id,
            });

            if (!comment) throw new Error("Comment not found");

            await comment_likes.deleteOne({
                comment_id: comment.comment_id,
                user_id: req.user.user_id,
            });

            res.status(201).json({
                ok: true,
                message: "Like canceled",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentDisLikePOST(req, res) {
        try {
            const { comment_id } = req.params;
            let comment = await comments.findOne({
                comment_id,
            });

            if (!comment) throw new Error("Comment not found");

            let dislike = await comment_likes.findOne({
                comment_id: comment.comment_id,
                user_id: req.user.user_id,
            });

            if (dislike) {
                await comment_dislikes.deleteOne({
                    user_id: req.user.user_id,
                    comment_id: comment.comment_id,
                });
            } else {
                await comment_likes.deleteOne({
                    comment_id: comment.comment_id,
                    user_id: req.user.user_id,
                });

                dislike = await comment_dislikes.create({
                    user_id: req.user.user_id,
                    comment_id: comment.comment_id,
                    dislike_id: v4(),
                });
            }

            res.status(201).json({
                ok: true,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CommentDisLikeDELETE(req, res) {
        try {
            const { comment_id } = req.params;
            let comment = await comments.findOne({
                comment_id,
            });

            if (!comment) throw new Error("Comment not found");

            await comment_dislikes.deleteOne({
                comment_id: comment.comment_id,
                user_id: req.user.user_id,
            });

            res.status(201).json({
                ok: true,
                message: "DisLike canceled",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async OrderPOST(req, res) {
        try {
            const {
                full_name,
                shipping_region,
                shipping_address,
                comment,
                phone,
            } = await OrderValidation(req.body);

            let cart = await carts.find({
                user_id: req.user.user_id,
            });
            if (!cart) throw new Error("Cart is empty");
            let order = await orders.create({
                order_id: v4(),
                user_id: req.user.user_id,
                time: new Date(),
                full_name,
                shipping_address,
                shipping_region,
                comment,
                phone,
            });

            for (let c of cart) {
                let orderItem = await order_items.create({
                    count: c.count,
                    product_id: c.product_id,
                    order_item_id: v4(),
                    order_id: order._doc.order_id,
                });
            }
            await carts.deleteMany({
                user_id: req.user.user_id,
            });
            let orderItems = await order_items.find({
                order_id: order._doc.order_id,
            });

            res.status(201).json({
                ok: true,
                order,
                orderItems,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async OrderPATCH(req, res) {
        try {
            const { order_id } = req.params;
            const { status } = req.body;

            if (!status) throw new Error("Status required");

            let order = await orders.findOne({
                order_id,
            });
            if (!order) throw new Error("Order not found");

            await orders.findOneAndUpdate(
                {
                    order_id,
                },
                {
                    status,
                }
            );

            res.status(200).json({
                ok: true,
                message: "Updated to status " + status,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }
};
