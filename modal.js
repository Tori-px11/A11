document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('nextBtn');
  const modal = document.getElementById('aboutModal');
  const closeBtn = document.querySelector('.close-btn');
  const typewriterText = document.getElementById('typewriterText');

  const fullText = `My project — A11 
    Is there anyone more important than yourself?

    When you feel tired or low — remember yourself.
    Put yourself first.

    A is the first letter of the alphabet.
    Just like you should be first for yourself.

    11 is you and your needs.
    Two ones side by side — you + what matters to you.

    A11 is a reminder:
    Take care of yourself. You come first.
`;

  let index = 0;
  let isTyping = false;

  nextBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    startTypewriter();
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetTypewriter();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      resetTypewriter();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && modal.style.display === 'flex') {
      e.preventDefault();
      typewriterText.innerHTML = fullText.replace(/\n/g, '<br>');
      typewriterText.parentElement.style.borderRight = 'none';
      isTyping = false;
    }
  });

  function startTypewriter() {
    if (!isTyping) {
      isTyping = true;
      typewriterText.innerHTML = '';
      typewriterText.parentElement.style.borderRight = '0.15em solid #ffc300';
      index = 0;
      type();
    }
  }

  function type() {
    if (index < fullText.length && isTyping) {
      const currentChar = fullText.charAt(index);
      if (currentChar === '\n') {
        typewriterText.innerHTML += '<br>';
      } else {
        typewriterText.innerHTML += currentChar;
      }
      index++;
      setTimeout(type, 50);
    } else if (index >= fullText.length) {
      isTyping = false;
      typewriterText.parentElement.style.borderRight = 'none';
    }
  }

  function resetTypewriter() {
    isTyping = false;
    typewriterText.innerHTML = '';
    typewriterText.parentElement.style.borderRight = 'none';
  }
});
