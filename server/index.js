const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const secretKey = "ASDKASLK";
const app = express();
const PORT = 3001;

const Register = require("./model/register")

mongoose.connect("mongodb+srv://francesdonz23:password1234@auth.34tuwf2.mongodb.net/", {

  useNewUrlParser: true,

})

app.use(
  cors({
    origin: ["https://chat-apps-nine.vercel.app"], // Update with your frontend URL
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/Register", async (req, res) => {
  const full_name = req.body.full_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  try {
    const Reg = new Register({
      full_name: full_name,
      email_address: email_address,
      password: password,
    });

    await Reg.save();
    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/LoginUser", async (req, res) => {
  const email_address = req.body.email_address;

  try {
    const existingUser = await Register.findOne({ email_address });

    if (existingUser) {
      const userId = existingUser._id;
      const token = jwt.sign({ userId }, secretKey, { expiresIn: "1d" });

      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: "Unauthorized" });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.json({ message: "Token is not valid" });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

app.get("/api/LoggedIn", verifyUser, (req, res) => {
  return res.json({ Message: "Authorized" });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
