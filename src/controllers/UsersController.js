const users = require("../models/UserModel");
const { generateHash } = require("../modules/bcrypt");
const { v4 } = require("uuid");
const { generateJWTToken } = require("../modules/jwt");
const sendEmail = require("../modules/email");

module.exports = class UserController {
    static async SignUpController(req, res) {
        try {
            const { full_name, email, username, password } = await req.body;

            let user = await users.findOne({
                email,
                username,
            });

            if (user) {
                throw new Error("User has already registered");
            }

            let pass = await generateHash(password);

            user = await users.create({
                user_id: v4(),
                full_name,
                username,
                email,
                pass,
            });

            let token = generateJWTToken({
                username,
                email,
                full_name,
            });

            let verificationEmail = await sendEmail(
                email,
                `Verification Link`,
                null,
                `<p><a href="https://localhost:${PORT}/verify/${user._doc.user_id}">Click here</a> to activate your account</p>`
            );

            res.cookie("token", token).status(201).json({
                ok: true,
                message: "REGISTERED",
                user: user._doc,
                token,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: String(e),
            });
        }
    }
};
