let mensagens = [];
let nome = prompt("Qual o seu nome?");
const seuNome = axios.post(
  "https://mock-api.driven.com.br/api/v6/uol/participants",
  { name: nome }
);
seuNome.then(bemVindo);
seuNome.catch(deuErrado);

function bemVindo() {
  alert(`Seja bem-vindo, ${nome}`);
}
function deuErrado() {
  alert("Ops, algo deu errado, digite seu nome novamente");
  nome = prompt("Qual o seu nome?");
}

setInterval(verificaStatus, 5000);
function verificaStatus() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
    name: nome,
  });
}

const promessa = axios.get(
  "https://mock-api.driven.com.br/api/v6/uol/messages"
);
promessa.then(mensagensChegaram);

function mensagensChegaram(resposta) {
  mensagens = resposta.data;
  console.log(mensagens);
  renderizarMensagem();
}

function renderizarMensagem() {
  const meuContainerMensagens = document.querySelector(".containerMensagens");
  meuContainerMensagens.innerHTML = "";
  for (let i = 0; i < mensagens.length; i++) {
    let msg = mensagens[i];
    if (msg.type === "status") {
      meuContainerMensagens.innerHTML += `<li class="mensagem cinza">
      <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> para <strong>${msg.to}: </strong> ${msg.text}</p>
    </li>`;
    } else if (msg.type === "message") {
      meuContainerMensagens.innerHTML += `<li class="mensagem branco">
      <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> para <strong>${msg.to}: </strong> ${msg.text}</p>
    </li>`;
    } else if (msg.type === "private_message") {
      meuContainerMensagens.innerHTML += `<li class="mensagem rosa">
    <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> reservadamente para <strong>${msg.to}: </strong> ${msg.text}</p>
  </li>`;
    }
  }
}

/*function adicionarMensagem() {
  const mensagem = document.querySelector(".escrever").value;
  const novaMensagem = {
    from: nome,
    to: "",
    text: mensagem,
    type: "",
    time: "",
  };
  mensagens.push(novaMensagem);
  renderizarMensagem();
  console.log(mensagens);
}*/
