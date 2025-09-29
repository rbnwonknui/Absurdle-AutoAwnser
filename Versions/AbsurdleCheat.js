console.clear();
console.log("By rbnwonknui");

// Função playAudio corrigida
function playAudio(url) {
  const audio = new Audio(url);
  audio.play().catch(e => console.log('Audio play failed:', e));
}

playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');

(function() {
  let isRunning = false;
  let currentAttempt = 0;
  let finalAnswer = null;
  let gameStartTime = Date.now();
  
  const OPTIMAL_STARTERS = [
      'ADORE', 'AROSE', 'AUDIO', 'STARE', 'SLATE', 'CRANE', 'ROAST', 
      'TEARS', 'RATES', 'TALES', 'LEAST', 'STEAL', 'EARLS'
  ];
  
  function createNotificationStyles() {
      if (document.getElementById('abs-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'abs-styles';
      style.textContent = `
          .abs-notif{position:fixed;top:-120px;right:20px;background:rgba(15,23,42,.95);
          backdrop-filter:blur(20px);border:1px solid rgba(51,65,85,.6);border-radius:12px;
          padding:12px 16px;box-shadow:0 20px 40px rgba(0,0,0,.4);width:280px;
          transition:all .3s cubic-bezier(.4,0,.2,1);z-index:10000;
          font:600 13px -apple-system,sans-serif;color:#f8fafc;margin-bottom:8px}
          .abs-notif.show{top:20px;transform:translateY(0)}
          .abs-header{display:flex;align-items:center}
          .abs-icon{width:32px;height:32px;border-radius:8px;display:flex;
          align-items:center;justify-content:center;margin-right:10px;font-size:16px;
          box-shadow:0 4px 12px rgba(139,92,246,.3)}
          .abs-icon.try{background:linear-gradient(135deg,#9C27B0,#7B1FA2)}
          .abs-icon.ok{background:linear-gradient(135deg,#4CAF50,#388E3C)}
          .abs-icon.info{background:linear-gradient(135deg,#2196F3,#1976D2)}
          .abs-content h4{margin:0;font-size:13px;color:#f8fafc}
          .abs-content p{margin:2px 0 0;font-size:11px;color:#94a3b8}
          .abs-close{position:absolute;top:6px;right:6px;background:0;border:0;
          color:#64748b;cursor:pointer;padding:2px;border-radius:4px;width:20px;height:20px;
          display:flex;align-items:center;justify-content:center;font-size:14px}
          .abs-close:hover{background:rgba(51,65,85,.5);color:#f8fafc}
          .abs-bar{position:absolute;bottom:0;left:0;height:2px;
          background:linear-gradient(90deg,#8b5cf6,#7c3aed);border-radius:0 0 12px 12px;
          animation:progress 3s linear forwards}
          @keyframes progress{from{width:100%}to{width:0%}}
      `;
      document.head.appendChild(style);
  }

  function showNotif(title, subtitle, type = 'info') {
      createNotificationStyles();
      
      const icons = { info: '📊', try: '🎮', ok: '🏆' };
      const notif = document.createElement('div');
      notif.className = 'abs-notif';
      notif.innerHTML = `
          <button class="abs-close" onclick="this.parentElement.remove()">×</button>
          <div class="abs-header">
              <div class="abs-icon ${type}">${icons[type]}</div>
              <div class="abs-content">
                  <h4>${title}</h4>
                  <p>${subtitle}</p>
              </div>
          </div>
          <div class="abs-bar"></div>
      `;
      
      document.body.appendChild(notif);
      setTimeout(() => notif.classList.add('show'), 50);
      setTimeout(() => {
          if (notif.parentElement) {
              notif.style.opacity = '0';
              setTimeout(() => notif.remove(), 300);
          }
      }, 3000);
  }

  function selectOptimalWord(secretWords, attempt) {
      if (secretWords.length === 1) return secretWords[0];
      if (secretWords.length <= 3) return secretWords[0];
      
      switch (attempt) {
          case 1:
              return OPTIMAL_STARTERS[Math.floor(Math.random() * 3)];
          case 2:
              return secretWords[Math.floor(secretWords.length * 0.4)];
          case 3:
              return secretWords[Math.floor(secretWords.length * 0.2)];
          default:
              return secretWords[0];
      }
  }

  function typeWord(word, pressEnter = false) {
      const baseDelay = 80;
      
      word.split('').forEach((letter, i) => {
          setTimeout(() => {
              document.dispatchEvent(new KeyboardEvent('keydown', {
                  key: letter,
                  code: `Key${letter}`,
                  bubbles: true,
                  cancelable: true
              }));
          }, i * baseDelay);
      });

      if (pressEnter) {
          setTimeout(() => {
              const enterBtn = document.evaluate(
                  '/html/body/div/div/div/div[2]/div[4]/button[2]',
                  document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
              ).singleNodeValue;
              
              if (enterBtn?.disabled === false) {
                  enterBtn.click();
                  return;
              }
              
              const buttons = document.querySelectorAll('button');
              for (const btn of buttons) {
                  const text = btn.textContent.toLowerCase();
                  if ((text.includes('enter') || text === 'enviar') && !btn.disabled) {
                      btn.click();
                      break;
                  }
              }
          }, word.length * baseDelay + 1);
      }
  }

  function makeGuess(word) {
      if (!isRunning) return;
      
      currentAttempt++;
      const elapsed = ((Date.now() - gameStartTime) / 1000).toFixed(1);
      
      showNotif(
          `Jogada ${currentAttempt}`,
          `${word} • ${elapsed}s decorridos`,
          'try'
      );
      
      typeWord(word, true);
  }

  function startOptimizedGame() {
      if (isRunning) {
          showNotif('Já executando', 'Sistema já ativo', 'info');
          return;
      }

      isRunning = true;
      currentAttempt = 0;
      gameStartTime = Date.now();
      
      showNotif('Sistema iniciado', 'Absurdle Auto-Solver v2.0', 'info');

      const originalLog = console.log;
      console.log = function(...args) {
          originalLog.apply(console, args);

          if (args[0] === 'secret words:' && Array.isArray(args[1]) && isRunning) {
              const secretWords = args[1];
              const elapsed = ((Date.now() - gameStartTime) / 1000).toFixed(1);
              window.currentSecrets = secretWords;

              if (secretWords.length === 1) {
                  finalAnswer = secretWords[0];
                  
                  showNotif(
                      'Resolvido!',
                      `${finalAnswer} • ${elapsed}s • ${currentAttempt} jogadas`,
                      'ok'
                  );

                  isRunning = false;
                  
                  setTimeout(() => typeWord(finalAnswer, false), 1500);
                  return;
              }

              const reduction = ((secretWords.length / 2309) * 100).toFixed(1);
              showNotif(
                  'Progresso',
                  `${secretWords.length} palavras • ${reduction}% restante`,
                  'info'
              );

              if (isRunning) {
                  setTimeout(() => {
                      if (isRunning) {
                          const nextWord = selectOptimalWord(secretWords, currentAttempt + 1);
                          makeGuess(nextWord);
                      }
                  }, 1800);
              }
          }
      };

      setTimeout(() => {
          if (isRunning) {
              const firstWord = OPTIMAL_STARTERS[0];
              makeGuess(firstWord);
          }
      }, 1000);
  }

  function stopGame() {
      if (!isRunning) {
          showNotif('Não está executando', 'Sistema inativo', 'info');
          return;
      }
      
      isRunning = false;
      const elapsed = ((Date.now() - gameStartTime) / 1000).toFixed(1);
      showNotif('Parado', `Interrompido após ${elapsed}s`, 'info');
  }

  window.startAbsurdleOptimized = startOptimizedGame;
  window.stopAbsurdleOptimized = stopGame;
  window.absurdleStats = () => ({
      running: isRunning,
      attempts: currentAttempt,
      elapsed: isRunning ? ((Date.now() - gameStartTime) / 1000).toFixed(1) : 0,
      answer: finalAnswer,
      remaining: window.currentSecrets?.length || 0
  });

  showNotif('Carregado!', 'Iniciando em 5 segundos...', 'info');
  setTimeout(startOptimizedGame, 5000);

})();
