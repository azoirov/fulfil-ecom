const nodemailer = require("nodemailer");
const { EMAIL, PASS } = require("../../config");

async function email(to, subject, text, html) {
    try {
        const transport = await nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: EMAIL,
                pass: PASS,
            },
        });

        return await transport.sendMail({
            from: '"Fulfil Education" <asadbek@pixer.uz>',
            to,
            subject,
            text,
            html,
        });
    } catch (e) {
        console.log("email", e);
    }
}

module.exports = email;
