// Berivan Bakış 16.05.2024
const DBPool = require("./databaseMenager");
async function getTopics(query) {
    try {
        var filter = "";
        var data = "";
        data = await DBPool.query(`SELECT * FROM topics_table`);
        var totalLen = data.rowCount;
        return {
            result: true,
            message: "Konular Okundu!",
            dataList: data.rows,
            totalLen: parseInt(totalLen),
        };
    } catch (e) {
        console.log(e);
        return {
            result: false,
            message: "Bir Hata Oluştu! " + e,
            dataList: [],
            totalLen: 0
        };
    }
}
async function addTopics(topic, subtopic) {
    try {
        await DBPool.query(
            `INSERT INTO topics_table
            (topic, subtopic) 
            VALUES ($1, $2) RETURNING id`,
            [
                topic,
                subtopic,
            ]
        );
        return {
            result: true,
            message: "Konu başarıyla eklendi!",
            dataList: [],
        };
    } catch (e) {
        return {
            result: false,
            message: "Bir Hata Oluştu! " + e,
            dataList: [],
            totalLen: 0
        };
    }
}
async function getChatTopic(query) {
    try {
        var filter = "";
        var data = "";
        data = await DBPool.query(`SELECT * FROM topics_table`);
        var chatTopic = ""
        if(data.rowCount > 0){
            chatTopic += "";
            for (var element of data.rows) {
                var text = "\nKonu: \n "
                text += element.topic + "\n Alt konular: \n"+ element.subtopic;
                chatTopic += text;
            }
        }
        // console.log(chatTopic)
        return chatTopic;
    } catch (e) {
        console.log(e);
        return {
            result: false,
            message: "Bir Hata Oluştu! " + e,
            dataList: [],
            totalLen: 0
        };
    }
}
module.exports = {
    getTopics,
    addTopics,
    getChatTopic,
};
