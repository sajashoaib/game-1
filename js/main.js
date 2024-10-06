document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-btn");
  const buttonAudio = document.getElementById("button-audio");
  const levelOne = document.getElementById("question-btn1");
  const quizImage = document.getElementById("quiz-image");
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");
  const clapSound = document.getElementById("clap-sound");
  const whatDoing = document.getElementById("whatdoings");
  const startOverlay = document.getElementById("startOverlay");
  const confetti = document.getElementById("confetti");
  const scoreDisplay = document.getElementById("score-display");
  const frame1 = document.querySelector(".frame1");
  const frame2 = document.querySelector(".frame2");
  const englishdragaudio = document.getElementById("englishdragaudio");
  const arbicdragaudio = document.getElementById("arbicdragaudio");
  const events = [
    "click",
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "resize",
  ];
  let currentQuestion = 0;
  let answeredCorrectly = false;
  let score = 0;
  let isFirstQuestion = true; // Track if it's the first question
  let hasVisitedPage2 = false;

  // ****************************************************************************

  function showSection(id) {
    // Hide all sections
    var sections = document.querySelectorAll(".section");
    console.log("Trying to show section with ID:", id); // This will help you debug

    sections.forEach(function (section) {
      section.classList.remove("active");
      section.style.display = "none"; // Hide sections
    });

    // Show the section with the matching id
    var activeSection = document.getElementById(id);
    if (activeSection) {
      activeSection.classList.add("active");
      activeSection.style.display = "block"; // Show active section
      console.log("Successfully showed section with ID:", id); // Debug log

      // Play "What are you doing?" sound only when entering 'page-2'
      if (id === "page-2" && whatDoing && !whatDoing.playing) {
        whatDoing.muted = false; // Unmute
        playSoundTwice(whatDoing); // Play the sound twice as needed
      }
      if (id === "page-3") {
        playAudioSequence(); // تشغيل الصوتين عند دخول الصفحة 3
      }
    }
  }

  // logic when click on play button
  if (startBtn) {
    startBtn.addEventListener("click", function (event) {
      event.preventDefault();

      // إضافة تأثير الضغط على الزر
      startBtn.style.transform = "scale(0.95)";
      setTimeout(() => {
        startBtn.style.transform = "scale(1)";
      }, 300);

      // تشغيل الصوت عند الضغط
      if (buttonAudio) {
        buttonAudio.muted = false;
        buttonAudio.play();
      }

      // إضافة كلاس لتفعيل الأنيميشن
      document.querySelector(".frame1").classList.add("animate-frame");
      document.querySelector(".frame2").classList.add("animate-frame");

      setTimeout(() => {
        showSection("page-2"); // الانتقال إلى section page-2 بعد 1.6 ثانية
      }, 1600);
    });
  }
  // ****************************************************************************
  //   logic when click on play agin button

  if (levelOne) {
    levelOne.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default anchor click behavior
      resetGame();
      // Remove the animation classes
      frame1.classList.remove("animate-frame");
      frame2.classList.remove("animate-frame");

      // Add the animation classes again after the reflow
      setTimeout(() => {
        frame1.classList.add("animate-frame");
        frame2.classList.add("animate-frame");
        // resetAllScores();
        currentQuestion = 0; // تأكد من ضبط المتغير على 0
        score = 0; // إعادة تعيين النقاط
        updateScore(); // تحديث عرض النقاط
        loadQuestion();

        // Delay the redirect until after the animation
        setTimeout(() => {
          showSection("page-2"); // Redirect after animation completes
        }, 1500); // Adjust the delay as needed to match the animation duration
      }, 100);
    });
  }
  // ****************************************************************************
  if (startOverlay) {
    startOverlay.addEventListener("click", function () {
      if (whatDoing && !whatDoing.playing) {
        // Ensure it's not already playing
        whatDoing.muted = false;
        playSoundTwice(whatDoing);
      }
      startOverlay.style.display = "none"; // Hide the overlay after interaction
    });
  }

  // ****************************************************************************
  // array have picture, voices, content of button option1, option2

  const quizData = [
    {
      image: "/image/boy-writing.png",
      correctOption: 1,
      sound: "/voices/what are you doing.mp3",
      options: ["doing my homework", "Watching TV"],
      sounds: [
        [
          "/voices/doing my homework.mp3",
          "/voices/good.mp3",
          "/voices/أحسنت.mp3",
        ],
        [
          "/voices/i am watching tv.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],
      ],
    },
    {
      image: "/image/tv.png",
      correctOption: 2,
      sound: "/voices/what are you doing.mp3",
      options: ["playing football", "Watching TV"],
      sounds: [
        [
          "/voices/i am playing football.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],
        [
          "/voices/i am watching tv.mp3",
          "/voices/Excellent.mp3",
          "/voices/ممتاز.mp3",
        ],
      ],
    },
    {
      image: "/image/snacks.png",
      correctOption: 1,
      sound: "/voices/what are you doing.mp3",
      options: ["eating snaks", "doing my homework"],
      sounds: [
        [
          "/voices/i am eating snaks.mp3",
          "/voices/brillient.mp3",
          "/voices/مبهر.mp3",
        ],
        [
          "/voices/doing my homework.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],
      ],
    },
    {
      image: "/image/karate.png",
      correctOption: 2,
      sound: "/voices/what are you doing.mp3",
      options: ["doing my homework", "doing Karate"],
      sounds: [
        [
          "/voices/doing my homework.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],

        ["/voices/doing karate.mp3", "/voices/great.mp3", "/voices/رائع.mp3"],
      ],
    },
    {
      image: "/image/boy-playing-footbal.png",
      correctOption: 1,
      sound: "/voices/what are you doing.mp3",
      options: ["playing Football", "eating Snaks"],
      sounds: [
        [
          "/voices/i am playing football.mp3",
          "/voices/Awesome.mp3",
          "/voices/مذهل.mp3",
        ],
        [
          "/voices/i am eating snaks.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],
      ],
    },
    {
      image: "/image/computergame.png",
      correctOption: 2,
      sound: "/voices/what are you doing.mp3",
      options: ["doing Karate", "Playing computer games"],
      sounds: [
        [
          "/voices/doing karate.mp3",
          "/voices/wrong, try again.mp3",
          "/voices/خطأ حاول مرة اخرى.mp3",
        ],
        [
          "/voices/i am playing computer game.mp3",
          "/voices/good.mp3",
          "/voices/أحسنت.mp3",
        ],
      ],
    },
  ];

  // ****************************************************************************

  // Event listeners for buttons option1, option2
  if (option1) {
    option1.addEventListener("click", function () {
      handleAnswer(1);
    });
  }

  if (option2) {
    option2.addEventListener("click", function () {
      handleAnswer(2);
    });
  }

  // ****************************************************************************
  // Function to play sound twice
  function playSoundTwice(audioElement, delay = 500) {
    let playCount = 0;
    audioElement.play(); // Play first time

    // After the audio ends, play it again
    audioElement.onended = function () {
      playCount++;
      if (playCount < 2) {
        setTimeout(() => {
          audioElement.play(); // Play the second time
        }, delay); // Delay between plays (if needed)
      }
    };
  }
  // ****************************************************************************

  // Function to load the current question
  function loadQuestion() {
    answeredCorrectly = false;

    // If it's the first question, skip the animation and delay sound until overlay is clicked
    if (isFirstQuestion) {
      const currentData = quizData[currentQuestion];

      // Load the image and options without animation
      if (quizImage) {
        quizImage.src = currentData.image;
      }
      if (option1 && option2) {
        option1.innerText = currentData.options[0]; // First option
        option2.innerText = currentData.options[1];
      }
      if (whatDoing) {
        whatDoing.src = "/voices/whatdoing.mp3"; // Ensure audio source is set
        whatDoing.load(); // Ensure the audio is loaded
      }

      startOverlay.style.display = "block"; // Show the overlay initially

      // Add event listener to the overlay to play sound after clicking it
      startOverlay.addEventListener("click", () => {
        startOverlay.style.display = "none"; // Hide the overlay after clicking

        setTimeout(() => {
          if (whatDoing) {
            whatDoing.muted = false; // Unmute in case it's muted
            whatDoing.play(); // Play the audio after clicking overlay
          }
        }, 500); // Small delay to ensure everything is ready before playing
      });

      isFirstQuestion = false; // After the first question, normal flow resumes
    } else {
      // Normal flow with animation for subsequent questions
      startOverlay.style.display = "block";

      // Load the new content but don't apply it yet
      const currentData = quizData[currentQuestion];
      const newImageSrc = currentData.image;
      const newOption1Text = currentData.options[0];
      const newOption2Text = currentData.options[1];

      // Ensure the audio source is ready
      if (whatDoing) {
        whatDoing.src = "/voices/whatdoing.mp3";
        whatDoing.load(); // Ensure the audio is loaded
      }

      // Remove the animation classes first to reset animations
      frame1.classList.remove("animate-frame");
      frame2.classList.remove("animate-frame");

      // Reapply the animation classes to start animation without clearing the old content
      setTimeout(() => {
        frame1.classList.add("animate-frame");
        frame2.classList.add("animate-frame");

        // Wait for the animation to finish before changing the content
        setTimeout(() => {
          // Update content after animation completes
          if (quizImage) {
            quizImage.src = newImageSrc; // Update the image after animation
          }
          if (option1 && option2) {
            option1.innerText = newOption1Text; // Update the first option
            option2.innerText = newOption2Text; // Update the second option
          }

          startOverlay.style.display = "none"; // Hide the overlay after content is updated

          // Play the "What are you doing?" voice twice for all subsequent questions
          setTimeout(() => {
            if (whatDoing) {
              whatDoing.muted = false; // Unmute in case it's muted
              playSoundTwice(whatDoing); // Play the audio twice
            }
          }, 1500); // Slight delay to ensure everything is ready before playing
        }, 500); // Delay for 500ms to match the animation
      }, 100); // Small delay before starting the animation to make it smoother
    }
  }

  // ****************************************************************************
  //  fuction update score
  function updateScore() {
    scoreDisplay.innerText = score;
    localStorage.setItem("page1Score", score);
  }
  // ****************************************************************************
  //  logic that handle answers
  function handleAnswer(option) {
    const currentData = quizData[currentQuestion];
    const correctSoundToPlay = currentData.sounds[option - 1];

    if (option === currentData.correctOption) {
      score++; // Increment score for a correct answer
      updateScore(); // Update score on the screen
      const sound = new Audio(correctSoundToPlay[0]); // Play the button sound first
      sound.play();

      sound.onended = function () {
        // After the button sound has finished, play the positive feedback sounds
        const englishSound = new Audio(correctSoundToPlay[1]); // English sound (e.g., "Good")
        const arabicSound = new Audio(correctSoundToPlay[2]); // Arabic sound (e.g., "احسنت")

        englishSound.play();
        englishSound.onended = function () {
          arabicSound.play(); // Play Arabic sound after English sound finishes
        };

        // Show confetti after the feedback sounds
        arabicSound.onended = function () {
          confetti.style.display = "block"; // Show confetti
          setTimeout(() => {
            confetti.style.display = "none"; // Hide confetti after 4 seconds
          }, 4000);

          clapSound.play(); // Play clap sound
          clapSound.onended = function () {
            // Load next question or show congratulations immediately after the clap sound
            if (currentQuestion < quizData.length - 1) {
              currentQuestion++;
              loadQuestion();
            } else {
              frame1.classList.remove("animate-frame");
              frame2.classList.remove("animate-frame");

              setTimeout(() => {
                frame1.classList.add("animate-frame");
                frame2.classList.add("animate-frame");

                // Delay the redirect until after the animation
                setTimeout(() => {
                  showSection("page-3"); // Redirect after animation completes
                }, 1500); // Adjust the delay as needed to match the animation duration
              }, 100);
            }
          };
        };
      };
    } else {
      score--; // Decrement score for an incorrect answer
      if (score < 0) {
        score = 0; // Ensure score doesn't go below zero
      }
      updateScore(); // Update score on the screen
      const sound = new Audio(correctSoundToPlay[0]); // Play the text content sound
      sound.play();

      sound.onended = function () {
        // After the text content sound finishes, play "Try Again" sound
        const tryAgainSound = new Audio(correctSoundToPlay[1]); // "Try Again" sound
        tryAgainSound.play();

        tryAgainSound.onended = function () {
          // After "Try Again" sound finishes, play the Arabic phrase "حاول مرة اخرى"
          const arabicTryAgainSound = new Audio(
            "/voices/خطأ حاول مرة اخرى.mp3"
          ); // Path to the "حاول مرة اخرى" sound
          arabicTryAgainSound.play();
          arabicTryAgainSound.onended = function () {
            // Play "What are you doing?" question sound twice after the wrong answer feedback
            const whatDoingAudio = new Audio("/voices/whatdoing.mp3");
            playSoundTwice(whatDoingAudio); // Play the question twice
          };
        };
      };
    }
  }
  // ****************************************************************************

  window.addEventListener("beforeunload", function () {
    const clapSound = document.getElementById("clap-sound");

    if (clapSound) {
      clapSound.pause();
      clapSound.currentTime = 0; // Reset to the beginning
    }
  });
  // ****************************************************************************
  // Load the first question when the page loads
  loadQuestion();

  function playAudioSequence() {
    // Play English audio
    englishdragaudio.muted = false; // إلغاء كتم الصوت
    englishdragaudio
      .play()
      .then(() => {
        console.log("English audio playing...");
      })
      .catch((error) => {
        console.log("English audio play failed: ", error);
      });

    // Play Arabic audio after English audio ends
    englishdragaudio.onended = function () {
      arbicdragaudio.muted = false; // إلغاء كتم الصوت
      arbicdragaudio
        .play()
        .then(() => {
          console.log("Arabic audio playing...");
        })
        .catch((error) => {
          console.log("Arabic audio play failed: ", error);
        });
    };
  }
});

// ************************************ logic for question-two page**********************************************

function allowDrop(event) {
  event.preventDefault();
}
// ****************************************************************************

function drag(event) {
  console.log("Dragging:", event.target.id); // تحقق من أن دالة drag تعمل
  event.dataTransfer.setData("text", event.target.id);
  // Remove the playDragAudio call to prevent audio on drag
}
// ****************************************************************************

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);

  // Check if the dragged element is the correct answer
  if (isCorrectAnswer(draggedElement.id, event.target.id)) {
    event.target.appendChild(draggedElement); // Add dragged element to the target
    event.target.style.backgroundColor = "lightgreen"; // Change background color to light green
    event.target.style.pointerEvents = "none"; // Make the box unclickable
    event.target.style.textAlign = "center"; // Center text
    event.target.style.fontSize = "20px"; // Change font size as needed
    event.target.style.color = "white"; // Change font color as needed

    playCorrectAnswerSounds(draggedElement.id); // Play correct answer sounds

    updateScoreForPage3(true); // Use the updated score function for page 3
    correctAnswersCount++; // زيادة عدد الإجابات الصحيحة

    // Check if all answers are correct
    if (correctAnswersCount === totalAnswers) {
      // Redirect to the new page

      playAnimationBeforeRedirect();
    }
  } else {
    playIncorrectAnswerSounds(); // Play incorrect answer sounds
    updateScoreForPage3(false); // Use the updated score function for page 3
  }
}

// ****************************************************************************
let correctAnswersCount = 0; // متغير لتتبع عدد الإجابات الصحيحة
const totalAnswers = 3; // إجمالي عدد الكلمات/الإجابات المطلوبة

function showSectionfour(id) {
  // إخفاء جميع الأقسام
  var sections = document.querySelectorAll(".section");
  sections.forEach(function (section) {
    section.classList.remove("active");
    section.style.display = "none"; // إخفاء الأقسام
  });

  // عرض القسم الذي يحتوي على الـ id المطابق
  var activeSection = document.getElementById(id);
  if (activeSection) {
    activeSection.classList.add("active");
    activeSection.style.display = "block"; // عرض القسم النشط
  }
}

function playAnimationBeforeRedirect() {
  const frame1 = document.querySelector(".frame1");
  const frame2 = document.querySelector(".frame2");

  // إزالة الأنيميشن القديم إذا كان موجودًا
  frame1.classList.remove("animate-frame");
  frame2.classList.remove("animate-frame");

  // تشغيل الأنيميشن بعد فترة قصيرة
  setTimeout(() => {
    frame1.classList.add("animate-frame");
    frame2.classList.add("animate-frame");

    // الانتقال إلى page-4 بعد انتهاء الأنيميشن
    setTimeout(() => {
      showSectionfour("page-4"); // الانتقال إلى الصفحة الجديدة بعد الأنيميشن
      displayTotalScore();
    }, 1300); // المدة التي يحتاجها الأنيميشن (يمكن تعديلها حسب مدة الأنيميشن)
  }, 10000); // تأخير بسيط قبل بدء الأنيميشن
}

// دالة للانتقال إلى page-4 مع تشغيل الأنيميشن
function showPage4WithAnimation() {
  playAnimationBeforeRedirect();
}

// ****************************************************************************

function playSoundsWithConfetti(soundsArray) {
  let delay = 0;

  soundsArray.forEach((src, index) => {
    const audio = new Audio(src);

    // Play the clapping sound and show confetti together twice
    if (index === soundsArray.length - 1) {
      audio.onplay = function () {
        console.log("Playing clapping sound"); // سجل عند تشغيل الصوت
        showConfetti(); // Show confetti when clapping sound starts

        // Show confetti again after 1.5 seconds
        setTimeout(() => {
          console.log("Showing confetti again"); // سجل عند عرض الكونفيتي مرة أخرى
          showConfetti();
        }, 1500);
      };
    }

    setTimeout(() => {
      console.log(`Playing sound: ${src}`); // سجل الصوت الذي يتم تشغيله
      audio.play();
    }, delay);

    delay += 2000; // Add delay between sound plays (adjust if necessary)
  });
}

function showConfetti() {
  const confettiThree = document.getElementById("confetti-3");
  if (confettiThree) {
    console.log("Showing confetti"); // سجل عند إظهار الكونفيتي
    confettiThree.style.display = "block"; // إظهار الكونفيتي

    // إخفاء الكونفيتي بعد ثانيتين
    setTimeout(() => {
      console.log("Hiding confetti"); // سجل عند إخفاء الكونفيتي
      confettiThree.style.display = "none";
    }, 2000);
  } else {
    console.error("Confetti element not found!"); // سجل خطأ إذا لم يتم العثور على العنصر
  }
}

// ****************************************************************************

// Function to check if the answer is correct
function isCorrectAnswer(draggedId, targetId) {
  const correctAnswers = {
    "word-1": "answer-3", // Example: "speaking" is correct for "answer-3"
    "word-2": "answer-1", // Other mappings
    "word-3": "answer-2",
  };

  return correctAnswers[draggedId] === targetId;
}
// ****************************************************************************

// Function to play correct answer sounds
function playCorrectAnswerSounds(draggedId) {
  const correctSounds = {
    "word-1": [
      "/voices/speaking.mp3",
      "/voices/good.mp3", // Good sound
      "/voices/أحسنت.mp3", // احسنت sound
      "/voices/Happy Kids Sound Effect.mp3", // Clapping sound
    ],
    "word-2": [
      "/voices/ring.mp3",
      "/voices/Excellent.mp3", // Brilliant sound
      "/voices/ممتاز.mp3", // ممتاز sound
      "/voices/Happy Kids Sound Effect.mp3", // Clapping sound
    ],
    "word-3": [
      "/voices/wing.mp3",
      "/voices/brillient.mp3", // Excellent sound
      "/voices/مذهل.mp3", // مذهل sound
      "/voices/Happy Kids Sound Effect.mp3", // Clapping sound
    ],
  };

  const sounds = correctSounds[draggedId];
  playSoundsWithConfetti(sounds); // Play sounds and show confetti after clapping sound
}
// ****************************************************************************

// Function to play incorrect answer sounds
function playIncorrectAnswerSounds() {
  const incorrectSounds = [
    "/voices/wrong, try again.mp3", // Try again sound
    "/voices/خطأ حاول مرة اخرى.mp3",
    "/voices/drag the correct word.mp3", // حاول مرة اخرى sound
  ];

  playSounds(incorrectSounds);
}
// ****************************************************************************

// Function to play an array of sounds sequentially
function playSounds(soundsArray) {
  let delay = 0;

  soundsArray.forEach((src) => {
    const audio = new Audio(src);
    setTimeout(() => {
      audio.play();
    }, delay);
    delay += 1500; // Add delay between sound plays
  });
}
// ****************************************************************************

// ****************************************************************************

function updateScoreForPage3(isCorrect) {
  const scoreView = document.getElementById("score-view");

  if (!scoreView) {
    console.error("Element with id 'score-view' not found.");
    return;
  }

  let currentScore = parseInt(scoreView.textContent);
  if (isNaN(currentScore)) {
    currentScore = 0; // تأكد من أن القيمة تبدأ من 0 إذا كانت غير صحيحة
  }

  if (isCorrect) {
    currentScore += 1; // زيادة الدرجة للإجابة الصحيحة
  } else {
    if (currentScore > 0) {
      currentScore -= 1; // تقليل الدرجة للإجابة الخاطئة
    }
  }

  scoreView.textContent = currentScore; // تحديث عرض الدرجات
  localStorage.setItem("page3Score", currentScore); // تخزين سكور page-3
}
// دالة لتصفير سكور page-3 عند إعادة اللعب
function resetPage3Score() {
  localStorage.setItem("page3Score", 0); // تصفير سكور page-3 في localStorage
  document.getElementById("score-view").textContent = 0; // تصفير عرض السكور على الصفحة
}

// دالة حساب التوتال سكور وعرضه
function displayTotalScore() {
  const totalScoreDisplay = document.getElementById("total-score");

  // استرجاع السكور المخزن من الصفحات
  const page1Score = parseInt(localStorage.getItem("page1Score")) || 0; // سكور page-1
  const page3Score = parseInt(localStorage.getItem("page3Score")) || 0; // سكور page-3

  // جمع السكور من الصفحتين
  const totalScore = page1Score + page3Score;

  // عرض التوتال سكور في الصفحة
  totalScoreDisplay.textContent = totalScore;

  // تخزين التوتال سكور إذا كنت بحاجة لذلك
  localStorage.setItem("totalScore", totalScore);
}

// دالة لتصفير السكور عند إعادة اللعب
function resetAllScores() {
  localStorage.setItem("page1Score", 0); // تصفير سكور page-1
  localStorage.setItem("page3Score", 0); // تصفير سكور page-3
  localStorage.setItem("totalScore", 0); // تصفير التوتال سكور
  document.getElementById("score-view").textContent = 0; // تصفير عرض السكور في الصفحة
  document.getElementById("total-score").textContent = 0; // تصفير عرض التوتال سكور
}

// تنفيذ الدوال عند تحميل الصفحة
window.onload = function () {
  // إخفاء overlay عند تحميل الصفحة
  document.getElementById("startOverlay").style.display = "none";

  // استرجاع درجة الصفحة 3 عند التحميل
  const storedScore = localStorage.getItem("page3Score") || 0;
  document.getElementById("score-view").textContent = storedScore;

  console.log("Loaded Score from localStorage:", storedScore);

  // حساب وعرض التوتال سكور
  displayTotalScore();
  resetAllScores();
};
// Function to reset the game state
function resetGame() {
  // Clear all boxes and return words to their original positions
  const answerBoxes = document.querySelectorAll(".answer"); // تأكد من اختيار العناصر الصحيحة
  const words = document.querySelectorAll(".word"); // تأكد من اختيار العناصر الصحيحة
  const originalContainer = document.querySelector(".answer-text"); // تحديد الحاوية الأصلية للكلمات

  answerBoxes.forEach((box) => {
    box.innerHTML = ""; // Clear the box content
    box.style.backgroundColor = ""; // Reset background color
    box.style.pointerEvents = ""; // Reset pointer events
  });

  // Append each word back to its original container
  words.forEach((word) => {
    originalContainer.appendChild(word); // إعادة الكلمات إلى الحاوية الأصلية
  });

  // Reset scores
  resetAllScores();
  setTimeout(() => {
    showPage4WithAnimation(); // الانتقال إلى صفحة الخروج بعد فترة قصيرة
  }, 130000); // يمكنك تعديل هذه الفترة حسب الحاجة
}
