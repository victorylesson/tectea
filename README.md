# TecTEA – MVP (frontend)

Site de alfabetização digital para crianças e adolescentes com TEA. HTML, CSS e JS puros, sem instalação.

## Como abrir
Dê dois cliques em `index.html` (ou use a extensão Live Server do VS Code).

## Estrutura
```
index.html        tela inicial (menu, login/cadastro, aulas, exercício de teste, sobre o módulo)
aula.html         tela de aula, montada a partir de aula.html?id=1 até 6
css/style.css     cores, tamanhos de letra e componentes
js/aulas.js       TODO O CONTEÚDO: textos, perguntas e respostas (edite aqui)
js/activities.js  tipos de atividade (escolha, arrastar, teclado virtual, mouse...)
js/svgs.js        ilustrações (computador, celular, ícones...) em SVG
js/common.js      cabeçalho, rodapé, A+/A−, modo calmo, progresso salvo
js/aula.js        navegação passo a passo dentro da aula
js/home.js        cards das aulas na tela inicial
assets/logo.png   logo do projeto
```

## Para ligar o backend depois
- Login e cadastro: `js/common.js`, procure o comentário `TODO (backend)`.
- Progresso: hoje fica no `localStorage` (`TecTEA.Progress` em `js/common.js`). Troque pelas chamadas à API mantendo os mesmos métodos.
