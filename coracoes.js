/**
 * Módulo de Animação de Corações
 * Cria e gerencia efeitos visuais de corações animados
 */

// Configurações globais
const CoracoesConfig = {
    // Limite de corações simultâneos para evitar problemas de performance
    maxCoracoesSimultaneos: 100,
    // Contador de corações ativos
    coracoesAtivos: 0,
    // Flag para detectar se estamos em dispositivo móvel (para otimização)
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    // Emojis de corações que podem ser usados aleatoriamente
    emojis: ["💖", "💕", "💗", "💓", "❤️", "💘"]
  };
  
  /**
   * Cria um coração em uma posição específica ou aleatória
   * @param {number} x - Posição X do coração (opcional)
   * @param {number} y - Posição Y do coração (opcional)
   * @param {number} tamanho - Tamanho do coração em pixels (padrão: 20)
   * @param {number} duracao - Duração da animação em ms (padrão: 2000)
   * @param {string} emoji - Emoji específico para usar (opcional)
   * @returns {HTMLElement} - Elemento DOM do coração criado
   */
  function criarCoracao(x, y, tamanho = 20, duracao = 2000, emoji = null) {
    // Verificar limite de corações para performance
    if (CoracoesConfig.coracoesAtivos >= CoracoesConfig.maxCoracoesSimultaneos) {
      return null;
    }
    
    // Incrementar contador
    CoracoesConfig.coracoesAtivos++;
    
    // Criar elemento do coração
    const coracao = document.createElement("div");
    coracao.className = "heart";
    
    // Seleciona um emoji aleatório se não for especificado
    coracao.innerText = emoji || CoracoesConfig.emojis[Math.floor(Math.random() * CoracoesConfig.emojis.length)];
    
    // Configurar estilo
    coracao.style.position = "absolute";
    coracao.style.fontSize = `${tamanho}px`;
    coracao.style.color = `hsl(${330 + Math.random() * 30}, ${85 + Math.random() * 15}%, ${65 + Math.random() * 15}%)`;
    coracao.style.pointerEvents = "none";
    coracao.style.zIndex = "100";
    
    // Aplicar efeito de rotação aleatória
    const rotacao = Math.random() * 40 - 20;
    coracao.style.transform = `rotate(${rotacao}deg)`;
    
    // Configurar posição
    if (x === undefined || y === undefined) {
      coracao.style.left = Math.random() * window.innerWidth + "px";
      coracao.style.top = (window.innerHeight - 30) + "px";
    } else {
      coracao.style.left = `${x}px`;
      coracao.style.top = `${y}px`;
    }
    
    // Adicionar ao DOM
    document.body.appendChild(coracao);
    
    // Otimizar animação para dispositivos móveis
    const distanciaY = CoracoesConfig.isMobile ? -70 : -100;
    const opacidadeInicial = Math.min(1, Math.max(0.7, Math.random() * 0.3 + 0.7));
    
    // Animar o coração subindo
    const animacao = coracao.animate(
      [
        { transform: `rotate(${rotacao}deg) translateY(0)`, opacity: opacidadeInicial },
        { 
          transform: `rotate(${rotacao + (Math.random() * 20 - 10)}deg) translateY(${distanciaY}px) translateX(${Math.random() * 30 - 15}px)`, 
          opacity: 0 
        }
      ],
      {
        duration: CoracoesConfig.isMobile ? duracao * 0.8 : duracao,
        easing: "ease-out",
        fill: "forwards"
      }
    );
    
    // Remover do DOM após a animação
    animacao.onfinish = () => {
      coracao.remove();
      CoracoesConfig.coracoesAtivos--; // Decrementar contador
    };
    
    // Fallback para browsers que não suportam onfinish
    setTimeout(() => {
      if (document.body.contains(coracao)) {
        coracao.remove();
        CoracoesConfig.coracoesAtivos--; // Decrementar contador
      }
    }, duracao + 100);
    
    return coracao;
  }
  
  /**
   * Cria uma chuva de corações na parte inferior da tela
   * @param {number} quantidade - Número de corações para criar (padrão: 30)
   * @param {number} intervalo - Intervalo entre cada coração em ms (padrão: 50)
   * @param {Object} opcoesPersonalizadas - Opções adicionais (opcional)
   */
  function chuvaDeCoracoes(quantidade = 30, intervalo = 50, opcoesPersonalizadas = {}) {
    // Em dispositivos móveis, reduzir quantidade para melhor performance
    const qtdAjustada = CoracoesConfig.isMobile ? Math.floor(quantidade * 0.6) : quantidade;
    
    // Aplicar opções personalizadas
    const opcoes = {
      tamanhoMin: opcoesPersonalizadas.tamanhoMin || 15,
      tamanhoMax: opcoesPersonalizadas.tamanhoMax || 25,
      duracaoMin: opcoesPersonalizadas.duracaoMin || 1500,
      duracaoMax: opcoesPersonalizadas.duracaoMax || 2500,
      emoji: opcoesPersonalizadas.emoji || null
    };
    
    // Criar corações com intervalos
    for (let i = 0; i < qtdAjustada; i++) {
      setTimeout(() => {
        criarCoracao(
          Math.random() * window.innerWidth,
          window.innerHeight - 10,
          Math.random() * (opcoes.tamanhoMax - opcoes.tamanhoMin) + opcoes.tamanhoMin,
          Math.random() * (opcoes.duracaoMax - opcoes.duracaoMin) + opcoes.duracaoMin,
          opcoes.emoji
        );
      }, i * intervalo);
    }
  }
  
  /**
   * Cria corações que emanam de um elemento quando ocorre um evento
   * @param {HTMLElement} elemento - Elemento que vai emitir os corações
   * @param {string} evento - Nome do evento (ex: 'click', 'mouseover')
   * @param {number} quantidade - Número de corações (padrão: 5)
   * @param {Object} opcoes - Opções adicionais (opcional)
   */
  function coracoesDoElemento(elemento, evento = 'click', quantidade = 5, opcoes = {}) {
    if (!elemento) return;
    
    elemento.addEventListener(evento, (e) => {
      // Determinar posição do elemento
      const rect = elemento.getBoundingClientRect();
      const centerX = rect.left + rect.width/2;
      const centerY = rect.top + rect.height/2;
      
      // Ajustar quantidade para dispositivos móveis
      const qtdAjustada = CoracoesConfig.isMobile ? Math.max(1, Math.floor(quantidade * 0.7)) : quantidade;
      
      // Definir opções
      const spreadX = opcoes.spreadX || 40;
      const spreadY = opcoes.spreadY || 40;
      const intervalo = opcoes.intervalo || 100;
      const tamanho = opcoes.tamanho || 20;
      
      // Criar corações
      for (let i = 0; i < qtdAjustada; i++) {
        setTimeout(() => {
          criarCoracao(
            centerX + (Math.random() * spreadX - spreadX/2),
            centerY + (Math.random() * spreadY - spreadY/2),
            Math.random() * 10 + tamanho,
            Math.random() * 500 + 1500,
            opcoes.emoji
          );
        }, i * intervalo);
      }
      
      // Evitar propagação se especificado
      if (opcoes.stopPropagation) {
        e.stopPropagation();
      }
    });
  }
  
  /**
   * Cria corações que seguem o movimento do mouse
   * @param {Object} opcoes - Opções de configuração
   */
  function coracoesComMouse(opcoes = {}) {
    const config = {
      chance: opcoes.chance || 0.03,
      intervaloMinimo: opcoes.intervaloMinimo || 100, // Evitar muitos corações
      tamanhoMin: opcoes.tamanhoMin || 15,
      tamanhoMax: opcoes.tamanhoMax || 25,
      emoji: opcoes.emoji || null
    };
    
    let ultimoCoracao = 0;
    
    document.addEventListener('mousemove', (e) => {
      const agora = Date.now();
      
      // Verificar se já passou o intervalo mínimo e se a chance aleatória foi satisfeita
      if (agora - ultimoCoracao > config.intervaloMinimo && Math.random() < config.chance) {
        ultimoCoracao = agora;
        
        criarCoracao(
          e.clientX,
          e.clientY,
          Math.random() * (config.tamanhoMax - config.tamanhoMin) + config.tamanhoMin,
          Math.random() * 1000 + 1500,
          config.emoji
        );
      }
    });
  }
  
  /**
   * Cria um efeito de corações para transição entre páginas
   * @param {string} url - URL para onde redirecionar
   * @param {number} quantidade - Quantidade de corações (padrão: 30)
   * @param {number} tempoEspera - Tempo antes de redirecionar em ms (padrão: 1500)
   */
  function transicaoComCoracoes(url, quantidade = 30, tempoEspera = 1500) {
    // Criar efeito intenso de corações
    chuvaDeCoracoes(quantidade, 30, {
      tamanhoMin: 20,
      tamanhoMax: 35,
      duracaoMin: 1800,
      duracaoMax: 2800
    });
    
    // Adicionar fade-out para suavizar transição
    const fadeOut = document.createElement('div');
    fadeOut.style.position = 'fixed';
    fadeOut.style.top = '0';
    fadeOut.style.left = '0';
    fadeOut.style.width = '100%';
    fadeOut.style.height = '100%';
    fadeOut.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    fadeOut.style.transition = 'background-color 1.2s ease';
    fadeOut.style.zIndex = '9999';
    fadeOut.style.pointerEvents = 'none';
    document.body.appendChild(fadeOut);
    
    // Iniciar fade-out
    setTimeout(() => {
      fadeOut.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }, 100);
    
    // Redirecionar após efeito
    setTimeout(() => {
      window.location.href = url;
    }, tempoEspera);
  }
  
  /**
   * Ajusta a configuração máxima de corações simultâneos
   * @param {number} valor - Novo valor máximo
   */
  function ajustarMaximoCoracoesSimultaneos(valor) {
    if (typeof valor === 'number' && valor > 0) {
      CoracoesConfig.maxCoracoesSimultaneos = valor;
    }
  }
  
  /**
   * Cria um coração pulsante em uma posição específica
   * @param {number} x - Posição X
   * @param {number} y - Posição Y
   * @param {Object} opcoes - Opções adicionais
   * @returns {HTMLElement} - Elemento do coração
   */
  function criarCoracaoPulsante(x, y, opcoes = {}) {
    const coracao = criarCoracao(x, y, opcoes.tamanho || 30, opcoes.duracao || 5000, opcoes.emoji);
    
    if (!coracao) return null;
    
    // Adicionar animação de pulsação
    coracao.animate(
      [
        { transform: 'scale(1)', opacity: 0.7 },
        { transform: 'scale(1.2)', opacity: 0.9 },
        { transform: 'scale(1)', opacity: 0.7 }
      ],
      {
        duration: opcoes.velocidadePulso || 800,
        iterations: Math.floor((opcoes.duracao || 5000) / (opcoes.velocidadePulso || 800)),
        easing: 'ease-in-out'
      }
    );
    
    return coracao;
  }
  
  /**
   * Cria um círculo de corações ao redor de um ponto
   * @param {number} x - Posição X central
   * @param {number} y - Posição Y central
   * @param {number} quantidade - Número de corações
   * @param {Object} opcoes - Opções adicionais
   */
  function circuloDeCoracoes(x, y, quantidade = 8, opcoes = {}) {
    const raio = opcoes.raio || 50;
    
    for (let i = 0; i < quantidade; i++) {
      const angulo = (i / quantidade) * Math.PI * 2;
      const posX = x + Math.cos(angulo) * raio;
      const posY = y + Math.sin(angulo) * raio;
      
      setTimeout(() => {
        criarCoracao(posX, posY, opcoes.tamanho || 20, opcoes.duracao || 2000, opcoes.emoji);
      }, i * (opcoes.intervalo || 100));
    }
  }
  
  // Manter compatibilidade com código existente que pode usar a função com nome incorreto
  const chuvaDeCorcaoes = chuvaDeCoracoes;
  
  // Exportar todas as funções
  window.criarCoracao = criarCoracao;
  window.chuvaDeCoracoes = chuvaDeCoracoes;
  window.chuvaDeCorcaoes = chuvaDeCorcaoes; // Para compatibilidade
  window.coracoesDoElemento = coracoesDoElemento;
  window.coracoesComMouse = coracoesComMouse;
  window.transicaoComCoracoes = transicaoComCoracoes;
  window.ajustarMaximoCoracoesSimultaneos = ajustarMaximoCoracoesSimultaneos;
  window.criarCoracaoPulsante = criarCoracaoPulsante;
  window.circuloDeCoracoes = circuloDeCoracoes;