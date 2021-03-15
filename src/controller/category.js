const Category = require("../models/Category");
const Product = require("../models/Product");
const { lookup } = require("geoip-lite");

exports.getCategory = async (req, res, next) => {
  try {
    const data = await Category.findAll({});
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const data = await Category.findOne({
      where: { id: categoryId },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductByCategory = async (req, res, next) => {
  const { categoryname } = req.params;
  const slug = categoryname.toLowerCase();
  try {
    const category = await Category.findOne({ where: { slug } });
    const data = await Product.findAll({ where: { categoryId: category.id } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.AddCategory = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(ip); // ip address of the user
  console.log(lookup(ip)); // location of the user
  const { name, description } = req.body;
  const slug = name.toLowerCase();

  try {
    const data = await Category.create({ name, description, slug });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.UpdateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  const slug = name.toLowerCase();

  try {
    const data = await Category.update(
      { name, description, slug },
      {
        where: {
          id: categoryId,
        },
      }
    );
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.removeCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const data = await Category.destroy({
      where: {
        id: categoryId,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
