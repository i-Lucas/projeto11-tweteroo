import express from "express";
import cors from "cors";

const app = express();
app.use(cors(), express.json());

let tweets = [];
let users = [];

app.post("/sign-up", (req, res) => {

    const { username, avatar } = req.body;

    if (!username || !avatar) {
        res.status(400).send("All fields are required !");
        return;
    }

    users.push({ username, avatar });
    res.status(200).send("User registered successfully!");
});

app.post("/tweets", (req, res) => {

    const { user: username } = req.headers;
    const { tweet } = req.body;

    if (!username || !tweet) {
        res.status(400).send("All fields are required !");
        return;
    }

    const avatar = users.find(user => user.username === username).avatar;
    tweets.push({ tweet, username, avatar });
    res.sendStatus(201);
});

app.get("/tweets", (req, res) => {

    const page = req.query.page;
    if (!page || parseInt(page) < 1) {
        res.status(400).send("Please enter a valid page!");
    }

    const maximum = 10;
    const start = (page - 1) * maximum;
    const end = page * maximum;

    const userTweets = [...tweets].reverse().slice(start, end);
    res.status(200).send(userTweets);
});

app.get("/tweets/:username", (req, res) => {

    const { username } = req.params;
    const userTweets = tweets.filter(tweet => tweet.username === username);
    res.send(userTweets);
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})