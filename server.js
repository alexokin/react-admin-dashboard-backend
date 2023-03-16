import  express  from "express";
import  cors  from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan"
import generalRoutes from "./api/general/general.routes.js"
import managementRoutes from "./api/management/management.routes.js"
import clientRoutes from "./api/client/client.routes.js"
import salesRoutes from "./api/sales/sales.routes.js"

// Data Imports
// import User from "./api/models/user/user.js";
import  ProductStat  from "./api/models/product/productStat.js";
import  Product  from "./api/models/product/product.js";
import Transaction from "./api/models/transaction/transaction.js";
import { dataAffiliateStat ,dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat} from "./data/data.js"
import OverallStat from "./api/models/overallStat/overallStat.js";
import AffiliateStat from "./api/models/affiliateStat/affiliateStat.js";



// Config

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// Mongoose setup
const port = process.env.PORT || 3030;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server Port: ${port}`));
    // User.insertMany(dataUser)
    // Product.insertMany(dataProduct)
    // ProductStat.insertMany(dataProductStat)
    // Transaction.insertMany(dataTransaction)
    // OverallStat.insertMany(dataOverallStat)
    // AffiliateStat.insertMany(dataAffiliateStat)
  })
  .catch((error) => console.log(`${error} did not connect`));
