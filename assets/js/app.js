Vue.use(VueMaterial.default);
const app = new Vue({
    el: "#app",
    data: function() {
        return {
            state: [],
            initialState: [],
            movimentos: 0,
            parte: 1,
            tempo: null,
            random: true,
            heuristic: true,
            estadoInput: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ],
            errorInputInitialState: null,

            solving: false,
        };
    },
    methods: {
        mountGame() {
            if (!this.random) {
                let cont = 0;
                const numbers = [];
                try {
                    this.estadoInput.forEach((el) =>
                        el.forEach((el2) => {
                            if (el2 === " ") cont++;
                            else if (el2 === "") throw "Input não preenchido!";
                            if (el2 !== " " && isNaN(el2))
                                throw "Valor diferente de número inserido!";
                            else if (el2 === " " && cont > 1)
                                throw "Mais de um espaço vazio presente!";
                            else if (el2 < 0 || el2 > 8)
                                throw "Número maior que 8 ou menor que 0 encontrado!";
                            else if (numbers.includes(el2)) throw "Dois números " + el2 + "!";
                            else numbers.push(el2);
                        })
                    );

                    this.initialState = this.estadoInput;
                    this.setUnidimensionalArray(this.estadoInput);
                } catch (err) {
                    this.errorInputInitialState = err;
                }
            } else {
                this.newRandomInitial();
            }
            this.parte = 2;
        },
        setUnidimensionalArray(arrayOfArrays) {
            this.state = [];
            arrayOfArrays.forEach((el) =>
                el.forEach((el2) => {
                    this.state.push(el2);
                })
            );
        },
        restart() {
            this.parte = 1;
            this.random = true;
            this.tempo = "";
        },
        async resolve() {
            console.log("Pensando...");
            this.solving = true;
            const solutuion = new Promise((resolve, reject) =>
                resolve(getSolution(new TreeNode(this.initialState), this.heuristic))
            );
            solutuion.then((sol) => {
                console.log("Resolvido!");
                let node = sol;
                let way = [];
                while (node != null) {
                    way.push(node);
                    node = node.parent;
                }
                this.movimentos = way.length;
                const interval = setInterval(() => {
                    const node = way.pop();
                    if (node) {
                        console.log(node);
                        this.setUnidimensionalArray(node.state);
                    } else {
                        this.solving = false;
                        clearInterval(interval);
                    }
                }, 500);
            });
        },
        newRandomInitial() {
            this.initialState = generateInitialState();
            this.setUnidimensionalArray(this.initialState);
        },
    },
});