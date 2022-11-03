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
  alert(
    "Ops, alguém já está usando esse nome, digite um novo nome para ingressar ao chat!"
  );
  nome = prompt("Qual o seu nome?");
}

function usuarioNaoEstaNaSala() {
  if (verificaStatusUsuario !== true) {
    alert(
      "Ops, você não está mais na sala, digite seu nome novamente para entrar"
    );
    window.location.reload();
  } else {
    return;
  }
}

function verificaStatusUsuario() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
    name: nome,
  });
  return true;
}
setInterval(verificaStatusUsuario, 5000);

function refreshMensagens() {
  promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promessa.then(mensagensChegaram);
}
setInterval(refreshMensagens, 3000);

let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
promessa.then(mensagensChegaram);
function mensagensChegaram(resposta) {
  mensagens = resposta.data;
  renderizarMensagem();
}

function renderizarMensagem() {
  const meuContainerMensagens = document.querySelector(".containerMensagens");
  meuContainerMensagens.innerHTML = "";
  for (let i = 0; i < mensagens.length; i++) {
    let msg = mensagens[i];
    if (msg.type === "status") {
      meuContainerMensagens.innerHTML += `<li class="mensagem cinza" data-test="message">
      <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> para <strong>${msg.to}: </strong> ${msg.text}</p>
    </li>`;
    } else if (msg.type === "message") {
      meuContainerMensagens.innerHTML += `<li class="mensagem branco" data-test="message">
      <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> para <strong>${msg.to}: </strong> ${msg.text}</p>
    </li>`;
    } else if (msg.type === "private_message") {
      if (msg.from === msg.to) {
        meuContainerMensagens.innerHTML += `<li class="mensagem rosa data-test="message"">
    <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> reservadamente para <strong>${msg.to}: </strong> ${msg.text}</p>
  </li>`;
      }
    }
  }
}

function adicionarMensagem() {
  let mensagem = document.querySelector(".escrever").value;
  let apagaInput = document.querySelector(".escrever");
  const novaMensagem = {
    from: nome,
    to: "Todos",
    text: mensagem,
    type: "message",
  };
  if (verificaStatusUsuario() === true) {
    const envio = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      novaMensagem
    );
    const ultimaMsg = document.querySelector(".containerMensagens").lastChild;
    envio.then(
      renderizarMensagem,
      (apagaInput.value = ""),
      ultimaMsg.scrollIntoView()
    );
  }
  if (verificaStatusUsuario() === false) {
    usuarioNaoEstaNaSala();
  }
}
