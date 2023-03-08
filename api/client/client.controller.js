import Product from "../models/product/product.js";
import ProductStat from "../models/product/productStat.js";
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
