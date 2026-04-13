:root {
    --bg: #0a0a0a;
    --text: #ffffff;
    --main: #b026ff;
}

/* 🔴🔵 DARK MODE (қызыл + көк неон) */
.dark {
    --bg: #050505;
    --text: #ffffff;
    --main: #00f0ff;
}

body {
    background: var(--bg);
    color: var(--text);
    font-family: Arial;
    padding: 20px;
    transition: 0.3s;
}

h1 {
    color: var(--main);
    text-shadow: 0 0 10px var(--main);
}

.cards {
    display: flex;
    gap: 20px;
}

.card {
    background: #111;
    border: 1px solid var(--main);
    padding: 15px;
    width: 250px;
    transition: 0.3s;
    opacity: 0;
    transform: translateY(50px);
}

.card.show {
    opacity: 1;
    transform: translateY(0);
}

.card:hover {
    box-shadow: 0 0 20px var(--main);
    transform: translateY(-10px);
}

a {
    color: var(--main);
}

/* Чат */
.chat {
    margin-top: 40px;
}

input {
    padding: 10px;
}

button {
    padding: 10px;
    background: var(--main);
    border: none;
    color: white;
    cursor: pointer;
}

/* 📱 мобиль */
@media (max-width: 600px) {
    .cards {
        flex-direction: column;
    }
}
