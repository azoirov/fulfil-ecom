const categories = require("../models/CategoryModel");
const users = require("../models/UserModel");
const CategoryValidation = require("../validations/CategoryValidation");
const { v4 } = require("uuid");
const products = require("../models/ProductModel");
const ProductPOSTValidation = require("../validations/ProductPOSTValidation");
const slugify = require("slugify");
const product_images = require("../models/ProductImageModel");
const path = require("path");
const ProductOptionValidation = require("../validations/ProductOptionValidation");
const product_options = require("../models/ProductOptionModel");
const ProductPatchValidation = require("../validations/ProductPatchValidation");
//aggregate
module.exports = class AdminController {
    static async UsersGET(req, res) {
        try {
            let customers = await users.find();

            res.status(200).json({
                ok: true,
                users: customers,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CreateAdminPATCH(req, res) {
        try {
            const { user_id } = req.params;
            let user = await users.findOneAndUpdate(
                {
                    user_id,
                },
                {
                    role: "admin",
                }
            );

            res.status(200).json({
                ok: true,
                message: "success",
                user,
            });
        } catch (e) {}
    }

    static async UserDELETE(req, res) {
        try {
            let user = await users.findOne({
                user_id: req.params.user_id,
            });
            if (!user) throw new Error("User not found");
            if (user.role === "superadmin") {
                res.status(403).json({
                    ok: false,
                    message: "Permissions denied",
                });
                return;
            }
            await users.deleteOne({
                user_id: req.params.user_id,
            });
            res.status(200).json({
                ok: true,
                message: "deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoriesGET(req, res) {
        try {
            let { c_page, p_page } = req.query;

            c_page = c_page || 1;
            p_page = p_page || 3;

            let categoryList = await categories
                .find()
                .skip(p_page * (c_page - 1))
                .limit(p_page);
            res.status(200).json({
                ok: true,
                categories: categoryList,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryPOST(req, res) {
        try {
            const { category_name } = await CategoryValidation(req.body);

            let category = await categories.findOne({
                category_name,
            });

            if (category) throw new Error("Category has already been added");

            category = await categories.create({
                category_id: v4(),
                category_name,
            });

            res.status(201).json({
                ok: true,
                message: "created",
                category: category,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryPATCH(req, res) {
        try {
            const { category_name } = await CategoryValidation(req.body);

            let category = await categories.findOne({
                category_id: req.params.category_id,
            });

            if (!category) throw new Error("Category not found");

            category = await categories.findOneAndUpdate(
                {
                    category_id: req.params.category_id,
                },
                {
                    category_name,
                }
            );

            res.status(201).json({
                ok: true,
                message: "updated",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async CategoryDELETE(req, res) {
        try {
            const { category_id } = req.params;

            let productItems = await products.find({
                category_id,
            });

            for (let product of productItems) {
                const { product_id } = product;
                await products.deleteOne({
                    product_id,
                });

                await product_options.deleteMany({
                    product_id,
                });

                await product_images.deleteMany({
                    product_id,
                });
            }

            await categories.deleteOne({
                category_id,
            });

            res.status(200).json({
                ok: true,
                message: "Deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsGET(req, res) {
        try {
            let { c_page, p_page } = req.query;

            c_page = c_page || 1;
            p_page = p_page || 10;
            let productItems = await products
                .find()
                .skip(p_page * (c_page - 1))
                .limit(p_page);

            res.status(200).json({
                ok: true,
                products: productItems,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsPOST(req, res) {
        try {
            const { category_id } = req.params;
            const { product_name, price, description } =
                await ProductPOSTValidation(req.body);
            let slug = slugify(product_name.toLowerCase());

            let product = await products.findOne({
                product_slug: slug,
                category_id,
            });

            if (product) {
                throw new Error(`Product slug ${slug} is already exsists`);
            }

            let category = await categories.findOne({
                category_id,
            });

            if (!category) throw new Error("Category not found");

            product = await products.create({
                product_id: v4(),
                product_name,
                product_slug: slug,
                category_id,
                description,
                price,
            });

            if (req.files.image.length) {
                let images = req.files.image;
                for (let image of images) {
                    let imageType = image.mimetype.split("/")[0];
                    if (imageType === "image" || imageType === "vector") {
                        let imageName = image.md5;
                        let imageFormat = image.mimetype.split("/")[1];
                        let imagePath = path.join(
                            __dirname,
                            "..",
                            "public",
                            "product_images",
                            `${imageName}.${imageFormat}`
                        );
                        await image.mv(imagePath);
                        let productImage = await product_images.create({
                            product_image_id: v4(),
                            image: `${imageName}.${imageFormat}`,
                            product_id: product._doc.product_id,
                        });
                    } else {
                        throw new Error("Image type must be vector or image");
                    }
                }
            }

            res.status(201).json({
                ok: true,
                message: "Product added",
                product,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductOptionPOST(req, res) {
        try {
            const { product_id } = req.params;
            const { key, value } = await ProductOptionValidation(req.body);

            let product = await products.find({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let option = await product_options.findOne({
                product_id,
                key: key,
            });

            if (option) throw new Error(`Option ${key} is already exists`);

            option = await product_options.create({
                product_id,
                key,
                value,
                product_option_id: v4(),
            });

            res.status(201).json({
                ok: true,
                option,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsFilterGET(req, res) {
        try {
            let { category_id, c_page, p_page } = req.query;

            c_page = c_page || 1;
            p_page = p_page || 10;

            let category = await categories.findOne({
                category_id,
            });

            if (!category) throw new Error("Category not found");

            let productItems = await products
                .find({
                    category_id,
                })
                .skip(p_page * (c_page - 1))
                .limit(p_page);

            res.status(200).json({
                ok: true,
                products: productItems,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsDELETE(req, res) {
        try {
            const { product_id } = req.params;

            await products.deleteOne({
                product_id,
            });

            await product_options.deleteMany({
                product_id,
            });

            await product_images.deleteMany({
                product_id,
            });

            res.status(200).json({
                ok: true,
                message: "Deleted",
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async ProductsPATCH(req, res) {
        try {
            const { product_id } = req.params;
            const { product_name, category_id, description, price } =
                await ProductPatchValidation(req.body);

            let product = await products.findOne({
                product_id,
            });

            if (!product) throw new Error("Product not found");

            let slug = slugify(product_name.toLowerCase());

            let productSlug = await products.findOne({
                slug,
                category_id,
            });

            if (productSlug && productSlug.product_id !== product.product_id) {
                throw new Error(`Product slug ${slug} is already existis`);
            }

            product = await products.findOneAndUpdate(
                {
                    product_id,
                },
                {
                    price,
                    description,
                    category_id,
                    product_name,
                    product_slug: slug,
                }
            );
            res.status(200).json({
                ok: true,
                message: "updated",
                product,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }
};
