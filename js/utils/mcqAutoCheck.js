
/* 
1) Purpose: Handles MCQ button logic with feedback
2) Features: Checks correct/incorrect and disables buttons
3) Dependencies: None
4) Related: Used in mixlingo.js, echoexpedition.js, etc.
5) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
6) Timestamp: 2025-05-31 18:55 | File: js/utils/mcqAutoCheck.js
*/

export function autoAttachMCQEvents(container, callback) {
  const buttons = container.querySelectorAll('.mcqOption');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';

      // Visual feedback
      buttons.forEach(b => {
        b.disabled = true;
        if (b.getAttribute('data-correct') === 'true') {
          b.classList.add('correct');
        } else {
          b.classList.add('incorrect');
        }
      });

      if (typeof callback === 'function') {
        callback(isCorrect, btn.textContent);
      }
    });
  });
}
