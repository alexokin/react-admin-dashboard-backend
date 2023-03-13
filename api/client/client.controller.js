import getCountryIso3 from "country-iso-2-to-3";
import { generateSort } from "../../services/utils.service.js";
import Product from "../models/product/product.js";
import ProductStat from "../models/product/productStat.js";
import Transaction from "../models/transaction/transaction.js";
import User from "../models/user/user.js";

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );
    res.send(productsWithStats);
  } catch (err) {
    res.status(500).send({ err: "Failed to get products" });
  }
}

export async function getCustomers(req, res) {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.send(customers);
  } catch (err) {
    res.status(500).send({ err: "Failed to get customers" });
  }
}

export async function getTransactions(req, res) {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    const sortFormatted = Boolean(sort) ? generateSort(sort) : {};
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (err) {
    res.status(500).send({ err: "Failed to get transactions" });
  }
}

export async function getGeography(req, res) {
  try {
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocation = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocation);
  } catch (error) {
    res.status(500).send({ err: "Failed to get geography" });
  }
}
