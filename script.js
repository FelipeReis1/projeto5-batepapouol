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

function usuarioNaoEstaNaSala() {
  alert(
    "Ops, você não está mais na sala, digite seu nome novamente para entrar"
  );
  window.location.reload();
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
  console.log(mensagens);
  renderizarMensagem();
  const ultimaMsg = document.querySelector(".containerMensagens").lastChild;
  ultimaMsg.scrollIntoView();
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
      if (msg.from === msg.to) {
        meuContainerMensagens.innerHTML += `<li class="mensagem rosa">
    <p><span>(${msg.time}) </span> <strong>${msg.from}</strong> reservadamente para <strong>${msg.to}: </strong> ${msg.text}</p>
  </li>`;
      }
    }
  }
}

function adicionarMensagem() {
  const mensagem = document.querySelector(".escrever").value;
  const novaMensagem = {
    from: nome,
    to: "Todos",
    text: mensagem,
    type: "message",
  };
  if (verificaStatusUsuario() === true) {
    axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      novaMensagem
    );
    renderizarMensagem();
  }
  if (verificaStatusUsuario() === false) {
    usuarioNaoEstaNaSala();
  }
}
