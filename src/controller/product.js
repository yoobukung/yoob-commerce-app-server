const Product = require("../models/Product");
const User = require("../models/User");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const Category = require("../models/Category");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.getProduct = async (req, res, next) => {
  const { page, pageSize, categoryId } = req.query;
  let offset;
  let condition;
  if (page == 0) offset = 0;
  else offset = page * pageSize;
  if (categoryId !== null || undefined) condition = { where: { categoryId } };
  else condition = { where: {} };

  try {
    const all = await Product.findAll({ condition });
    const data = await Product.findAll({
      condition,
      limit: pageSize,
      offset,
    });

    res.status(200).json({ data, all });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "สินค้าหมดแล้ว" });
  }
};

exports.getProductByName = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const data = await Product.findOne({ where: { slug } });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "ไม่พบสินค้า" });
  }
};

exports.addProduct = async (req, res, next) => {
  const { name, price, image, description, quantity, categoryId } = req.body;

  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];
  const slug = name.toLowerCase();

  const params = {
    Bucket: "yooboostoredata",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Upload to s3 failed" });
    }
    console.log("AWS UPLOAD RES DATA", data);

    // save to db
    try {
      const response = await Product.create({
        name,
        price,
        imageUrl: data.Location,
        imageKey: data.Key,
        description,
        quantity,
        userId: req.user.id,
        slug,
        categoryId,
      });
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "ไม่สามารถเพิ่มสินค้าได้กรุณาติดต่อผ้ดูแล" });
    }
  });
};

exports.editProduct = async (req, res, next) => {
  const { name, price, image, description, quantity, categoryId } = req.body;
  const { id } = req.params;
  const slug = name.toLowerCase();

  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];

  // delete Image
  const product = await Product.findOne({ where: { id: id } });

  if (image) {
    const deleteParams = {
      Bucket: "yooboostoredata",
      Key: `${product.imageKey}`,
    };

    s3.deleteObject(deleteParams, function (err, data) {
      if (err) console.log("S3 DELETE ERROR DUING UPDATE", err);
      else console.log("S3 DELETED DURING UPDATE", data);
    });

    // Update / upload

    const params = {
      Bucket: "yooboostoredata",
      Key: `category/${uuidv4()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Upload to s3 failed" });
      }
      console.log("AWS UPLOAD RES DATA", data);

      // save to db
      try {
        const response = await Product.update(
          {
            imageUrl: data.Location,
            imageKey: data.Key,
          },
          {
            where: {
              [Op.and]: [{ userId: req.user.id }, { id }],
            },
          }
        );
        res.status(201).json(response);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "ไม่สามารถเพิ่มสินค้าได้กรุณาติดต่อผ้ดูแล" });
      }
    });
  }

  try {
    const data = await Product.update(
      {
        name,
        price,
        description,
        quantity,
        slug,
        categoryId,
      },
      {
        where: {
          [Op.and]: [{ userId: req.user.id }, { id }],
        },
      }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.removeProduct = async (req, res, next) => {
  const { id } = req.params;
  // delete Image
  const product = await Product.findOne({ where: { id: id } });

  const deleteParams = {
    Bucket: "yooboostoredata",
    Key: `${product.imageKey}`,
  };

  s3.deleteObject(deleteParams, function (err, data) {
    if (err) console.log("S3 DELETE ERROR DUING UPDATE", err);
    else console.log("S3 DELETED DURING UPDATE", data);
  });

  try {
    const data = await Product.destroy({
      where: {
        [Op.and]: [{ userId: req.user.id }, { id }],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductForSeller = async (req, res, next) => {
  try {
    const data = await Category.findAll({
      include: [
        {
          model: Product,
          required: true,
          where: {
            userId: req.user.id,
          },
        },
      ],
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "สินค้าไม่มี" });
  }
};

exports.getProductForSellerByName = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Product.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { id }],
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProductForSellerById = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const data = await Product.findOne({
      where: {
        [Op.and]: [{ userId: req.user.id }, { id: productId }],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
