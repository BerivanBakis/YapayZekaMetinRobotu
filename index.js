// Berivan Bakış 16.05.2024
const express = require("express");
const cors = require('cors');
const app = express();
const { runChat } = require('./chat');
app.set("view engine", "ejs");
app.use(express.static('public'));
const { getTopics, addTopics, getChatTopic } = require('./db/topics');

app.get("/sendChatMessage", async (req, res) => {
    const message = req.query.message;
    var result = await runChat(message, 0);
    res.json({"chatMessage": result});
});

app.get("/chatTopic", async (req, res) => {
    try {
        var chatTopic = await getChatTopic(req.query);
        chatTopic = await runChat(chatTopic, 1);
        res.json({"chatTopic": chatTopic});
    } catch (e) {
        console.error("Hata oluştu:", error);
    }
});

app.use("/", function(req, res){
    res.render("index");
})

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})