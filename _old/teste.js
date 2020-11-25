let pos = 0;
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        pos++;
        const linha = Math.ceil(pos / 3) - 1;
        let coluna = (pos % 3) - 1;
        if (coluna < 0) coluna = 2;
        console.log("Pos = ", pos, " ( ", linha, ",", coluna, ")");
    }
}