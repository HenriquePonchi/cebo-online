# Noctívaga — Livraria Online

Site simples de vitrine para livros novos e usados, com pedidos finalizados pelo WhatsApp. Feito só com HTML, CSS e JavaScript — sem servidor, sem banco de dados, sem login. Basta abrir o `index.html` no navegador.

## Como adicionar um livro

1. Coloque a capa do livro dentro da pasta:
   ```
   assets/livros/
   ```
2. Abra o arquivo:
   ```
   js/livros.js
   ```
3. Copie um dos livros existentes (do `{` ao `},`) e cole no final da lista.
4. Altere os dados: título, autor, categoria, tipo (Novo/Usado), estado de conservação, preço e o nome do arquivo da imagem.
5. Salve o arquivo.

Pronto — o livro aparece no site sozinho, sem precisar mexer no HTML.

Todos os detalhes de cada campo (inclusive as categorias e estados de conservação disponíveis) estão explicados em comentários no topo do próprio `js/livros.js`.

## Como alterar o WhatsApp da loja

1. Abra o arquivo:
   ```
   js/config.js
   ```
2. Troque o número:
   ```javascript
   whatsapp: "5511999999999"
   ```
   pelo número da loja, no formato: código do país + DDD + número, sem espaços nem símbolos (ex.: `5511987654321`).
3. Salve. Esse é o único lugar do projeto onde o número aparece.

## Como trocar o mascote e a logo

Substitua as imagens em:
```
assets/mascote.png
assets/logo.png
```
por versões definitivas, mantendo os mesmos nomes de arquivo.

## Estrutura do projeto

```
livraria/
├── index.html
├── css/
│   ├── style.css
│   └── responsivo.css
├── js/
│   ├── config.js      → número de WhatsApp da loja
│   ├── livros.js       → catálogo de livros (edite aqui)
│   └── script.js       → lógica do site (não precisa mexer)
├── assets/
│   ├── logo.png
│   ├── mascote.png
│   └── livros/         → capas dos livros
└── README.md
```

## O que o site NÃO faz (de propósito)

Não há pagamento automático, cadastro, login ou banco de dados. O cliente monta o pedido no site e finaliza pelo WhatsApp; o pagamento e a entrega são combinados diretamente com você na conversa.
