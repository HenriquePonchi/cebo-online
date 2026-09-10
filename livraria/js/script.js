/*
  ============================================================
  NOCTÍVAGA — LÓGICA DO SITE
  ============================================================
  Este arquivo cuida de:
    - Montar os cards de categorias e livros na tela
    - Pesquisa e filtros (tipo, categoria, preço, estado)
    - Carrinho (adicionar, remover, quantidade, localStorage)
    - Montagem da mensagem e abertura do WhatsApp
    - Menu mobile e painel do carrinho
  Os dados dos livros vivem em js/livros.js
  O número de WhatsApp vive em js/config.js
  ============================================================
*/

(function () {
  "use strict";

  /* ---------- estado do carrinho (persistido no localStorage) ---------- */
  const CHAVE_CARRINHO = "noctivaga_carrinho";
  let carrinho = carregarCarrinho();

  function carregarCarrinho() {
    try {
      const salvo = localStorage.getItem(CHAVE_CARRINHO);
      return salvo ? JSON.parse(salvo) : [];
    } catch (erro) {
      console.warn("Não foi possível ler o carrinho salvo:", erro);
      return [];
    }
  }

  function salvarCarrinho() {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    } catch (erro) {
      console.warn("Não foi possível salvar o carrinho:", erro);
    }
  }

  /* ---------- utilidades ---------- */
  function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function precoFinal(livro) {
    return livro.preco;
  }

  function precoOriginal(livro) {
    if (!livro.desconto || livro.desconto <= 0) return null;
    return livro.preco / (1 - livro.desconto / 100);
  }

  function corDaCategoria(nomeCategoria) {
    const cat = CATEGORIAS.find((c) => c.id === nomeCategoria);
    return cat ? cat.cor : "#3a2a55";
  }

  function iconeDaCategoria(nomeCategoria) {
    const cat = CATEGORIAS.find((c) => c.id === nomeCategoria);
    return cat ? cat.icone : "📖";
  }

  function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.classList.add("toast--visivel");
    clearTimeout(mostrarToast._timer);
    mostrarToast._timer = setTimeout(() => {
      toast.classList.remove("toast--visivel");
    }, 2600);
  }

  /* ============================================================
     RENDERIZAÇÃO DE CATEGORIAS
     ============================================================ */
  function montarSeletorCategorias() {
    const select = document.getElementById("filtroCategoria");
    CATEGORIAS.forEach((cat) => {
      const opcao = document.createElement("option");
      opcao.value = cat.id;
      opcao.textContent = cat.id;
      select.appendChild(opcao);
    });
  }

  function renderizarCategorias() {
    const trilho = document.getElementById("listaCategorias");
    trilho.innerHTML = "";

    CATEGORIAS.forEach((cat) => {
      const quantidade = livros.filter((l) => l.categoria === cat.id).length;
      if (quantidade === 0) return;

      const card = document.createElement("button");
      card.className = "cartao-categoria";
      card.style.setProperty("--cor-categoria", cat.cor);
      card.dataset.categoria = cat.id;
      card.innerHTML = `
        <span class="cartao-categoria__icone" aria-hidden="true">${cat.icone}</span>
        <span class="cartao-categoria__nome">${cat.id}</span>
        <span class="cartao-categoria__qtd">${quantidade} título${quantidade > 1 ? "s" : ""}</span>
      `;
      card.addEventListener("click", () => {
        document.getElementById("filtroCategoria").value = cat.id;
        aplicarFiltros();
        document.getElementById("livros").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      trilho.appendChild(card);
    });
  }

  function renderizarLinksRodapeCategorias() {
    const coluna = document.getElementById("rodapeCategorias");
    CATEGORIAS.slice(0, 6).forEach((cat) => {
      const link = document.createElement("a");
      link.href = "#categorias";
      link.textContent = cat.id;
      coluna.appendChild(link);
    });
  }

  /* ============================================================
     RENDERIZAÇÃO DE LIVROS
     ============================================================ */
  function criarCardLivro(livro) {
    const original = precoOriginal(livro);
    const noCarrinho = carrinho.find((item) => item.id === livro.id);

    const artigo = document.createElement("article");
    artigo.className = "cartao-livro";
    artigo.dataset.id = livro.id;

    artigo.innerHTML = `
      <div class="cartao-livro__capa">
        <img src="${livro.imagem}" alt="Capa do livro ${escapeHtml(livro.titulo)}" loading="lazy">
        <span class="etiqueta etiqueta--tipo etiqueta--${livro.tipo === "Novo" ? "novo" : "usado"}">${livro.tipo}</span>
        ${livro.desconto > 0 ? `<span class="etiqueta etiqueta--desconto">-${livro.desconto}%</span>` : ""}
      </div>
      <div class="cartao-livro__corpo">
        <span class="cartao-livro__categoria" style="--cor-categoria:${corDaCategoria(livro.categoria)}">
          ${iconeDaCategoria(livro.categoria)} ${escapeHtml(livro.categoria)}
        </span>
        <h3 class="cartao-livro__titulo">${escapeHtml(livro.titulo)}</h3>
        <p class="cartao-livro__autor">${escapeHtml(livro.autor)}</p>
        ${livro.tipo === "Usado" ? `<p class="cartao-livro__estado">${escapeHtml(livro.estado)}</p>` : ""}
        <div class="cartao-livro__preco">
          ${original ? `<span class="cartao-livro__preco-original">${formatarPreco(original)}</span>` : ""}
          <span class="cartao-livro__preco-atual">${formatarPreco(precoFinal(livro))}</span>
        </div>
        <button class="botao botao--adicionar" data-adicionar="${livro.id}">
          ${noCarrinho ? "Adicionar outro" : "Adicionar ao carrinho"}
        </button>
      </div>
    `;

    artigo.querySelector("[data-adicionar]").addEventListener("click", () => {
      adicionarAoCarrinho(livro.id);
    });

    return artigo;
  }

  function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  function renderizarGrade(container, listaLivros, mensagemVazio) {
    container.innerHTML = "";
    if (listaLivros.length === 0) {
      const vazio = document.createElement("div");
      vazio.className = "grade-vazia";
      vazio.innerHTML = `
        <img src="assets/mascote.png" alt="" class="grade-vazia__mascote">
        <p>${mensagemVazio}</p>
      `;
      container.appendChild(vazio);
      return;
    }
    listaLivros.forEach((livro) => container.appendChild(criarCardLivro(livro)));
  }

  function renderizarOfertas() {
    const emOferta = livros.filter((l) => l.desconto > 0);
    renderizarGrade(
      document.getElementById("grade-ofertas"),
      emOferta,
      "Nenhuma oferta especial nesta noite. Volte amanhã."
    );
  }

  let estadoUsadosAtivo = "todos";
  function renderizarUsados() {
    const usados = livros.filter(
      (l) => l.tipo === "Usado" && (estadoUsadosAtivo === "todos" || l.estado === estadoUsadosAtivo)
    );
    renderizarGrade(
      document.getElementById("grade-usados"),
      usados,
      "Nenhum livro usado encontrado com esse estado de conservação."
    );
  }

  /* ============================================================
     BUSCA E FILTROS DA VITRINE PRINCIPAL
     ============================================================ */
  let filtroTipoAtivo = "todos";

  function aplicarFiltros() {
    const termo = document.getElementById("campoPesquisa").value.trim().toLowerCase();
    const categoria = document.getElementById("filtroCategoria").value;
    const ordem = document.getElementById("filtroOrdem").value;

    let resultado = livros.filter((livro) => {
      const casaTermo =
        !termo ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo) ||
        livro.categoria.toLowerCase().includes(termo);

      const casaTipo = filtroTipoAtivo === "todos" || livro.tipo === filtroTipoAtivo;
      const casaCategoria = categoria === "todas" || livro.categoria === categoria;

      return casaTermo && casaTipo && casaCategoria;
    });

    if (ordem === "menor") resultado.sort((a, b) => a.preco - b.preco);
    if (ordem === "maior") resultado.sort((a, b) => b.preco - a.preco);

    const mensagem = document.getElementById("mensagemResultado");
    mensagem.textContent =
      resultado.length === livros.length
        ? `${resultado.length} livros no acervo`
        : `${resultado.length} livro${resultado.length === 1 ? "" : "s"} encontrado${resultado.length === 1 ? "" : "s"}`;

    renderizarGrade(
      document.getElementById("grade-livros"),
      resultado,
      "Nenhum livro encontrado. Tente outro termo ou limpe os filtros."
    );
  }

  function configurarFiltros() {
    document.getElementById("campoPesquisa").addEventListener("input", aplicarFiltros);
    document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);
    document.getElementById("filtroOrdem").addEventListener("change", aplicarFiltros);

    document.querySelectorAll("[data-filtro-tipo]").forEach((botao) => {
      botao.addEventListener("click", () => {
        document.querySelectorAll("[data-filtro-tipo]").forEach((b) => b.classList.remove("is-ativo"));
        botao.classList.add("is-ativo");
        filtroTipoAtivo = botao.dataset.filtroTipo;
        aplicarFiltros();
      });
    });

    document.querySelectorAll("[data-filtro-estado]").forEach((botao) => {
      botao.addEventListener("click", () => {
        document.querySelectorAll("[data-filtro-estado]").forEach((b) => b.classList.remove("is-ativo"));
        botao.classList.add("is-ativo");
        estadoUsadosAtivo = botao.dataset.filtroEstado;
        renderizarUsados();
      });
    });
  }

  /* ============================================================
     CARRINHO
     ============================================================ */
  function adicionarAoCarrinho(idLivro) {
    const livro = livros.find((l) => l.id === idLivro);
    if (!livro) return;

    const item = carrinho.find((i) => i.id === idLivro);
    if (item) {
      item.quantidade += 1;
    } else {
      carrinho.push({ id: livro.id, quantidade: 1 });
    }
    salvarCarrinho();
    atualizarInterfaceCarrinho();
    mostrarToast(`"${livro.titulo}" foi para o carrinho.`);
  }

  function alterarQuantidade(idLivro, delta) {
    const item = carrinho.find((i) => i.id === idLivro);
    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      carrinho = carrinho.filter((i) => i.id !== idLivro);
    }
    salvarCarrinho();
    atualizarInterfaceCarrinho();
  }

  function removerDoCarrinho(idLivro) {
    carrinho = carrinho.filter((i) => i.id !== idLivro);
    salvarCarrinho();
    atualizarInterfaceCarrinho();
  }

  function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarInterfaceCarrinho();
  }

  function itensDetalhados() {
    return carrinho
      .map((item) => {
        const livro = livros.find((l) => l.id === item.id);
        if (!livro) return null;
        return { livro, quantidade: item.quantidade, subtotal: livro.preco * item.quantidade };
      })
      .filter(Boolean);
  }

  function totalCarrinho() {
    return itensDetalhados().reduce((soma, item) => soma + item.subtotal, 0);
  }

  function quantidadeTotalCarrinho() {
    return carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  }

  function atualizarInterfaceCarrinho() {
    document.getElementById("contadorCarrinho").textContent = quantidadeTotalCarrinho();
    document.getElementById("totalCarrinho").textContent = formatarPreco(totalCarrinho());

    const corpo = document.getElementById("corpoCarrinho");
    const itens = itensDetalhados();

    if (itens.length === 0) {
      corpo.innerHTML = `
        <div class="carrinho-vazio">
          <img src="assets/mascote.png" alt="" class="carrinho-vazio__mascote">
          <p>Seu carrinho está tão vazio quanto a biblioteca à meia-noite.<br>Que tal escolher uma história?</p>
        </div>
      `;
      return;
    }

    corpo.innerHTML = "";
    itens.forEach(({ livro, quantidade, subtotal }) => {
      const linha = document.createElement("div");
      linha.className = "item-carrinho";
      linha.innerHTML = `
        <img src="${livro.imagem}" alt="" class="item-carrinho__capa">
        <div class="item-carrinho__info">
          <p class="item-carrinho__titulo">${escapeHtml(livro.titulo)}</p>
          <p class="item-carrinho__preco">${formatarPreco(livro.preco)} cada</p>
          <div class="item-carrinho__controles">
            <button class="quantidade-botao" data-diminuir="${livro.id}" aria-label="Diminuir quantidade">&minus;</button>
            <span class="quantidade-numero">${quantidade}</span>
            <button class="quantidade-botao" data-aumentar="${livro.id}" aria-label="Aumentar quantidade">+</button>
            <button class="item-carrinho__remover" data-remover="${livro.id}">Remover</button>
          </div>
        </div>
        <span class="item-carrinho__subtotal">${formatarPreco(subtotal)}</span>
      `;
      corpo.appendChild(linha);
    });

    corpo.querySelectorAll("[data-diminuir]").forEach((b) =>
      b.addEventListener("click", () => alterarQuantidade(Number(b.dataset.diminuir), -1))
    );
    corpo.querySelectorAll("[data-aumentar]").forEach((b) =>
      b.addEventListener("click", () => alterarQuantidade(Number(b.dataset.aumentar), 1))
    );
    corpo.querySelectorAll("[data-remover]").forEach((b) =>
      b.addEventListener("click", () => removerDoCarrinho(Number(b.dataset.remover)))
    );
  }

  /* ============================================================
     PAINEL DO CARRINHO (abrir/fechar)
     ============================================================ */
  function abrirPainelCarrinho() {
    document.getElementById("painelCarrinho").classList.add("is-aberto");
    document.getElementById("carrinhoFundo").classList.add("is-visivel");
    document.body.classList.add("bloquear-rolagem");
  }

  function fecharPainelCarrinho() {
    document.getElementById("painelCarrinho").classList.remove("is-aberto");
    document.getElementById("carrinhoFundo").classList.remove("is-visivel");
    document.body.classList.remove("bloquear-rolagem");
  }

  /* ============================================================
     MODAL DE DADOS DO CLIENTE + ENVIO PARA O WHATSAPP
     ============================================================ */
  function abrirModalDados() {
    if (carrinho.length === 0) {
      mostrarToast("Adicione ao menos um livro antes de finalizar.");
      return;
    }
    fecharPainelCarrinho();
    document.getElementById("modalDados").classList.add("is-aberto");
    document.getElementById("dadosFundo").classList.add("is-visivel");
    document.body.classList.add("bloquear-rolagem");
    document.getElementById("campoNome").focus();
  }

  function fecharModalDados() {
    document.getElementById("modalDados").classList.remove("is-aberto");
    document.getElementById("dadosFundo").classList.remove("is-visivel");
    document.body.classList.remove("bloquear-rolagem");
  }

  function montarMensagemWhatsapp(nome, local, observacao) {
    const itens = itensDetalhados();
    const linhasItens = itens
      .map((item) => `${item.quantidade}x ${item.livro.titulo} — ${formatarPreco(item.livro.preco)}`)
      .join("\n");

    let mensagem = `Olá! Meu nome é ${nome}.\n\n`;
    mensagem += `Gostaria de fazer o seguinte pedido:\n\n`;
    mensagem += `📚 ${linhasItens.replace(/\n/g, "\n📚 ")}\n\n`;
    mensagem += `💰 Total: ${formatarPreco(totalCarrinho())}\n\n`;
    mensagem += `📍 Cidade/Bairro: ${local}\n`;
    if (observacao && observacao.trim()) {
      mensagem += `\n📝 Observação:\n${observacao.trim()}\n`;
    }
    mensagem += `\nAguardo informações sobre pagamento e entrega.`;

    return mensagem;
  }

  function enviarParaWhatsapp(evento) {
    evento.preventDefault();

    const nome = document.getElementById("campoNome").value.trim();
    const local = document.getElementById("campoLocal").value.trim();
    const observacao = document.getElementById("campoObservacao").value;

    if (!nome || !local) {
      mostrarToast("Preencha nome e cidade/bairro para continuar.");
      return;
    }

    const mensagem = montarMensagemWhatsapp(nome, local, observacao);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener");

    fecharModalDados();
  }

  /* ============================================================
     MENU MOBILE
     ============================================================ */
  function configurarMenuMobile() {
    const botao = document.getElementById("menuHamburguer");
    const nav = document.getElementById("navPrincipal");

    botao.addEventListener("click", () => {
      const aberto = nav.classList.toggle("is-aberto");
      botao.classList.toggle("is-aberto", aberto);
      botao.setAttribute("aria-expanded", String(aberto));
    });

    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("is-aberto");
        botao.classList.remove("is-aberto");
        botao.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ============================================================
     INICIALIZAÇÃO
     ============================================================ */
  function iniciar() {
    document.getElementById("anoAtual").textContent = new Date().getFullYear();
    document.getElementById("linkWhatsappRodape").href = `https://wa.me/${CONFIG.whatsapp}`;

    montarSeletorCategorias();
    renderizarCategorias();
    renderizarLinksRodapeCategorias();
    aplicarFiltros();
    renderizarOfertas();
    renderizarUsados();
    atualizarInterfaceCarrinho();
    configurarFiltros();
    configurarMenuMobile();

    document.getElementById("abrirCarrinho").addEventListener("click", abrirPainelCarrinho);
    document.getElementById("fecharCarrinho").addEventListener("click", fecharPainelCarrinho);
    document.getElementById("carrinhoFundo").addEventListener("click", () => {
      fecharPainelCarrinho();
      fecharModalDados();
    });

    document.getElementById("limparCarrinho").addEventListener("click", limparCarrinho);
    document.getElementById("irParaDados").addEventListener("click", abrirModalDados);

    document.getElementById("fecharDados").addEventListener("click", fecharModalDados);
    document.getElementById("dadosFundo").addEventListener("click", fecharModalDados);
    document.getElementById("formDados").addEventListener("submit", enviarParaWhatsapp);

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        fecharPainelCarrinho();
        fecharModalDados();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
