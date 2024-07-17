const express = require("express");
const app = express();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require("firebase-admin");
const path = require("path");

var serviceAccount = require("./tanujakey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://application-75c5e.firebaseio.com" // Corrected Firebase URL
});

const db = getFirestore();

app.use(express.static("public"));

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/homename", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homename.html"));
});

app.get("/signupSubmit", (req, res) => {
  db.collection('currency').add({
    Firstname: req.query.Firstname,
    Lastname: req.query.Lastname,
    Email: req.query.Email,
    Password: req.query.Password,
    ConfirmPassword: req.query.ConfirmPassword
  }).then(() => {
    res.send("Signup successfully");
  }).catch((error) => {
    res.send("Error during signup: " + error.message);
  });
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/logingIn", (req, res) => {
  db.collection('currency')
    .where("Email", "==", req.query.Email)
    .where("Password", "==", req.query.Password)
    .get()
    .then((data) => {
      if (data.empty) {
        res.send("Login not successful");
      } else {
        res.redirect("/homename");
      }
    })
    .catch((error) => {
      res.send("Error during login: " + error.message);
    });
});

app.listen(5000, () => {
  console.log('Your port 5000 is connected');
});
