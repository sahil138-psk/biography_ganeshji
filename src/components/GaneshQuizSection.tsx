import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Printer,
  Share2
} from 'lucide-react';
import { GANESH_QUIZ_QUESTIONS } from '../data/quizData';
import { playTempleBell, playCymbal } from '../utils/audioSynthesizer';

export const GaneshQuizSection: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [devoteeName, setDevoteeName] = useState('Devotee of Bappa');
  const [isEditingName, setIsEditingName] = useState(false);

  const currentQ = GANESH_QUIZ_QUESTIONS[currentQIndex];
  const hasAnsweredCurrent = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentQIndex < GANESH_QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;
    GANESH_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / GANESH_QUIZ_QUESTIONS.length) * 100);

  return (
    <section id="ganesh-quiz-section" className="w-full max-w-4xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-950 text-xs font-bold tracking-wide uppercase">
          <Award className="w-4 h-4 text-yellow-600" />
          <span>ज्ञान परीक्षा व प्रमाणपत्र (Sacred Knowledge Quiz)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-serif-sacred text-stone-900 tracking-tight">
          Test Your Knowledge & Earn Bappa’s Certificate
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          Answer 10 sacred questions on Lord Ganesha’s biography, Ashtavinayak temples, and Purana lore.
          Score 70%+ to unlock the Devotee Certificate of Excellence!
        </p>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 pb-3 border-b border-amber-100">
            <span>
              Question {currentQIndex + 1} of {GANESH_QUIZ_QUESTIONS.length}
            </span>
            <span className="text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Score so far: {score}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold font-serif-sacred text-stone-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;
              const hasAnswered = hasAnsweredCurrent;

              let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-amber-50 hover:border-amber-300';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-stone-300 text-stone-600 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box upon answering */}
          {hasAnsweredCurrent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-700 space-y-1"
            >
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scriptural Explanation</span>
              </div>
              <p>{currentQ.explanation}</p>
            </motion.div>
          )}

          {/* Next / Finish Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow ${
                hasAnsweredCurrent
                  ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {currentQIndex < GANESH_QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Final Results 🏆'}
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS & CERTIFICATE VIEW */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-2xl">
              {percentage >= 70 ? '🏆' : '🙏'}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-sacred text-stone-900">
              {percentage >= 70 ? 'Splendid Devotion! You Passed!' : 'Good Effort, Blessed Devotee!'}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
              You scored <strong>{score} out of {GANESH_QUIZ_QUESTIONS.length}</strong> ({percentage}%).
              {percentage >= 70
                ? ' You have earned the Sacred Certificate of Ganesha Wisdom below.'
                : ' Review the biography and Ashtavinayak sections and try again!'}
            </p>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* OFFICIAL CERTIFICATE OF EXCELLENCE */}
          {percentage >= 70 && (
            <div className="relative p-8 sm:p-12 rounded-3xl bg-[#fffef5] border-8 border-double border-amber-600 shadow-2xl text-center space-y-6 overflow-hidden">
              {/* Decorative Corner Emblems */}
              <div className="absolute top-3 left-3 text-amber-700 text-xl">ॐ</div>
              <div className="absolute top-3 right-3 text-amber-700 text-xl">ॐ</div>
              <div className="absolute bottom-3 left-3 text-amber-700 text-xl">ॐ</div>
              <div className="absolute bottom-3 right-3 text-amber-700 text-xl">ॐ</div>

              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase font-bold text-amber-700">
                  ॥ श्री गणेशाय नमः ॥
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif-sacred font-bold text-amber-950">
                  Certificate of Ganesha Vidya & Bhakti
                </h4>
                <div className="w-32 h-0.5 bg-amber-500 mx-auto" />
              </div>

              <p className="text-xs sm:text-sm text-stone-600">
                This sacred certificate of honor is proudly presented to
              </p>

              {/* Devotee Editable Name */}
              <div className="flex items-center justify-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    className="text-xl sm:text-2xl font-bold font-serif-sacred text-amber-900 border-b-2 border-amber-600 focus:outline-none text-center bg-transparent"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingName(true)}
                    className="text-2xl sm:text-3xl font-black font-serif-sacred text-amber-900 cursor-pointer hover:underline"
                    title="Click to edit your name"
                  >
                    {devoteeName} ✎
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
                For successfully mastering the Sacred Biography, Purana Lore, and 8 Ashtavinayak Temples of
                Bhagwan Ganpati Bappa with an exemplary score of <strong>{score}/10 ({percentage}%)</strong>.
              </p>

              {/* Certificate Golden Seal Stamp */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-semibold text-stone-500">
                <div>
                  <div className="font-devanagari text-base text-amber-800 font-bold">
                    मोरया गोसावी प्रसन्न
                  </div>
                  <div>Shree Ashtavinayak Peeth</div>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-amber-500 flex flex-col items-center justify-center bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-950 shadow-md">
                  <span className="text-[10px] uppercase font-bold">Official</span>
                  <span className="text-xs font-black">BHAKT</span>
                  <span className="text-[9px]">SEAL</span>
                </div>

                <div>
                  <div className="font-bold text-stone-700">{new Date().toLocaleDateString()}</div>
                  <div>Certification Date</div>
                </div>
              </div>

              {/* Print Action */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
