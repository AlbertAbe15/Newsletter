const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    // ADDRESS: {
                    //     "addr1" : "first line",
                    //     "addr2" : "second line",
                    //     "city" : "city",
                    //     "state": "state",
                    //     "zip": "zip code",
                    //     "country": "country"
                    // }
                }
            }
        ]
    }

    const dataJSON = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/f9e9f21d52"
    const options = {
        auth: "albertabe:cb786104fe4a7c9fa7fed8f66126770f-us5",
        method: "POST",
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", (data) => console.log(JSON.parse(data)))
    })

    request.write(dataJSON);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/"); //button must be in type="submit"
})

app.post("/success", function(req, res) {
    res.redirect("/"); //button must be in type="submit"
})

app.listen(3000 || process.env.PORT, () => console.log("Server is running on port 3000"))

//list id
//f9e9f21d52

//api key
//cb786104fe4a7c9fa7fed8f66126770f-us5