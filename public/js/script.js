// Berivan Bakış 16.05.2024
(function(){
    var chat = {
      messageToSend: '',
      messageResponses: [],
      init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
      },
      cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('button');
        this.$textarea = $('#message-to-send');
        this.$chatHistoryList =  this.$chatHistory.find('ul');
      },
      bindEvents: function() {
        this.$button.on('click', this.addMessage.bind(this));
        this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      },
      render: function() {
        this.scrollToBottom();
        if (this.messageToSend.trim() !== '') {
          var template = Handlebars.compile( $("#message-template").html());
          var context = { 
            messageOutput: this.messageToSend,
            time: this.getCurrentTime()
          };
  
          this.$chatHistoryList.append(template(context));
          this.scrollToBottom();
          this.$textarea.val('');
          
          var templateResponse = Handlebars.compile($("#message-response-template").html());
        // Yanıt alınıncaya kadar "..." göster
        this.$chatHistoryList.append(`<li class="waiting">AI'ın Cevabı Bekleniyor...</li>`);
        this.scrollToBottom();

        setTimeout(async () => {
            const response = await this.getRandomItem(this.messageResponses);
            var contextResponse = { 
                response: response,
                time: this.getCurrentTime()
            };
            // "..." gösteren elementi kaldır ve gerçek yanıtı ekle
            this.$chatHistoryList.find('.waiting').remove();
            this.$chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
        }, 1500);
        }
      },
      addMessage: async function() {
        this.messageToSend = this.$textarea.val()
        await this.render();  
      },
      addMessageEnter: function(event) {
          if (event.keyCode === 13) {
            this.addMessage();
          }
      },
      scrollToBottom: function() {
         this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
      },
      getCurrentTime: function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      },
      getRandomItem: async function(arr) {
        try {
            const url = new URL('http://localhost:3000/sendChatMessage');
            url.searchParams.append('message', this.messageToSend);
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.chatMessage);
            return data.chatMessage;
        } catch (error) {
            console.log('hata');
            return null;
        }
      }
    };
    chat.init();
})();
document.getElementById("chatTopic").addEventListener("click", async function() {
  document.querySelector(".search-text p").innerHTML = "<h2>AI Sohbet Konusunu Belirliyor...</h2>";
  try {
      const response = await fetch("http://localhost:3000/chatTopic");
      const data = await response.json();
      document.querySelector(".search-text p").innerHTML = data.chatTopic;
  } catch (error) {
      console.error("Hata oluştu:", error);
      document.querySelector(".search-text p").textContent = "Bir hata oluştu.";
  }
});

