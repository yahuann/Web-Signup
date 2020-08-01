const express = require('express');
const https = require('https');
const bodyParser = require("body-parser")
const app = express();

const port = 3000;

// set up server to use static files(css images); use to relative path start will public
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.listen(port, function() {
  console.log('Server listening at http://localhost:3000; or ....' + port);
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var fName = req.body.fName;
  var lName = req.body.lName;
  var email = req.body.email;

  //with mailchimp API
  const apiKey = "placeholderApiKey";
  const listId = "placeholderListId";


  // const data = {
  //   members: [{
  //       email_address: "456"@qq.com",
  //       status: "subscribed",
  //       merge_fields: {
  //         FNAME: "first name",
  //         LNAME: "last name"
  //       }
  //     },
  //
  //     {
  //       email_address: "123@qq.com",
  //       status: "subscribed",
  //       merge_fields: {
  //         FNAME: "first name1",
  //         LNAME: "last name1"
  //       }
  //     }
  //
  //   ]
  // }
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }, ]
  }

  var jsonData = JSON.stringify(data);

  // const url = "https://us<palceholder>.api.mailchimp.com/3.0/lists/" + listId;
  const url = "https://us17.api.mailchimp.com/3.0/lists/" + listId;
  const option = {
    method: "POST",
    auth: "yahuan:" + apiKey
  }

  const request = https.request(url, option, function(response) {
    // response.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // })
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  });

  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res) {
  res.redirect("/");
});
