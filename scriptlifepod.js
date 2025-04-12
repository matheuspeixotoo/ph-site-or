const spreadsheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vToZ6S4wN8SpPszA6OjCvc9yTiOmiBkujAIRF7Oj1rsfetiph-66_Y09ZTCbn7whc42kDmjI2wcJ3cS/pub?gid=746865980&single=true&output=csv";
fetch(spreadsheetURL)
  .then((response) => response.text())
  .then((csvText) => {
    const data = Papa.parse(csvText, { header: true }).data;
    const container = document.getElementById("product-container");

    const produtos = {};

    data.forEach((item) => {
      const key = `${item.Produto}|${item.Preço}|${item.Imagem}`;
      if (!produtos[key]) {
        produtos[key] = {
          produto: item.Produto,
          preco: item.Preço,
          imagem: item.Imagem,
          sabores: [],
        };
      }

      if (item.Sabor) {
        const sabores = item.Sabor.split(",").map((s) => s.trim());
        produtos[key].sabores.push(...sabores);
      }
    });

    Object.values(produtos).forEach((produto) => {
      const card = document.createElement("div");
      card.className = "product-card";

      const img = document.createElement("img");
      img.src = `./Assets/${produto.imagem}`;
      img.alt = produto.produto;

      const info = document.createElement("div");
      info.className = "product-info";

      const preco = `R$${parseFloat(produto.preco)
        .toFixed(2)
        .replace(".", ",")}`;
      const titulo = document.createElement("h2");
      titulo.textContent = `${produto.produto} - ${preco}`;

      const lista = document.createElement("ul");
      const saboresUnicos = [...new Set(produto.sabores)];
      saboresUnicos.forEach((sabor) => {
        const li = document.createElement("li");
        li.textContent = sabor;
        lista.appendChild(li);
      });

      info.appendChild(titulo);
      info.appendChild(lista);

      card.appendChild(img);
      card.appendChild(info);

      container.appendChild(card);
    });
  })
  .catch((err) => console.error("Erro ao carregar dados da planilha:", err));
