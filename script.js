document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Live2D
    const app = new PIXI.Application({
        view: document.getElementById('live2d-container'),
        transparent: true,
        width: document.getElementById('live2d-container').clientWidth,
        height: 400
    });
    
    let model;
    
    // Muat model Live2D
    async function loadModel() {
        try {
            model = await PIXI.live2d.Live2DModel.from('assets/mymodel/model3.json');

            app.stage.addChild(model);
            
            // Atur skala dan posisi
            model.scale.set(0.25);
            model.x = app.screen.width / 2;
            model.y = app.screen.height / 1.2;
            
            // Animasi idle
            model.motion('idle');
        } catch (error) {
            console.error('Error loading Live2D model:', error);
            document.getElementById('chat-history').innerHTML += 
                `<div class="message bot-message">Error: Model tidak ditemukan</div>`;
        }
    }
    
    // Database respons chatbot
    const responses = {
        "halo": { 
            text: "Hai! Senang bertemu denganmu 😊", 
            expression: "smile",
            motion: "tap_body"
        },
        "apa kabar": { 
            text: "Aku baik-baik saja, terima kasih sudah bertanya!", 
            expression: "happy",
            motion: "wave"
        },
        "siapa namamu": { 
            text: "Aku Yuki, teman virtualmu!", 
            expression: "normal",
            motion: "idle"
        },
        "bye": { 
            text: "Sampai jumpa lagi! Jangan lupa tersenyum hari ini 😄", 
            expression: "smile",
            motion: "bye"
        },
        "default": { 
            text: "Maaf, aku belum paham maksudmu... bisa ulangi?", 
            expression: "sad",
            motion: "flick_head"
        }
    };
    
    // Fungsi untuk mengubah ekspresi
    function setExpression(expression) {
        if (model && model.expression) {
            model.expression(expression);
        }
    }
    
    // Fungsi untuk memainkan motion
    function playMotion(motion) {
        if (model && model.motion) {
            model.motion(motion);
        }
    }
    
    // Proses pesan pengguna
    function processMessage(input) {
        input = input.toLowerCase().trim();
        let response = responses.default;
        
        // Cek respons yang cocok
        Object.keys(responses).forEach(key => {
            if (input.includes(key)) {
                response = responses[key];
            }
        });
        
        return response;
    }
    
    // Tampilkan pesan di chat history
    function displayMessage(sender, text) {
        const chatHistory = document.getElementById('chat-history');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // Event listener untuk tombol kirim
    document.getElementById('send-btn').addEventListener('click', () => {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() === '') return;
        
        // Tampilkan pesan user
        displayMessage('user', userInput);
        
        // Proses pesan dan dapatkan respons
        const response = processMessage(userInput);
        
        // Tampilkan respons bot setelah jeda
        setTimeout(() => {
            displayMessage('bot', response.text);
            setExpression(response.expression);
            playMotion(response.motion);
        }, 800);
        
        // Reset input
        document.getElementById('user-input').value = '';
    });
    
    // Event listener untuk tombol Enter
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('send-btn').click();
        }
    });
    
    // Muat model saat halaman siap
    loadModel();
});
