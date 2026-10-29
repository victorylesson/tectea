/* ==========================================================
   TecTEA – conteúdo do Módulo 1: Alfabetização Digital
   Para mudar textos, perguntas e respostas, edite só este arquivo.

   Tipos de passo (kind):
     intro     boas-vindas e apresentação do assunto
     learn     explicação de um conceito por vez (imagem + texto)
     list      lista de conceitos (termo + explicação)
     demo      demonstração prática
     activity  atividade interativa (campo "engine" escolhe o tipo)
     end       feedback e encerramento
   ========================================================== */
(function () {
  'use strict';
  const T = (window.TecTEA = window.TecTEA || {});
  const I = T.IMG;
  const opt = (label, img, correct, hint, ok) => ({ label, img, correct: !!correct, hint, ok });
  const emo = e => I.emoji(e);

  const AULAS = [
    /* ===================== AULA 1 ===================== */
    {
      id: 1, emoji: '📱', titulo: 'Conhecendo a tecnologia',
      resumo: 'Computador, notebook, tablet e celular: o que são e para que servem.',
      steps: [
        {
          id: 'a1-intro', kind: 'intro', title: 'Olá! Vamos conhecer a tecnologia?',
          text: [
            'A tecnologia está presente em muitas coisas que usamos todos os dias.',
            'Com ela, podemos estudar, desenhar, jogar, ouvir músicas e descobrir coisas novas.',
            'Explore as imagens para conhecer alguns dispositivos.'
          ],
          gallery: [
            { label: 'Computador', img: I.computador(), say: 'Este é o computador.' },
            { label: 'Notebook', img: I.notebook(), say: 'Este é o notebook.' },
            { label: 'Tablet', img: I.tablet(), say: 'Este é o tablet.' },
            { label: 'Celular', img: I.celular(), say: 'Este é o celular.' }
          ],
          note: 'Em seguida, cada dispositivo será mostrado um de cada vez.'
        },
        {
          id: 'a1-l1', kind: 'learn', title: 'O computador', img: I.computador(),
          text: 'O computador é um dispositivo eletrônico. Ele pode nos ajudar a estudar, escrever textos, desenhar, assistir a vídeos e realizar muitas outras tarefas.'
        },
        {
          id: 'a1-l2', kind: 'learn', title: 'O notebook', img: I.notebook(),
          text: 'O notebook também é um computador. Ele é fácil de levar de um lugar para outro, porque a tela e o teclado ficam juntos.'
        },
        {
          id: 'a1-l3', kind: 'learn', title: 'O celular', img: I.celular(),
          text: 'O celular é um dispositivo que cabe na mão. Podemos utilizá-lo para conversar, tirar fotografias, estudar e acessar aplicativos.'
        },
        {
          id: 'a1-l4', kind: 'learn', title: 'O tablet', img: I.tablet(),
          text: 'O tablet tem uma tela sensível ao toque. Podemos tocar na tela para abrir aplicativos, desenhar, ler e realizar outras atividades.'
        },
        {
          id: 'a1-1', kind: 'activity', engine: 'quiz', title: 'Atividade 1 · Encontre a tecnologia',
          goal: 'Reconhecer visualmente um dispositivo tecnológico e associar sua imagem ao nome.',
          questions: [{
            prompt: 'Qual destes objetos é um computador?',
            ok: 'Muito bem! Este é o computador.',
            options: [
              opt('Celular', I.celular(), false, 'Esse é o celular. O computador tem monitor, teclado e mouse. Tente outra imagem.'),
              opt('Computador', I.computador(), true),
              opt('Tablet', I.tablet(), false, 'Esse é o tablet. Olhe de novo e procure o computador.')
            ]
          }]
        },
        {
          id: 'a1-2', kind: 'activity', engine: 'quiz', title: 'Atividade 2 · Para que serve?',
          goal: 'Relacionar cada dispositivo à sua função. Começamos com duas alternativas e podemos aumentar a variedade conforme a compreensão.',
          questions: [
            {
              prompt: 'Qual dispositivo podemos usar para tirar uma fotografia?',
              ok: 'Isso mesmo! O celular tem câmera e tira fotografias.',
              options: [
                opt('Celular', I.celular(), true),
                opt('Teclado', I.teclado(), false, 'O teclado serve para digitar. Vamos tentar outra vez.')
              ]
            },
            {
              prompt: 'Qual dispositivo usamos para digitar um texto no computador?',
              ok: 'Isso mesmo! O teclado serve para digitar.',
              options: [
                opt('Mouse', I.mouse(), false, 'O mouse ajuda a clicar e mover o cursor. Para digitar, usamos outro. Tente de novo.'),
                opt('Teclado', I.teclado(), true)
              ]
            }
          ]
        },
        {
          id: 'a1-3', kind: 'activity', engine: 'multi', title: 'Atividade 3 · Tecnologia ou não tecnologia?',
          goal: 'A tecnologia não se limita aos dispositivos eletrônicos: um livro impresso também resulta de técnicas e conhecimentos. Por isso, esta atividade deixa claro que trabalha especificamente com dispositivos digitais.',
          prompt: 'Toque nos objetos que são dispositivos digitais. Depois toque em Conferir.',
          explain: 'Aqui procuramos aparelhos digitais, que usam tela e eletricidade.',
          items: [
            { id: 'nb', label: 'Notebook', img: I.notebook(), yes: true },
            { id: 'cel', label: 'Celular', img: I.celular(), yes: true },
            { id: 'liv', label: 'Livro', img: I.livro() },
            { id: 'arv', label: 'Árvore', img: I.arvore() },
            { id: 'tab', label: 'Tablet', img: I.tablet(), yes: true },
            { id: 'bol', label: 'Bola', img: I.bola() }
          ]
        },
        {
          id: 'a1-end', kind: 'end', title: 'Você terminou a Aula 1!',
          text: 'Você conheceu o computador, o notebook, o celular e o tablet, e descobriu para que cada um serve. Você pode repetir qualquer atividade quando quiser.'
        }
      ]
    },

    /* ===================== AULA 2 ===================== */
    {
      id: 2, emoji: '🖥️', titulo: 'Conhecendo as partes do computador',
      resumo: 'Monitor, teclado, mouse e gabinete: o nome e a função de cada parte.',
      steps: [
        {
          id: 'a2-intro', kind: 'intro', title: 'Vamos conhecer as partes do computador',
          text: [
            'O computador é feito de várias partes. Cada parte tem um nome e uma tarefa.',
            'Vamos descobrir como elas se chamam e para que servem.'
          ],
          hero: I.computador()
        },
        { id: 'a2-l1', kind: 'learn', title: 'Monitor', img: I.monitor(), text: 'O monitor é a tela do computador. Nela aparecem imagens, textos, vídeos e programas.' },
        { id: 'a2-l2', kind: 'learn', title: 'Teclado', img: I.teclado(), text: 'O teclado é usado para digitar letras, números e outros símbolos.' },
        { id: 'a2-l3', kind: 'learn', title: 'Mouse', img: I.mouse(), text: 'O mouse ajuda a controlar o cursor, selecionar objetos e clicar em botões.' },
        {
          id: 'a2-l4', kind: 'learn', title: 'Gabinete', img: I.gabinete(),
          text: 'O gabinete guarda partes importantes do computador, como o processador, a memória e o armazenamento.',
          note: 'Nem todo computador tem um gabinete separado. Nos notebooks, essas partes ficam dentro do próprio aparelho.'
        },
        { id: 'a2-d', kind: 'demo', engine: 'hotspots', title: 'Toque em uma parte do computador' },
        {
          id: 'a2-1', kind: 'activity', engine: 'place', title: 'Atividade 1 · Monte o computador',
          goal: 'Associar o nome e a posição de cada parte do computador.',
          prompt: 'Coloque cada parte no lugar certo.',
          layout: 'scene', reference: I.computador(),
          finalMsg: 'Você montou o computador!',
          pieces: [
            { id: 'monitor', label: 'Monitor', img: I.monitor(), target: 'monitor', ok: 'Muito bem! Essa é a posição do monitor.', hint: 'Vamos observar a imagem novamente. O monitor fica em cima, na frente da gente.' },
            { id: 'teclado', label: 'Teclado', img: I.teclado(), target: 'teclado', ok: 'Muito bem! Essa é a posição do teclado.', hint: 'Vamos observar a imagem novamente. O teclado fica à frente do monitor.' },
            { id: 'mouse', label: 'Mouse', img: I.mouse(), target: 'mouse', ok: 'Muito bem! Essa é a posição do mouse.', hint: 'Vamos observar a imagem novamente. O mouse fica ao lado do teclado.' }
          ],
          targets: [
            { id: 'monitor', label: 'Aqui', area: 'monitor', ghost: I.monitor() },
            { id: 'teclado', label: 'Aqui', area: 'teclado', ghost: I.teclado() },
            { id: 'mouse', label: 'Aqui', area: 'mouse', ghost: I.mouse() }
          ]
        },
        {
          id: 'a2-2', kind: 'activity', engine: 'quiz', title: 'Atividade 2 · Quem faz o quê?',
          goal: 'Relacionar cada componente à sua função.',
          questions: [
            {
              prompt: 'Onde vemos os programas?', ok: 'Isso mesmo! Os programas aparecem no monitor.',
              options: [
                opt('Monitor', I.monitor(), true),
                opt('Mouse', I.mouse(), false, 'O mouse controla o cursor. Os programas aparecem na tela. Tente de novo.')
              ]
            },
            {
              prompt: 'Onde digitamos as letras?', ok: 'Isso mesmo! As letras são digitadas no teclado.',
              options: [
                opt('Teclado', I.teclado(), true),
                opt('Monitor', I.monitor(), false, 'No monitor vemos as letras aparecerem. Para digitar, usamos outra parte.')
              ]
            },
            {
              prompt: 'Qual componente ajuda a controlar o cursor?', ok: 'Isso mesmo! O mouse controla o cursor.',
              options: [
                opt('Mouse', I.mouse(), true),
                opt('Monitor', I.monitor(), false, 'O monitor mostra o cursor, mas não o controla. Tente outra opção.'),
                opt('Teclado', I.teclado(), false, 'O teclado serve para digitar. Tente outra opção.')
              ]
            }
          ]
        },
        {
          id: 'a2-3', kind: 'activity', engine: 'quiz', title: 'Atividade 3 · Descubra a parte escondida',
          goal: 'Trabalhar observação visual, reconhecimento de objetos e associação entre nome e imagem.',
          questions: [
            { prompt: 'Qual parte está faltando?', display: I.computadorSem(['mouse']), ok: 'Muito bem! Faltava o mouse.',
              options: [opt('Monitor', null, false, 'O monitor está na imagem. Olhe de novo.'), opt('Teclado', null, false, 'O teclado está na imagem. Olhe de novo.'), opt('Mouse', null, true)] },
            { prompt: 'Qual parte está faltando?', display: I.computadorSem(['teclado']), ok: 'Muito bem! Faltava o teclado.',
              options: [opt('Monitor', null, false, 'O monitor está na imagem. Olhe de novo.'), opt('Teclado', null, true), opt('Mouse', null, false, 'O mouse está na imagem. Olhe de novo.')] },
            { prompt: 'Qual parte está faltando?', display: I.computadorSem(['monitor']), ok: 'Muito bem! Faltava o monitor.',
              options: [opt('Monitor', null, true), opt('Teclado', null, false, 'O teclado está na imagem. Olhe de novo.'), opt('Mouse', null, false, 'O mouse está na imagem. Olhe de novo.')] }
          ]
        },
        {
          id: 'a2-end', kind: 'end', title: 'Você terminou a Aula 2!',
          text: 'Você aprendeu o nome e a função do monitor, do teclado, do mouse e do gabinete. Você pode repetir qualquer atividade quando quiser.'
        }
      ]
    },

    /* ===================== AULA 3 ===================== */
    {
      id: 3, emoji: '🖱️', titulo: 'Aprendendo a usar o mouse',
      resumo: 'Apontar, clicar, clicar duas vezes, arrastar e rolar, um comando de cada vez.',
      steps: [
        {
          id: 'a3-intro', kind: 'intro', title: 'Vamos aprender a usar o mouse',
          text: ['O mouse ajuda a mexer no computador.', 'Vamos praticar um comando de cada vez, sem pressa.'],
          hero: I.mouse()
        },
        {
          id: 'a3-list', kind: 'list', title: 'Os 5 comandos do mouse',
          items: [
            { icon: '👆', term: 'Apontar', text: 'Movimentar o cursor até um elemento.' },
            { icon: '🖱️', term: 'Clicar', text: 'Pressionar e soltar um botão do mouse uma vez.' },
            { icon: '⚡', term: 'Duplo clique', text: 'Clicar duas vezes rapidamente, quando o programa exigir essa ação.' },
            { icon: '✋', term: 'Arrastar', text: 'Pressionar o botão, movimentar o objeto e soltar.' },
            { icon: '🔽', term: 'Rolar', text: 'Movimentar a roda do mouse para ver outras partes de uma página.' }
          ]
        },
        { id: 'a3-1', kind: 'activity', engine: 'mouseCmd', cmd: 'apontar', title: 'Prática 1 · Apontar', lead: 'Apontar é movimentar o cursor até um elemento.', prompt: 'Passe o cursor sobre a estrela.', ok: 'Muito bem! Você apontou para a estrela.' },
        { id: 'a3-2', kind: 'activity', engine: 'mouseCmd', cmd: 'clicar', title: 'Prática 2 · Clicar', lead: 'Clicar é pressionar e soltar um botão do mouse uma vez.', prompt: 'Clique no botão.', ok: 'Muito bem! Você clicou.' },
        { id: 'a3-3', kind: 'activity', engine: 'mouseCmd', cmd: 'duplo', title: 'Prática 3 · Duplo clique', lead: 'No duplo clique, clicamos duas vezes, bem rápido.', prompt: 'Clique duas vezes no botão.', ok: 'Muito bem! Você fez um duplo clique.' },
        {
          id: 'a3-4', kind: 'activity', engine: 'place', title: 'Prática 4 · Arrastar', lead: 'Arrastar é pressionar o botão, movimentar o objeto e soltar.',
          prompt: 'Arraste a bola até a caixa.', layout: 'bins', finalMsg: '',
          pieces: [{ id: 'bola', label: 'Bola', img: I.bola(), target: 'caixa', ok: 'Muito bem! Você arrastou a bola até a caixa.' }],
          targets: [{ id: 'caixa', label: 'Caixa', ghost: emo('📦') }]
        },
        { id: 'a3-5', kind: 'activity', engine: 'mouseCmd', cmd: 'rolar', title: 'Prática 5 · Rolar', lead: 'Rolar é girar a roda do mouse para ver outras partes de uma página.', prompt: 'Gire a roda do mouse sobre a caixa até achar a estrela lá embaixo.', ok: 'Muito bem! Você rolou até o final.' },
        {
          id: 'a3-6', kind: 'activity', engine: 'quiz', title: 'Desafio 1 · Clique no círculo', lead: 'Imagine que você está aprendendo a clicar.',
          questions: [{ prompt: 'Selecione o círculo abaixo.', ok: 'Muito bem! Você clicou no círculo.', options: [opt('Círculo', I.shape('circulo', '#2a5fb8'), true)] }]
        },
        {
          id: 'a3-7', kind: 'activity', engine: 'quiz', title: 'Desafio 2 · Encontre a figura',
          questions: [{
            prompt: 'Encontre e selecione o quadrado.', ok: 'Muito bem! Esse é o quadrado.',
            options: [
              opt('Círculo', I.shape('circulo', '#f4b942'), false, 'Esse é o círculo. O quadrado tem quatro lados iguais.'),
              opt('Triângulo', I.shape('triangulo', '#4caf7a'), false, 'Esse é o triângulo. O quadrado tem quatro lados iguais.'),
              opt('Quadrado', I.shape('quadrado', '#2a5fb8'), true),
              opt('Estrela', I.shape('estrela', '#8e7cc3'), false, 'Essa é a estrela. O quadrado tem quatro lados iguais.')
            ]
          }]
        },
        {
          id: 'a3-8', kind: 'activity', engine: 'place', title: 'Desafio 3 · Arraste para organizar',
          prompt: 'Coloque cada figura na caixa certa.', layout: 'bins', finalMsg: 'Você organizou todas as figuras!',
          pieces: [
            { id: 'c1', label: 'Círculo', img: I.shape('circulo', '#4caf7a'), target: 'circulos', ok: 'Muito bem! Círculo na caixa dos círculos.', hint: 'Vamos olhar de novo. Essa figura é redonda.' },
            { id: 'q1', label: 'Quadrado', img: I.shape('quadrado', '#f4b942'), target: 'quadrados', ok: 'Muito bem! Quadrado na caixa dos quadrados.', hint: 'Vamos olhar de novo. Essa figura tem quatro lados.' },
            { id: 'c2', label: 'Círculo', img: I.shape('circulo', '#2a5fb8'), target: 'circulos', ok: 'Muito bem! Círculo na caixa dos círculos.', hint: 'Vamos olhar de novo. Essa figura é redonda.' },
            { id: 'q2', label: 'Quadrado', img: I.shape('quadrado', '#8e7cc3'), target: 'quadrados', ok: 'Muito bem! Quadrado na caixa dos quadrados.', hint: 'Vamos olhar de novo. Essa figura tem quatro lados.' }
          ],
          targets: [
            { id: 'circulos', label: 'Caixa dos círculos', ghost: I.shape('circulo', '#8fa6d6') },
            { id: 'quadrados', label: 'Caixa dos quadrados', ghost: I.shape('quadrado', '#8fa6d6') }
          ]
        },
        {
          id: 'a3-end', kind: 'end', title: 'Você terminou a Aula 3!',
          text: 'Você praticou apontar, clicar, clicar duas vezes, arrastar e rolar. Você pode repetir qualquer atividade quando quiser.'
        }
      ]
    },

    /* ===================== AULA 4 ===================== */
    {
      id: 4, emoji: '⌨️', titulo: 'Aprendendo a usar o teclado',
      resumo: 'Letras, números, espaço, Enter e Backspace: vamos digitar o nosso nome.',
      steps: [
        {
          id: 'a4-intro', kind: 'intro', title: 'Vamos conhecer o teclado',
          text: ['O teclado tem muitas teclas. Cada tecla faz uma coisa.', 'Vamos começar com poucas teclas e ir aprendendo aos poucos.'],
          hero: I.teclado()
        },
        {
          id: 'a4-list1', kind: 'list', title: 'Primeiras teclas',
          items: [
            { key: 'A B C', term: 'Letras', text: 'Permitem escrever palavras.' },
            { key: '1 2 3', term: 'Números', text: 'Permitem digitar números.' },
            { key: 'Espaço', term: 'Espaço', text: 'Deixa um espaço entre as palavras.' }
          ]
        },
        {
          id: 'a4-list2', kind: 'list', title: 'Mais algumas teclas',
          items: [
            { key: 'Enter ↵', term: 'Enter', text: 'Pode iniciar uma nova linha ou confirmar uma ação, conforme o programa.' },
            { key: '⌫ Apagar', term: 'Backspace', text: 'Apaga o caractere que está antes do cursor.' },
            { key: '⇧ Shift', term: 'Shift', text: 'Permite digitar letras maiúsculas e outros símbolos.' },
            { key: '← ↑ ↓ →', term: 'Setas', text: 'Ajudam a movimentar o cursor ou navegar em algumas interfaces.' }
          ]
        },
        {
          id: 'a4-1', kind: 'activity', engine: 'findKey', title: 'Atividade 1 · Encontre a letra',
          goal: 'Localizar letras em um teclado ilustrado. A dificuldade aumenta aos poucos: primeiro uma letra, depois três.',
          word: 'CASA', rounds: [['C'], ['A', 'S', 'A']]
        },
        {
          id: 'a4-2', kind: 'activity', engine: 'typeText', title: 'Atividade 2 · Digite seu nome',
          goal: 'Usar um teclado virtual para escrever. Também funciona com o teclado de verdade.',
          prompt: 'Digite o seu nome.', how: 'Toque nas letras do teclado da tela. Quando terminar, toque em Pronto.', placeholder: 'Seu nome aparece aqui', autoCap: true
        },
        {
          id: 'a4-3', kind: 'activity', engine: 'quiz', title: 'Atividade 3 · Complete a palavra',
          questions: [{
            prompt: 'Qual letra está faltando?', display: '<div class="bigword" aria-label="C A letra faltando A">C A _ A</div>',
            ok: 'Muito bem! A palavra é CASA.', hint: 'Leia devagar: C, A, … A. Tente outra letra.',
            options: [opt('S', null, true), opt('M', null, false), opt('P', null, false)]
          }]
        },
        {
          id: 'a4-end', kind: 'end', title: 'Você terminou a Aula 4!',
          text: 'Você conheceu as principais teclas e escreveu o seu nome. Você pode repetir qualquer atividade quando quiser.'
        }
      ]
    },

    /* ===================== AULA 5 ===================== */
    {
      id: 5, emoji: '🪟', titulo: 'Explorando a tela do computador',
      resumo: 'Área de trabalho, ícones, janelas, botões e cursor.',
      steps: [
        {
          id: 'a5-intro', kind: 'intro', title: 'Vamos explorar a tela do computador',
          text: ['Na tela do computador há muitas coisas para ver e tocar.', 'Vamos aprender o nome de cada uma.'],
          hero: I.monitor()
        },
        {
          id: 'a5-list1', kind: 'list', title: 'Conhecendo a tela',
          items: [
            { icon: '🖥️', term: 'Área de trabalho', text: 'É o espaço principal que aparece em muitos computadores depois que começamos a usar.' },
            { icon: '🗂️', term: 'Ícone', text: 'É uma imagem que representa um aplicativo, um arquivo, uma pasta ou uma função.' },
            { icon: '🧩', term: 'Aplicativo', text: 'É um programa usado para realizar uma tarefa.' }
          ]
        },
        {
          id: 'a5-list2', kind: 'list', title: 'Mais coisas da tela',
          items: [
            { icon: '🪟', term: 'Janela', text: 'É a área da tela onde um aplicativo ou documento aparece.' },
            { icon: '🔘', term: 'Botão', text: 'É algo em que podemos clicar para realizar uma ação.' },
            { icon: '➤', term: 'Cursor', text: 'Mostra onde o mouse está ou onde o texto vai aparecer.' }
          ]
        },
        { id: 'a5-1', kind: 'activity', engine: 'buttonsDemo', title: 'Atividade 1 · O que acontece quando clicamos?', goal: 'Perceber que diferentes elementos podem iniciar ações diferentes.', prompt: 'Toque em um botão e veja o que acontece.' },
        {
          id: 'a5-2', kind: 'activity', engine: 'quiz', title: 'Atividade 2 · Encontre o ícone',
          goal: 'Os ícones variam entre sistemas operacionais e aplicativos. Aqui usamos ícones simples.',
          lead: 'Os ícones podem ser um pouco diferentes em cada computador.',
          questions: [
            { prompt: 'Qual ícone representa uma pasta?', ok: 'Muito bem! Esse ícone é uma pasta.', hint: 'Vamos olhar de novo. A pasta guarda arquivos e parece uma pastinha.',
              options: [opt('Desenho', I.desenho(), false), opt('Pasta', I.pasta(), true), opt('Calculadora', I.calculadora(), false)] },
            { prompt: 'Qual ícone representa um desenho?', ok: 'Muito bem! Esse ícone é um desenho.', hint: 'Vamos olhar de novo. O desenho tem tintas de várias cores.',
              options: [opt('Calculadora', I.calculadora(), false), opt('Pasta', I.pasta(), false), opt('Desenho', I.desenho(), true)] },
            { prompt: 'Qual ícone representa uma calculadora?', ok: 'Muito bem! Esse ícone é uma calculadora.', hint: 'Vamos olhar de novo. A calculadora tem uma telinha e vários botões.',
              options: [opt('Calculadora', I.calculadora(), true), opt('Desenho', I.desenho(), false), opt('Pasta', I.pasta(), false)] }
          ]
        },
        {
          id: 'a5-3', kind: 'activity', engine: 'windowSim', title: 'Atividade 3 · Abrir e fechar uma janela',
          goal: 'Fechar uma janela nem sempre significa apagar o arquivo ou desinstalar o programa.',
          prompt: 'Toque em Abrir. Depois toque em Fechar.',
          ok: 'Muito bem! Você abriu e fechou a janela. Fechar uma janela não apaga o desenho e não tira o programa do computador.'
        },
        {
          id: 'a5-end', kind: 'end', title: 'Você terminou a Aula 5!',
          text: 'Você conheceu a área de trabalho, os ícones, as janelas, os botões e o cursor. Você pode repetir qualquer atividade quando quiser.'
        }
      ]
    },

    /* ===================== AULA 6 ===================== */
    {
      id: 6, emoji: '🎨', titulo: 'Minha primeira tarefa digital',
      resumo: 'Hora de usar tudo o que aprendi: desenhar, escrever e organizar.',
      steps: [
        {
          id: 'a6-intro', kind: 'intro', title: 'Minha primeira tarefa digital',
          text: ['Agora vamos usar tudo o que aprendemos!', 'Cada tarefa tem começo, meio e fim. Você escolhe o seu ritmo.'],
          hero: I.computador()
        },
        {
          id: 'a6-1', kind: 'activity', engine: 'draw', title: 'Projeto A · Meu primeiro desenho',
          goal: 'Habilidades: clicar, selecionar, reconhecer ícones e utilizar um aplicativo.',
          prompt: 'Escolha uma cor, escolha uma figura e toque no quadro.'
        },
        {
          id: 'a6-2', kind: 'activity', engine: 'docText', title: 'Projeto B · Meu primeiro texto',
          goal: 'Habilidades: teclado, cursor, texto e comandos básicos.',
          prompt: 'Escreva uma palavra no documento.'
        },
        {
          id: 'a6-3', kind: 'activity', engine: 'place', title: 'Projeto C · Minha coleção digital',
          goal: 'Habilidades: ícones, seleção, organização e navegação.',
          prompt: 'Guarde cada figura na pasta certa.', layout: 'bins', finalMsg: 'Sua coleção está organizada!',
          pieces: [
            { id: 'cao', label: 'Cachorro', img: emo('🐶'), target: 'animais', ok: 'Muito bem! O cachorro é um animal.', hint: 'Vamos olhar de novo. O cachorro é um animal.' },
            { id: 'maca', label: 'Maçã', img: emo('🍎'), target: 'frutas', ok: 'Muito bem! A maçã é uma fruta.', hint: 'Vamos olhar de novo. A maçã é uma fruta.' },
            { id: 'gato', label: 'Gato', img: emo('🐱'), target: 'animais', ok: 'Muito bem! O gato é um animal.', hint: 'Vamos olhar de novo. O gato é um animal.' },
            { id: 'banana', label: 'Banana', img: emo('🍌'), target: 'frutas', ok: 'Muito bem! A banana é uma fruta.', hint: 'Vamos olhar de novo. A banana é uma fruta.' }
          ],
          targets: [
            { id: 'animais', label: 'Pasta Animais', ghost: I.pasta() },
            { id: 'frutas', label: 'Pasta Frutas', ghost: I.pasta() }
          ]
        },
        {
          id: 'a6-end', kind: 'end', title: 'Parabéns pela sua jornada!',
          text: 'Você explorou a tecnologia, conheceu partes do computador e praticou novas habilidades. Pode repetir qualquer atividade sempre que quiser.',
          small: 'Cada pessoa aprende no seu tempo e do seu jeito.'
        }
      ]
    }
  ];

  T.AULAS = AULAS;
  T.activityCount = aula => aula.steps.filter(s => s.kind === 'activity').length;
})();
