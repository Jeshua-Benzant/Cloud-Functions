const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();

// Get a reference to the Firebase Realtime Database
const db = admin.database();

// Generate a random number and update the "genRandNum" node in the RTDB
exports.generateRandomNumber = functions.https.onRequest((_req, res) => {
  const randomNumber = Math.floor(Math.random() * 100);

  // Update the "genRandNum" node in the RTDB
  db.ref("genRandNum").set(randomNumber)
      .then(() => {
        res.json({randomNumber});
      })
      .catch((error) => {
        res.status(500).json({error: `Error: ${error}`});
      });
});

// Square a number and update the "squaredNum" node in the RTDB
exports.squareNumber = functions.https.onRequest((_req, res) => {
  // Retrieve the generated random number from the "genRandNum" node in the RTDB
  db.ref("genRandNum").once("value")
      .then((snapshot) => {
        const number = snapshot.val();
        const squaredNumber = number * number;

        // Update the "squaredNum" node in the RTDB
        db.ref("squaredNum").set(squaredNumber)
            .then(() => {
              res.json({squaredNumber});
            })
            .catch((error) => {
              res.status(500).json({error: `Error: ${error}`});
            });
      })
      .catch((error) => {
        res.status(500).json({error: `Error: ${error}`});
      });
});

// List all even numbers stored in the RTDB and update the "evenObjList" node
exports.listEvenNumbers = functions.https.onRequest((_req, res) => {
  // Retrieve the squared number from the "squaredNum" node in the RTDB
  db.ref("squaredNum").once("value")
      .then((snapshot) => {
        const squaredNumber = snapshot.val();

        // Check if the squared number is even
        if (squaredNumber % 2 === 0) {
          // Update the "evenObjList" node in the RTDB with the object
          db.ref("evenObjList").set(true)
              .then(() => {
                res.send(true);
              })
              .catch((error) => {
                res.status(500).send(`Error: ${error}`);
              });
        } else {
          db.ref("evenObjList").set(false)
              .then(() => {
                res.send(false);
              })
              .catch((error) => {
                res.status(500).send(`Error: ${error}`);
              });
        }
      })
      .catch((error) => {
        res.status(500).send(`Error: ${error}`);
      });
});
