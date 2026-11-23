<!-- BADGES -->

[HTML_BADGE]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[CSS_BADGE]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[JS_BADGE]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[GSAP_BADGE]: https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black
[WIP_BADGE]: https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue?style=for-the-badge

<!-- PROJECT -->
<h1 align="center" style="font-weight: bold;">Portfólio — Marissa Borges 💻 (Em Desenvolvimento)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue?style=for-the-badge" alt="Status Em Desenvolvimento">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge">
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black" alt="GSAP Badge">
</p>

<p align="center">
  <a href="#-descrição">Descrição</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-destaques-técnicos">Destaques</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-roadmap-futuro">Roadmap Futuro</a>
</p>

---

## 📌 Descrição

Este é o repositório do **Portfólio Pessoal de Marissa Borges**, desenvolvido em HTML, CSS e JavaScript puros com foco em animações fluidas, interatividade e apresentação visual de projetos em Python, desenvolvimento web e Inteligência Artificial.

Atualmente o projeto encontra-se em desenvolvimento ativo, com a hero animada, o carrossel de tecnologias, o chat interativo em mockup de smartphone e a galeria de projetos estruturados, faltando apenas substituir os projetos de demonstração pelos projetos reais e finalizar a seção de contato.

---

## 🚀 Funcionalidades

### Funcionalidades Atuais

- **Seção Hero com Parallax:** Animações de entrada orquestradas com `gsap.timeline()`, texto de fundo em grande escala com efeito parallax via `ScrollTrigger` e navegação suave para os projetos.
- **Carrossel Infinito de Tecnologias:** Faixa contínua apresentando a stack principal (`Python`, `Django`, `LangChain`, `HuggingFace`, `HTML`, `CSS` e `OpenAI API`).
- **Seção Sobre com Chat Interativo (Phone Mockup):** Interface de conversa dentro de um mockup de smartphone com botões de tópicos interativos e suporte a modo tela cheia em dispositivos móveis.
- **Vitrine de Projetos com Carrossel por Card:** Cartões de projeto contendo carrossel de imagens interno com indicadores, tags de tecnologias e link para acesso.
- **Identidade Visual Documentada:** Design system próprio documentado em `design-system/borges-portfolio/MASTER.md`.

### Funcionalidades Planejadas

- **Projetos Reais:** Substituição dos cards de demonstração pelos projetos publicados no GitHub com capturas reais e links diretos.
- **Seção de Contato Completa:** Formulário de contato e links diretos para GitHub, LinkedIn e e-mail.
- **Alternância de Idioma (PT-BR / EN):** Suporte bilíngue na interface.

---

## 🔒 Destaques Técnicos

- **Animações de Alta Performance com GSAP:** Uso combinado de `GSAP`, `ScrollTrigger` e `Draggable` para entradas escalonadas, parallax vinculado ao scroll e interações táteis.
- **Zero Frameworks Pesados:** Construído em HTML5, CSS3 e JavaScript vanilla, garantindo leveza e controle total sobre layout e animações.
- **Tipografia e Iconografia:** Combinação das fontes `Inter` e `JetBrains Mono` (Google Fonts) com ícones vetoriais do **Phosphor Icons** e SVGs locais em `src/icons/`.
- **Design System Estruturado:** Tokens de cores, tipografia, espaçamentos e sombras formalizados em `design-system/borges-portfolio/MASTER.md`.

---

## 📍 Como Executar

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari)
- [Python 3](https://www.python.org/downloads/) ou [Node.js](https://nodejs.org/) (opcional, para servidor local)
- [Git](https://git-scm.com/)

### Clonando o Repositório

```bash
# Clone o projeto para a sua máquina local
git clone https://github.com/MarissaBorges/portfolio.git

# Entre no diretório do projeto
cd portfolio
```

### Iniciando o Projeto

Você pode abrir `index.html` diretamente no navegador ou subir um servidor HTTP local:

```bash
# Servindo localmente com Python
python3 -m http.server 8080
```

Depois, acesse `http://localhost:8080` no navegador.

---

## 📚 Documentação

- [Design System Master (`design-system/borges-portfolio/MASTER.md`)](design-system/borges-portfolio/MASTER.md)

---

## 🗺️ Roadmap Futuro

- [ ] Substituir os cards de exemplo pelos projetos reais (OROS, GitHermes, Tallenn, Signa, Help na Escolha, NeoGestão).
- [ ] Implementar a seção **Contact** com links sociais e canal direto de mensagem.
- [ ] Revisar responsividade completa em dispositivos móveis e tablets.
- [ ] Publicar o portfólio em produção (GitHub Pages / Vercel).

---

## 🤝 Colaboradores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MarissaBorges">
        <img src="https://github.com/MarissaBorges.png?size=100" width="100px;" alt="Foto de Marissa Borges"/><br>
        <sub>
          <b>Marissa Borges</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

---

## 📫 Como Contribuir

Sugestões e melhorias são sempre bem-vindas!

1. Faça um **Fork** do projeto.
2. Crie uma nova branch para sua Feature (`git checkout -b feature/AmazingFeature`).
3. Faça o **Commit** de suas mudanças (`git commit -m 'Add some AmazingFeature'`).
4. Faça o **Push** da sua branch (`git push origin feature/AmazingFeature`).
5. Abra um **Pull Request**.
