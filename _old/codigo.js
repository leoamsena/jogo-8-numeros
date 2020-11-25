class TreeNode {
    constructor(value, pai = null) {
        this.pai = pai;
        this.value = value;
        this.descendents = [];
        this.manhattan = this.calcularManhattan();
    }
    calcularHash() {
            return this.value.reduce(
                    (acc1, linha) =>
                    `${acc1}${linha.reduce((acc2, pos) => `${acc2}${pos}`, "")}`,
      ""
    );
  }

  calcularManhattan() {
    let pos = 0;
    let distancia = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        pos++;
        if (this.value[i][j] != " " && this.value[i][j] != pos) {
          const linha = Math.ceil(this.value[i][j] / 3) - 1;
          let coluna = (this.value[i][j] % 3) - 1;
          if (coluna < 0) coluna = 2;
          distancia += Math.abs(linha - i) + Math.abs(coluna - j);
        }
      }
    }
    return distancia;
  }

  addDecendents(...decedents) {
    for (let i = 0; i < decedents.length; i++) {
      const element = decedents[i];
      if (element !== false) {
        this.descendents.push(new TreeNode(element, this));
      }
    }
  }
}

function getSmallerManhattan(nodes) {
  if (nodes.length <= 0) return [];
  let menor = nodes[0].manhattan;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].manhattan < menor) menor = nodes[i].manhattan;
  }
  let arrayMenores = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].manhattan == menor) arrayMenores.push(nodes[i]);
  }

  return arrayMenores;
}

function gerarEstadoInicial() {
  misturar = () => Math.floor(Math.random() * 3);
  const array = [
    [1, 2, 3].sort(misturar),
    [4, 5, 6].sort(misturar),
    [7, 8, " "].sort(misturar),
  ].sort(misturar);
  return array;
}

function getPosWhiteSpace(state) {
  for (let i = 0; i < state.length; i++)
    for (let j = 0; j < state[i].length; j++)
      if (state[i][j] == " ") return [i, j];
}

function acao(estado, acao, pecaI, pecaJ) {
  const [posI, posJ] = getPosWhiteSpace(estado);

  if (pecaI >= 3 || pecaJ >= 3 || pecaI < 0 || pecaJ < 0) return false;
  if (acao == "cima" && (pecaI - 1 < 0 || posI != pecaI - 1)) return false;
  if (acao == "baixo" && (pecaI + 1 >= 3 || posI != pecaI + 1)) return false;
  if (acao == "direita" && (pecaJ + 1 >= 3 || posJ != pecaJ + 1)) return false;
  if (acao == "esquerda" && (pecaJ - 1 < 0 || posJ != pecaJ - 1)) return false;

  const estadoCopia = estado.map(function (arr) {
    return arr.slice();
  });
  estadoCopia[posI][posJ] = estadoCopia[pecaI][pecaJ];
  estadoCopia[pecaI][pecaJ] = " ";
  return estadoCopia;
}

function expandir(node) {
  const [posI, posJ] = getPosWhiteSpace(node.value);
  const cima = acao(node.value, "cima", posI + 1, posJ);
  const baixo = acao(node.value, "baixo", posI - 1, posJ);
  const esquerda = acao(node.value, "esquerda", posI, posJ + 1);
  const direita = acao(node.value, "direita", posI, posJ - 1);
  node.addDecendents(cima, baixo, esquerda, direita);
}

function testeDeObjetivo(node) {
  somaLinhas = [];

  const [posI, posJ] = getPosWhiteSpace(node.value);
  for (let i = 0; i < 3; i++) {
    let aux = 0;
    for (let j = 0; j < 3; j++)
      if (node.value[i][j] != " ") aux += node.value[i][j];

    somaLinhas[i] = aux;
  }
  let somaDasLinhasCorreta;
  if (posI == 0)
    somaDasLinhasCorreta =
      somaLinhas[0] == 3 && somaLinhas[1] == 12 && somaLinhas[2] == 21;
  else if (posI == 1)
    somaDasLinhasCorreta =
      somaLinhas[0] == 6 && somaLinhas[1] == 9 && somaLinhas[2] == 21;
  else
    somaDasLinhasCorreta =
      somaLinhas[0] == 6 && somaLinhas[1] == 15 && somaLinhas[2] == 15;
  if (somaDasLinhasCorreta) {
    for (let i = 0; i < 3; i++)
      for (let j = 1; j < 3; j++)
        if (node.value[i][j] < node.value[i][j - 1]) return false;
    return true;
  }
}
/*
const raiz = new TreeNode([
    [2, 8, 3],
    [1, 6, 4],
    [7, " ", 5],
]);
*/
const raiz = new TreeNode(gerarEstadoInicial());
let fronteira = [raiz];
let encontrouResultado = false;
let nodeSolucao = null;
let hashes = [];
//for (let x = 0; x < 7; x++) {
while (fronteira.length > 0) {
  const elemento = fronteira.shift();

  encontrouResultado = testeDeObjetivo(elemento);
  if (encontrouResultado) {
    nodeSolucao = elemento;
    break;
  }
  const hash = elemento.calcularHash();
  hashes.push(hash);
  console.log("Hash = ", hash);

  expandir(elemento);

  const menoresDescendents = getSmallerManhattan(
    elemento.descendents.filter((el) => !hashes.includes(el.calcularHash()))
  );
  fronteira = fronteira.concat(menoresDescendents);
  fronteira = getSmallerManhattan(fronteira);

  console.log("Fronteira: ");
  for (let i = 0; i < fronteira.length; i++) {
    console.log(fronteira[i].value, "man = ", fronteira[i].manhattan);
  }
}

console.log("inicial = ", raiz.value);
console.log("Solucao node = ", nodeSolucao);
console.log("Solucao node = ", nodeSolucao);