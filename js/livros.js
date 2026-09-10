/*
  ============================================================
  CATÁLOGO DE LIVROS
  ============================================================
  Este arquivo é a ÚNICA coisa que você precisa editar para
  cadastrar, alterar ou remover um livro. Não é necessário
  mexer no HTML.

  COMO ADICIONAR UM LIVRO NOVO:

  1) Coloque a imagem da capa dentro da pasta:
         assets/livros/

  2) Copie um dos objetos abaixo (do "{" ao "},") e cole no
     final da lista, antes do "];".

  3) Altere os campos:

       id        -> um número que ainda não exista na lista
       titulo    -> nome do livro
       autor     -> nome do autor
       categoria -> uma das categorias usadas no site (veja a
                    lista em CATEGORIAS, algumas linhas abaixo)
       tipo      -> "Novo" ou "Usado"
       estado    -> se for "Usado", escreva o estado de
                    conservação. Use exatamente uma destas
                    opções para os filtros funcionarem:
                      "Excelente estado"
                      "Muito bom estado"
                      "Bom estado"
                      "Com marcas de uso"
                    Se for "Novo", deixe estado como "" (vazio).
       preco     -> preço final de venda, em número
                    (use ponto, não vírgula: 35.00)
       imagem    -> caminho da capa dentro de assets/livros/
       desconto  -> porcentagem de desconto para aparecer na
                    seção "Ofertas da noite". Use 0 (zero) se o
                    livro não estiver em oferta. O preço acima
                    (preco) já deve ser o preço promocional;
                    o "desconto" é usado só para mostrar a
                    etiqueta (ex: -20%) e o preço "de/por".

  4) Salve o arquivo. Pronto — o livro aparece no site
     automaticamente na próxima vez que a página for aberta.
  ============================================================
*/

// Categorias usadas pelo site. Para criar uma categoria nova,
// adicione um objeto aqui (id precisa ser igual ao texto usado
// no campo "categoria" dos livros) e escolha uma cor no tom roxo.
const CATEGORIAS = [
    { id: "Romance",               icone: "🥀", cor: "#5b2a63" },
    { id: "Fantasia",               icone: "🗝️", cor: "#4a2778" },
    { id: "Terror",                 icone: "🦇", cor: "#3a1030" },
    { id: "Suspense",               icone: "🕯️", cor: "#43225e" },
    { id: "Mistério",               icone: "🔍", cor: "#341b52" },
    { id: "Ficção científica",      icone: "🪐", cor: "#2f2666" },
    { id: "Clássicos",              icone: "🖋️", cor: "#512244" },
    { id: "Desenvolvimento pessoal",icone: "🌙", cor: "#3d2a5c" },
    { id: "Tecnologia",             icone: "💻", cor: "#26264f" },
    { id: "Biografias",             icone: "🕰️", cor: "#4b1f3f" }
];

const livros = [
    {
        id: 1,
        titulo: "O Nome do Vento",
        autor: "Patrick Rothfuss",
        categoria: "Fantasia",
        tipo: "Usado",
        estado: "Excelente estado",
        preco: 35.00,
        imagem: "assets/livros/livro1.jpg",
        desconto: 0
    },
    {
        id: 2,
        titulo: "Duna",
        autor: "Frank Herbert",
        categoria: "Ficção científica",
        tipo: "Novo",
        estado: "",
        preco: 64.90,
        imagem: "assets/livros/livro2.jpg",
        desconto: 20
    },
    {
        id: 3,
        titulo: "O Iluminado",
        autor: "Stephen King",
        categoria: "Terror",
        tipo: "Usado",
        estado: "Bom estado",
        preco: 32.00,
        imagem: "assets/livros/livro3.jpg",
        desconto: 0
    },
    {
        id: 4,
        titulo: "Drácula",
        autor: "Bram Stoker",
        categoria: "Clássicos",
        tipo: "Novo",
        estado: "",
        preco: 39.90,
        imagem: "assets/livros/livro4.jpg",
        desconto: 0
    },
    {
        id: 5,
        titulo: "O Silêncio dos Inocentes",
        autor: "Thomas Harris",
        categoria: "Suspense",
        tipo: "Usado",
        estado: "Muito bom estado",
        preco: 29.90,
        imagem: "assets/livros/livro5.jpg",
        desconto: 0
    },
    {
        id: 6,
        titulo: "Assassinato no Expresso do Oriente",
        autor: "Agatha Christie",
        categoria: "Mistério",
        tipo: "Novo",
        estado: "",
        preco: 42.00,
        imagem: "assets/livros/livro6.jpg",
        desconto: 30
    },
    {
        id: 7,
        titulo: "Orgulho e Preconceito",
        autor: "Jane Austen",
        categoria: "Romance",
        tipo: "Usado",
        estado: "Com marcas de uso",
        preco: 22.00,
        imagem: "assets/livros/livro7.jpg",
        desconto: 0
    },
    {
        id: 8,
        titulo: "1984",
        autor: "George Orwell",
        categoria: "Clássicos",
        tipo: "Novo",
        estado: "",
        preco: 37.50,
        imagem: "assets/livros/livro8.jpg",
        desconto: 0
    },
    {
        id: 9,
        titulo: "O Poder do Hábito",
        autor: "Charles Duhigg",
        categoria: "Desenvolvimento pessoal",
        tipo: "Usado",
        estado: "Excelente estado",
        preco: 28.00,
        imagem: "assets/livros/livro9.jpg",
        desconto: 0
    },
    {
        id: 10,
        titulo: "Sapiens",
        autor: "Yuval Noah Harari",
        categoria: "Desenvolvimento pessoal",
        tipo: "Novo",
        estado: "",
        preco: 54.90,
        imagem: "assets/livros/livro10.jpg",
        desconto: 20
    },
    {
        id: 11,
        titulo: "Frankenstein",
        autor: "Mary Shelley",
        categoria: "Terror",
        tipo: "Usado",
        estado: "Bom estado",
        preco: 24.90,
        imagem: "assets/livros/livro11.jpg",
        desconto: 0
    },
    {
        id: 12,
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J.K. Rowling",
        categoria: "Fantasia",
        tipo: "Novo",
        estado: "",
        preco: 49.90,
        imagem: "assets/livros/livro12.jpg",
        desconto: 0
    },
    {
        id: 13,
        titulo: "A Revolução dos Bichos",
        autor: "George Orwell",
        categoria: "Clássicos",
        tipo: "Usado",
        estado: "Muito bom estado",
        preco: 19.90,
        imagem: "assets/livros/livro13.jpg",
        desconto: 0
    },
    {
        id: 14,
        titulo: "O Morro dos Ventos Uivantes",
        autor: "Emily Brontë",
        categoria: "Romance",
        tipo: "Usado",
        estado: "Com marcas de uso",
        preco: 21.00,
        imagem: "assets/livros/livro14.jpg",
        desconto: 0
    },
    {
        id: 15,
        titulo: "Steve Jobs",
        autor: "Walter Isaacson",
        categoria: "Biografias",
        tipo: "Novo",
        estado: "",
        preco: 59.90,
        imagem: "assets/livros/livro15.jpg",
        desconto: 0
    },
    {
        id: 16,
        titulo: "Clean Code",
        autor: "Robert C. Martin",
        categoria: "Tecnologia",
        tipo: "Novo",
        estado: "",
        preco: 79.90,
        imagem: "assets/livros/livro16.jpg",
        desconto: 15
    }
];
