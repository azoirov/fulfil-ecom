const categories = require("../models/CategoryModel");
const users = require("../models/UserModel");
const CategoryValidation = require("../validations/CategoryValidation");
const { v4 } = require("uuid");

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
};
