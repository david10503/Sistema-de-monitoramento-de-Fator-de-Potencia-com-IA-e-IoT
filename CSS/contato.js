
let ativo = false;

function alternarContato() {
  ativo = !ativo;

  const contatoNA = document.getElementById("contatoNA");
  const contatoNF = document.getElementById("contatoNF");

  // NA: fechado se ativo, aberto se inativo
  contatoNA.className = "contato " + (ativo ? "fechado" : "aberto");

  // NF: aberto se ativo, fechado se inativo
  contatoNF.className = "contato " + (ativo ? "aberto" : "fechado");
}
