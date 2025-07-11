document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('nextBtn');
  const modal = document.getElementById('aboutModal');
  const closeBtn = document.querySelector('.close-btn');
  const typewriterText = document.getElementById('typewriterText');

  const fullText = "This project is an interactive relaxation experience designed to help users unwind through dynamic visuals and soothing animations. Explore different relaxation modes by selecting the buttons, each offering a unique way to de-stress. Created with love and creativity by the team at [Your Project Name].";

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
      e.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
      typewriterText.textContent = fullText; // Show full text
      typewriterText.parentElement.style.borderRight = 'none'; // Remove cursor
      isTyping = false; // Stop animation
    }
  });

  function startTypewriter() {
    if (!isTyping) { // Only start if not already typing
      isTyping = true;
      typewriterText.textContent = '';
      typewriterText.parentElement.style.borderRight = '0.15em solid #ffc300';
      index = 0;
      type();
    }
  }

  function type() {
    if (index < fullText.length && isTyping) {
      typewriterText.textContent += fullText.charAt(index);
      index++;
      setTimeout(type, 50);
    } else if (index >= fullText.length) {
      isTyping = false; // Stop typing when complete
      typewriterText.parentElement.style.borderRight = 'none'; // Remove cursor
    }
  }

  function resetTypewriter() {
    isTyping = false;
    typewriterText.textContent = '';
    typewriterText.parentElement.style.borderRight = 'none';
  }
});