
/* 
1) Purpose: Core logic for MixLingo game — question loading, switching, validation
2) Part of: Modular MixLingo (logic.js)
3) Depends on: state.js, renderer.js, modeHelpers.js
4) MIT License: https://github.com/AllieBaig/LingoQuest2/blob/main/LICENSE
5) Timestamp: 2025-06-02 00:10 | File: js/modes/mixlingo/logic.js
*/

import { questionPool, currentQuestion, answeredIDs, currentAnswerLang, difficulty } from './state.js';
import { safeLoadQuestions, shuffleArray, verifyQuestionStructure } from '../../modeHelpers.js';
import { renderQuestion, renderCompletionScreen } from './renderer.js';
import { logEvent } from '../../gameUtils.js';

let maxTries = 40;

export async function loadNextQuestion() {
  if (answeredIDs.size >= questionPool.length) {
    return renderCompletionScreen();
  }

  let tries = 0;
  let question;

  do {
    question = questionPool[Math.floor(Math.random() * questionPool.length)];
    tries++;
    if (tries >= maxTries) {
      console.warn('Too many tries, skipping...');
      return renderCompletionScreen();
    }
  } while (!question || answeredIDs.has(question.id));

  const required = ['id', 'sentence', 'answers', 'correct'];
  if (!verifyQuestionStructure(question, required)) {
    answeredIDs.add(question?.id);
    return loadNextQuestion();
  }

  currentQuestion.id = question.id;
  currentQuestion.sentence = question.sentence;
  currentQuestion.answers = question.answers;
  currentQuestion.correct = question.correct;

  renderQuestion(currentQuestion, currentAnswerLang);
}

document.addEventListener('answerLangChanged', async (e) => {
  const newLang = e.detail;
  currentAnswerLang.value = newLang;

  if (currentQuestion?.id) {
    const path = `lang/mixlingo-${newLang}.json`;
    const freshSet = await safeLoadQuestions(path);
    const match = freshSet.find(q => q.id === currentQuestion.id);

    if (match) {
      currentQuestion.answers = match.answers;
      currentQuestion.correct = match.correct;
      renderQuestion(currentQuestion, newLang);
    } else {
      console.warn(`Translation not found for question ID ${currentQuestion.id} in ${newLang}`);
    }
  }
});
