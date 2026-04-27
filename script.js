const API_KEY = "ТВОЙ_API_КЛЮЧ_СЮДА";

async function sendMessage() {
    const input = document.getElementById("userInput");
    const responseDiv = document.getElementById("response");
    const question = input.value.trim();

    if (question === "") {
        responseDiv.innerHTML = "⚠️ Сұрақ жазыңыз!";
        return;
    }

    responseDiv.innerHTML = "🤔 Ойлануда...";
    input.value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: question }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (answer) {
            responseDiv.innerHTML = "💬 <b>Жауап:</b><br>" + answer;
        } else {
            responseDiv.innerHTML = "❌ Жауап жоқ";
        }

    } catch (error) {
        responseDiv.innerHTML = "❌ Қате болды";
        console.error(error);
    }
}
