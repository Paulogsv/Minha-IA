const webhook = "https://paulosvvv.app.n8n.cloud/webhook/chatgpt";

async function enviarMensagem() {
    const inputElement = document.querySelector(".chats");
    const input = inputElement.value;
    const resultados = document.querySelector(".chat-box")
    const botao = document.querySelector(".botao");

    if (input === "") {
        resultados.innerHTML = "⚠️ Por favor, digite uma mensagem!"
        return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";
    botao.style.background = "#5a5a5a";

    let resposta = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: input })
    });

    let data;
    try {
        data = await resposta.json();
        console.log("Resposta do backend:", data);

        let mensagem = data.mensagem;


        let jsonMatch = mensagem.match(/```json\s*([\s\S]*?)```/i) || mensagem.match(/```\s*([\s\S]*?)```/i);
        let textoFinal = "";

        if (jsonMatch && jsonMatch[1]) {

            const respostaf = JSON.parse(jsonMatch[1]);
            textoFinal =
                (respostaf.mensagem || respostaf.resposta || "") +
                (respostaf.observacao ? "<br><i>" + respostaf.observacao + "</i>" : "") +
                (respostaf.conclusao ? "<br><b>" + respostaf.conclusao + "</b>" : "");
        } else if (mensagem && mensagem.trim().startsWith("{")) {

            const respostaf = JSON.parse(mensagem);
            textoFinal = respostaf.mensagem || respostaf.resposta || "⚠️Resposta sem mensagem.";
        } else {

            textoFinal = mensagem || "⚠️Resposta sem mensagem.";
        }

        resultados.innerHTML = textoFinal;

        if (data.style) {
            document.head.insertAdjacentHTML('beforeend', "<style>" + data.style + "</style>");
        }

        inputElement.value = "";

    } catch (e) {
        resultados.innerHTML = "Erro ao processar resposta do servidor.";
        console.error(e);
    }

    botao.disabled = false;
    botao.textContent = "ENVIAR";
    botao.style.background = '#302f2f';
}
document.querySelector(".chats").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem();
    }
});