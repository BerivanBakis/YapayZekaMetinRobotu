// Berivan Bakış 16.05.2024
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { addTopics } = require('./db/topics');
const MODEL_NAME = "gemini-pro";
const API_KEY = "";
async function runChat(message, otherMessage) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
    if(otherMessage == 1){
      if(message.length == 0){
        return '<h2>Sohbet Geçmişi Bulunamadı</h2>'
      }
      var result = await chat.sendMessage("Aşağıdaki konular bizim seninle sohbetimiz. Bu konulardan bir sohbet konusu oluştur. Sadece bir başlık olsun \n " + message);
      var result2 = await chat.sendMessage("Aşağıdaki konuyla ilgili bana uzun uzun bilgiler ver \n " + result.response.text());
      const response = result.response;
      var formattedResponse = "<h2>"+response.text()+"</h2> <br>**Konuyla İlgili Web'te Aramalar** <br>"+ result2.response.text();
      formattedResponse = formattedResponse.replace(/\n/g, "<br>");
      return formattedResponse;
    }
    var result = await chat.sendMessage("Aşağıdaki metnin konusunu bul. \n " + message);
    var result2 = await chat.sendMessage("Aşağıdaki metnin varsa 3 tane alt konusunu bul. Sadece madde olarak yaz Başlık ekleme \n " + message);
    const response = result.response;
    const response2 = result2.response;
    console.log(response.text() + "\n" + response2.text());
    addTopics(response.text(), response2.text());
    var formattedResponse = "KONU <br>" + response.text().replace(/\n/g, "<br>");
    formattedResponse += "<br><br> ALT KONULAR <br>" + response2.text().replace(/\n/g, "<br>");
    return formattedResponse;
  } catch (e) {
    console.log("cevap bulunamadı " + e);
    return "Cevap bulunamadı"
  }
}
module.exports = {
  runChat
};
