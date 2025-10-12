const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'upload/images')),
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

mongoose.connect("mongodb+srv://nishmithashetty:greatstackdev@cluster0.eqor1gu.mongodb.net/")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: "No file uploaded" });
  res.json({ success: 1, image_url: `http://localhost:${port}/images/${req.file.filename}` });
});

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

const Users = mongoose.model('Users', {
  name: { type: String },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ errors: "Please authenticate using valid token" });
  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ errors: "Please authenticate using a valid token" });
  }
};

app.post('/signup', async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.username || !req.body.password)
      return res.status(400).json({ success: false, errors: "Missing required fields" });
    const email = req.body.email.trim().toLowerCase();
    const existingUser = await Users.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, errors: "existing user found with same email address" });

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: req.body.username,
      email,
      password: req.body.password,
      cartData: cart
    });

    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.post('/login', async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      return res.status(400).json({ success: false, errors: "Missing email or password" });

    const user = await Users.findOne({ email: req.body.email.trim().toLowerCase() });
    if (!user) return res.json({ success: false, errors: "Wrong Email Id" });

    const passCompare = req.body.password === user.password;
    if (!passCompare) return res.json({ success: false, errors: "Wrong Password" });

    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch {
    res.status(500).json({ success: false });
  }
});

app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("addtocart hit");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    let userData = await Users.findOne({_id:req.user.id});
userData.cartData[req.body.itemId] += 1;
await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData})
res.send("Added")
    if (!req.user) return res.status(401).json({ success: false, errors: "User not authenticated" });

    const { itemId } = req.body;
    const userId = req.user.id;
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
    await user.save();

    console.log("Item added to cart:", itemId);
    res.json({ success: true, message: `Item ${itemId} added to cart` });
});

app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if (userData.cartData[req.body.itemId]>0)
userData.cartData[req.body.itemId] -= 1;
await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
res.send("Removed")
})

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });
    res.json(user.cartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


app.get('/newcollections', async (req, res)=> {
let products = await Product.find({});
let newcollection = products.slice(1).slice(-8);
console.log("NewCollection Fetched");
res.send(newcollection);
})

app.get('/popularinwomen', async (req, res) => {
let products = await Product.find({category: "women"});
let popular_in_women = products.slice(0,4);
console.log("Popular in women fetched");
res.send(popular_in_women);
})

app.listen(port, () => 
    console.log("Server Running on Port " + port));

