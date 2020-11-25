function generateInitialState() {
    const misturar = (a, b) => {
        const res = [0, 1, -1];
        const pos = Math.floor(Math.random() * 3);
        return res[pos];
    };
    const array = [
        [1, 2, 3].sort(misturar), [4, 5, 6].sort(misturar), [7, 8, " "].sort(misturar),
    ].sort(misturar);
    return array;
}

class TreeNode {
    constructor(state, parent = null) {
        this.state = state;
        this.parent = parent;
        this.descendents = [];
        this.isExpanded = false;
    }

    getPosWhiteSpace() {
        for (let i = 0; i < this.state.length; i++)
            for (let j = 0; j < this.state[i].length; j++)
                if (this.state[i][j] == " ") return [i, j];
    }

    hash() {
            return this.state.reduce(
                    (acc1, linha) =>
                    `${acc1}${linha.reduce((acc2, pos) => `${acc2}${pos}`, "")}`,
      ""
    );
  }
  swap(posAI, posAJ, posBI, posBJ) {
    const copyState = this.state.map(function (arr) {
      return arr.slice();
    });
    copyState[posAI][posAJ] = copyState[posBI][posBJ];
    copyState[posBI][posBJ] = " ";

    return copyState;
  }
  reducer(action) {
    const [posI, posJ] = this.getPosWhiteSpace();
    switch (action) {
      case "UP":
        if (posI + 1 < 3) return this.swap(posI, posJ, posI + 1, posJ);
        break;
      case "DOWN":
        if (posI - 1 >= 0) return this.swap(posI, posJ, posI - 1, posJ);
        break;
      case "LEFT":
        if (posJ + 1 < 3) return this.swap(posI, posJ, posI, posJ + 1);
        break;
      case "RIGTH":
        if (posJ - 1 >= 0) return this.swap(posI, posJ, posI, posJ - 1);
        break;
      default:
        return state;
    }
    return false;
  }

  distance() {
    let pos = 0;
    let distancia = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        pos++;
        if (this.state[i][j] != " " && this.state[i][j] != pos) {
          const linha = Math.ceil(this.state[i][j] / 3) - 1;
          let coluna = (this.state[i][j] % 3) - 1;
          if (coluna < 0) coluna = 2;
          distancia += Math.abs(linha - i) + Math.abs(coluna - j);
        }
      }
    }
    return distancia;
  }

  expand() {
    const actions = ["UP", "DOWN", "LEFT", "RIGTH"];
    const newDescendents = [];
    actions.forEach((action) => {
      const newState = this.reducer(action);
      if (newState) {
        const node = new TreeNode(newState, this);
        newDescendents.push(node);
      }
    });

    if (newDescendents.length > 0) {
      this.isExpanded = true;
    }

    this.descendents = newDescendents;
  }

  isSolution() {
    const hash = this.hash().replace(" ", "");
    return hash === "12345678";
  }
}
function getSmmalerDistance(elements) {
  let smaller = 999999;
  const descentendes = [];
  elements.forEach((el) => {
    const distance = el.distance();

    if (distance <= smaller) {
      smaller = distance;
    }
  });

  elements.forEach((el) => {
    const distance = el.distance();
    if (distance === smaller) {
      descentendes.push(el);
    }
  });

  return descentendes;
}

function getSolution(root) {
  let frontier = [root];

  let menorDistancia = [root];
  let segundaMenor = null;
  let hashes = [];
  while (frontier.length > 0) {
    const element = frontier.shift();

    if (element.isSolution()) return element;

    const hash = element.hash();

    if (!element.isExpanded) {
      element.expand();
      const descendents = getSmmalerDistance(element.descendents);
      if (descendents[0].distance() < menorDistancia[0].distance()) {
        menorDistancia = [];
        frontier = [];
        descendents.forEach((el) => {
          menorDistancia.push(el);
          frontier.push(el);
        });
        segundaMenor = null;
        /*
        console.log("Menor distancia: ", menorDistancia[0].distance());
        menorDistancia.forEach((el) => console.log("Estado: ", el.state));
        console.log("--------------");
        */
      } else {
        if (segundaMenor == null) {
          segundaMenor = [];
          descendents.forEach((el) => segundaMenor.push(el));
        }
        if (descendents[0].distance() < segundaMenor[0].distance()) {
          hashes = [];
          //console.log("Diminuiu...");
          frontier = [];
          segundaMenor = [];
          descendents.forEach((el) => {
            frontier.push(el);
            segundaMenor.push(el);
          });
        } else {
          element.descendents.forEach((el) => {
            if (!hashes.includes(el.hash())) {
              frontier.push(el);
              hashes.push(el.hash());
            }
          });
          /*
          console.log(
            "Segunda menor: ",
            segundaMenor[0].distance(),
            "descendents[0].distance():",
            descendents[0].distance()
          );
          */
        }
      }
    }
  }
}
let solution = false;
let initial = generateInitialState();
/*initial = [
  [8, " ", 7],
  [6, 4, 5],
  [3, 2, 1],
];*/
console.log(initial);
solution = getSolution(new TreeNode(initial));
console.log(solution);