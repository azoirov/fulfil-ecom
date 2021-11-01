const categories = require("../models/CategoryModel");
const products = require("../models/ProductModel");

module.exports = async (req, res) => {
    try {
        let categoriesList = await categories.find();

        let recProducts = await products.find({
            is_rec: true,
        });
        let bestSellers = await products.find({
            is_best: true,
        });

        console.log(recProducts, bestSellers);
        let randomRec = [];

        while (randomRec.length < 13 && recProducts.length > 0) {
            let randomNumber = Math.round(Math.random() * recProducts.length);
            let product = recProducts.pop(randomNumber);
            randomRec.push(product);
            console.log("randomRec", randomRec);
        }

        let randomBest = [];

        while (randomBest.length < 13 && bestSellers.length > 0) {
            let randomNumber = Math.round(Math.random() * bestSellers.length);
            let product = bestSellers.pop(randomNumber);
            randomBest.push(product);
            console.log("randomBest", randomBest);
        }

        res.status(200).json({
            ok: true,
            categories: categoriesList,
            recProducts: randomRec,
            bestSellers: randomBest,
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: e + "",
        });
    }
};
