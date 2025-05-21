'use strict';
const toggleElem = function (elem) { elem.classList.toggle("active"); }
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navTogglers.length; i++) {
  navTogglers[i].addEventListener("click", function () {
    toggleElem(navbar);
    toggleElem(overlay);
  });
}

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    header.classList.add("header-anim");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
    header.classList.remove("header-anim");
  }
});

const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const searchBox = document.querySelector("[data-search-box]");

for (let i = 0; i < searchTogglers.length; i++) {
  searchTogglers[i].addEventListener("click", function () {
    toggleElem(searchBox);
  });
}

const whishlistBtns = document.querySelectorAll("[data-whish-btn]");

for (let i = 0; i < whishlistBtns.length; i++) {
  whishlistBtns[i].addEventListener("click", function () {
    toggleElem(this);
  });
}


let userCount = 100;
const userCountElement = document.getElementById('userCount');
const phoneInput = document.getElementById('phone');

phoneInput.value = '+998';

function handlePhoneInput(input) {
  let value = input.value;
  if (!value.startsWith('+998')) {
    value = '+998' + value.replace(/[^\d]/g, '');
  }
  const digits = value.slice(4).replace(/[^\d]/g, '');
  if (digits.length > 9) {
    value = '+998' + digits.slice(0, 9);
  } else {
    value = '+998' + digits;
  }
  input.value = value;
}

function restrictPhoneInput(event) {
  const value = event.target.value;
  const key = event.key;
  const selectionStart = event.target.selectionStart;

  if ((key === 'Backspace' || key === 'Delete') && selectionStart <= 4) {
    event.preventDefault();
  }

  if (!/[\d]/.test(key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)) {
    event.preventDefault();
  }

  const digits = value.slice(4).replace(/[^\d]/g, '');
  if (digits.length >= 9 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)) {
    event.preventDefault();
  }
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification-container ${type === 'success' ? 'notification-success' : 'notification-error'}`;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

async function registerUser() {
  const fullName = document.getElementById('fullName').value.trim();
  const phoneValue = document.getElementById('phone').value;
  const course = document.getElementById('course').value;

  const phoneDigits = phoneValue.slice(4);
  if (fullName && phoneDigits && /^\d{9}$/.test(phoneDigits) && course) {
    const message = `Yangi ro'yxatdan o'tish:\nIsm: ${fullName}\nTelefon: ${phoneValue}\nKurs: ${course}`;
    const botToken = '7731797042:AAFMI9gDb8qlwy0vMlHKV7LgdM6u_kVXCm8';
    const chatId = '7081016434';
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        userCount++;
        if (userCountElement) {
          userCountElement.textContent = userCount;
        }

        document.getElementById('fullName').value = '';
        document.getElementById('phone').value = '+998';
        document.getElementById('course').value = '';

        showNotification("Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi!", 'success');
      } else {
        showNotification("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.", 'error');
      }
    } catch (error) {
      console.error('Telegram API error:', error);
      showNotification("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.", 'error');
    }
  } else {
    showNotification("Iltimos, barcha maydonlarni to'g'ri to'ldiring.", 'error');
  }
}



const courses = [
  { id: 1, title: "Ingliz tili A1", type: "ingliz-tili", level: "boshlangich", price: 250000 },
  { id: 2, title: "Ingliz tili A2", type: "ingliz-tili", level: "boshlangich", price: 260000 },
  { id: 3, title: "Ingliz tili B1", type: "ingliz-tili", level: "orta", price: 270000 },
  { id: 4, title: "Ingliz tili B2", type: "ingliz-tili", level: "orta", price: 300000 },
  { id: 5, title: "Ingliz tili IELTS", type: "ingliz-tili", level: "professional", price: 350000 },
  { id: 6, title: "Robototexnika", type: "robototexnika", level: "boshlangich", price: 300000 },
  { id: 7, title: "Kompyuter Savodxonligi", type: "kompyuter-sovodxonligi", level: "boshlangich", price: 300000 },
  { id: 8, title: "Dasturlash Tillari", type: "dasturlash", level: "orta", price: 350000 },
  { id: 9, title: "Matematika", type: "matematika", level: "boshlangich", price: 280000 } // Added Matematika course
];

document.querySelector(".filter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const type = document.getElementById("course-type").value;
  const price = document.getElementById("course-price").value;

  let filteredCourses = courses;

  if (type) {
    filteredCourses = filteredCourses.filter(course => course.type === type);
  }
  if (price) {
    const [min, max] = price.split("-").map(Number);
    filteredCourses = filteredCourses.filter(course => course.price >= min && (max ? course.price <= max : true));
  }

  const courseList = document.getElementById("filtered-courses");
  courseList.innerHTML = "";
  filteredCourses.forEach(course => {
    const courseCard = `
      <div class="course-card">
        <div class="card-content">
          <h3 class="h3"><a href="#" class="card-title">${course.title}</a></h3>
          <div class="card-footer">
            <div class="card-price">
              <span class="span">${course.price.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>
    `;
    courseList.insertAdjacentHTML("beforeend", courseCard);
  });
});

document.querySelectorAll('.video-card').forEach(card => {
  const poster = card.querySelector('.poster-image');
  const video = card.querySelector('.video-player');
  const playPauseBtn = card.querySelector('.play-pause-btn');

  // Initialize: show poster, hide video
  poster.style.display = 'block';
  video.style.display = 'none';
  playPauseBtn.classList.remove('hidden');

  // Toggle play/pause functionality
  function togglePlayPause() {
    if (video.paused) {
      poster.style.display = 'none';
      video.style.display = 'block';
      video.play();
      playPauseBtn.classList.add('hidden');
      playPauseBtn.textContent = '❚❚';
    } else {
      video.pause();
      playPauseBtn.classList.remove('hidden');
      playPauseBtn.textContent = '▶';
    }
  }

  // Click poster to play video
  poster.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });

  // Click video to toggle play/pause
  video.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });

  // Click play/pause button
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });

  // Update button on play/pause events
  video.addEventListener('play', () => {
    playPauseBtn.classList.add('hidden');
    playPauseBtn.textContent = '❚❚';
  });

  video.addEventListener('pause', () => {
    playPauseBtn.classList.remove('hidden');
    playPauseBtn.textContent = '▶';
  });

  // Show poster and button when video ends
  video.addEventListener('ended', () => {
    video.style.display = 'none';
    poster.style.display = 'block';
    playPauseBtn.classList.remove('hidden');
    playPauseBtn.textContent = '▶';
  });
});







let currentUser = '';

document.addEventListener('DOMContentLoaded', function () {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) {
    console.warn('Comments list element not found!');
    return;
  }

  const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
  savedComments.forEach(({ userName, text, date }) => {
    addCommentToList(userName, text, date);
  });
});

document.getElementById('submitComment')?.addEventListener('click', function () {
  const commentInput = document.getElementById('commentText');
  const userNameInput = document.getElementById('userName');
  const commentsList = document.getElementById('commentsList');

  if (!commentInput || !userNameInput || !commentsList) {
    console.warn('Required elements (commentText, userName, or commentsList) not found!');
    return;
  }

  const comment = commentInput.value.trim();
  const userName = userNameInput.value.trim() || 'Anonim';

  if (comment === '') {
    alert('Iltimos, fikringizni kiriting!');
    return;
  }

  if (userName === '') {
    alert('Iltimos, ismingizni kiriting!');
    return;
  }

  currentUser = userName;

  const now = new Date();
  const dateString = now.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  addCommentToList(userName, comment, dateString);

  const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
  savedComments.unshift({ userName, text: comment, date: dateString });
  localStorage.setItem('comments', JSON.stringify(savedComments));

  commentsList.style.display = 'flex';
  const toggleButton = document.getElementById('toggleComments');
  if (toggleButton) {
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.querySelector('ion-icon').setAttribute('name', 'chevron-up-outline');
    toggleButton.querySelector('.span').textContent = 'Izohlarni yashirish';
  }

  commentInput.value = '';
  userNameInput.value = '';

  updateDeleteButtonVisibility();
});

document.getElementById('toggleComments')?.addEventListener('click', function () {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) {
    console.warn('Comments list element not found!');
    return;
  }

  const toggleButton = this;
  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    commentsList.style.display = 'none';
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.querySelector('ion-icon').setAttribute('name', 'chevron-down-outline');
    toggleButton.querySelector('.span').textContent = 'Izohlarni ko\'rish';
  } else {
    commentsList.style.display = 'flex';
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.querySelector('ion-icon').setAttribute('name', 'chevron-up-outline');
    toggleButton.querySelector('.span').textContent = 'Izohlarni yashirish';
  }
});

function addCommentToList(userName, comment, dateString) {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;

  const commentCard = document.createElement('div');
  commentCard.className = 'comment-card';

  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const commentUser = document.createElement('span');
  commentUser.className = 'comment-user';
  commentUser.textContent = userName;

  const commentDate = document.createElement('span');
  commentDate.className = 'comment-date';
  commentDate.textContent = dateString;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn-delete';
  deleteButton.setAttribute('aria-label', 'Fikrni o\'chirish');
  deleteButton.innerHTML = '<ion-icon name="trash-outline" aria-hidden="true"></ion-icon>';
  deleteButton.style.display = userName === currentUser ? 'inline-flex' : 'none';
  deleteButton.addEventListener('click', () => {
    commentCard.remove();
    const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedComments = savedComments.filter(
      (c) => !(c.userName === userName && c.text === comment && c.date === dateString)
    );
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  });

  commentHeader.appendChild(commentUser);
  commentHeader.appendChild(commentDate);
  commentHeader.appendChild(deleteButton);

  const commentText = document.createElement('p');
  commentText.className = 'comment-text';
  commentText.textContent = comment;

  commentCard.appendChild(commentHeader);
  commentCard.appendChild(commentText);

  commentsList.prepend(commentCard);
}

function updateDeleteButtonVisibility() {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;

  const commentCards = commentsList.querySelectorAll('.comment-card');
  commentCards.forEach((card) => {
    const userName = card.querySelector('.comment-user').textContent;
    const deleteButton = card.querySelector('.btn-delete');
    if (deleteButton) {
      deleteButton.style.display = userName === currentUser ? 'inline-flex' : 'none';
    }
  });
}

document.getElementById('userName')?.addEventListener('input', function () {
  currentUser = this.value.trim() || 'Anonim';
  updateDeleteButtonVisibility();
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.className = 'notification-container show';
    setTimeout(() => {
      notification.className = 'notification-container';
    }, 3000);
  } else {
    console.warn('Notification element not found, falling back to alert.');
    alert(message);
  }
}






document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.chatbot-toggle-btn');
  const chatbotWindow = document.querySelector('.chatbot-window');
  const inputField = document.querySelector('.chatbot-input-field');
  const sendBtn = document.querySelector('.chatbot-send-btn');
  const chatBody = document.querySelector('.chatbot-body');
  const suggestionsContainer = document.querySelector('.chatbot-suggestions');

  // Foydalanuvchi ma’lumotlarini olish (ro‘yxatdan o‘tish formasidan)
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.fullName || 'Foydalanuvchi';
  const userCourse = userData.course || null;

  // Xabarlar tarixini yuklash
  let messageHistory = JSON.parse(localStorage.getItem('chatbotHistory') || '[]');
  messageHistory.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', msg.type);
    messageDiv.textContent = msg.text;
    chatBody.appendChild(messageDiv);
  });
  chatBody.scrollTop = chatBody.scrollHeight;

  // Chatbotni ochish/yopish
  toggleBtn.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    toggleBtn.querySelector('ion-icon').setAttribute('name', 
      chatbotWindow.classList.contains('active') ? 'close-outline' : 'chatbubbles-outline'
    );
    if (chatbotWindow.classList.contains('active')) {
      inputField.focus();
    }
  });

  // Xabar yuborish
  const sendMessage = () => {
    const message = inputField.value.trim();
    if (!message) return;

    // Foydalanuvchi xabari
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user');
    userMessage.textContent = message;
    chatBody.appendChild(userMessage);

    // Tarixga qo‘shish
    messageHistory.push({ type: 'user', text: message });
    localStorage.setItem('chatbotHistory', JSON.stringify(messageHistory));

    // Bot javobi
    const botMessage = document.createElement('div');
    botMessage.classList.add('chat-message', 'bot');
    botMessage.textContent = getBotResponse(message.toLowerCase(), userName, userCourse);
    setTimeout(() => {
      chatBody.appendChild(botMessage);
      messageHistory.push({ type: 'bot', text: botMessage.textContent });
      localStorage.setItem('chatbotHistory', JSON.stringify(messageHistory));
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);

    // Inputni tozalash va takliflarni yashirish
    inputField.value = '';
    suggestionsContainer.style.display = 'none';
  };

  // Takliflar ro‘yxati
  const suggestionKeywords = [
    'kurslar', 'ingliz tili', 'dasturlash', 'robototexnika', 'kompyuter savodxonligi', 'matematika',
    'ielts', 'narx', 'ro‘yxatdan o‘tish', 'manzil', 'aloqa', 'test', 'o‘qituvchilar', 'davomiylik'
  ];

  // Takliflarni ko‘rsatish
  inputField.addEventListener('input', () => {
    const query = inputField.value.toLowerCase().trim();
    if (!query) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    const matches = suggestionKeywords.filter(keyword => keyword.includes(query));
    if (matches.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }

    suggestionsContainer.innerHTML = '';
    matches.forEach(match => {
      const suggestionItem = document.createElement('div');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.textContent = match;
      suggestionItem.addEventListener('click', () => {
        inputField.value = match;
        suggestionsContainer.style.display = 'none';
        sendMessage();
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.style.display = 'block';
  });

  // Bot javoblari
  const getBotResponse = (message, userName, userCourse) => {
    const responses = {
      'salom|assalom|hello': `Assalomu alaykum, ${userName}! Shams Academy kurslari haqida qanday yordam bera olaman?`,
      'kurslar|qanday kurslar|kurs haqida': `Bizda quyidagi kurslar mavjud:
- **Ingliz tili**: A1, A2, B1, B2, IELTS, IELTS-PRE (250,000–350,000 so‘m)
- **Dasturlash**: Python, C#, HTML, CSS, JS, Node.js, Vue.js (350,000–400,000 so‘m)
- **Robototexnika**: Robot yasash va dasturlash (300,000 so‘m)
- **Kompyuter savodxonligi**: Asosiy kompyuter ko‘nikmalari (300,000 so‘m)
- **Matematika**: Maktab va oliy matematika (400,000 so‘m)
Qaysi biri haqida batafsil bilmoqchisiz?`,
      'ingliz tili|english': `Ingliz tili kurslarimiz A1 dan IELTS gacha:
- A1: 250,000 so‘m, 3 oy
- A2: 260,000 so‘m, 3 oy
- B1: 270,000 so‘m, 3.5 oy
- B2: 300,000 so‘m, 4 oy
- IELTS: 350,000 so‘m, 3–4 oy
${userCourse && userCourse.includes('ingliz-tili') ? `Siz "${userCourse}" kursini tanlagansiz. Bu kurs haqida qo‘shimcha ma’lumot kerakmi?` : 'Qaysi daraja sizga mos keladi?'}`,
      'dasturlash|programming': `Dasturlash kurslarimizda quyidagi tillarni o‘rgatasiz:
- Frontend: HTML, CSS, JavaScript, Vue.js
- Backend: Python, C#, Node.js, C, C++
Narxi: 350,000–400,000 so‘m, davomiyligi 4–6 oy.
${userCourse && userCourse.includes('dasturlash') ? `Siz dasturlash kursini tanlagansiz. Qaysi til haqida ko‘proq bilmoqchisiz?` : 'Qaysi yo‘nalish sizni qiziqtiradi?'}`,
      'robototexnika|robotics': `Robototexnika kursi bolalar va yoshlar uchun mo‘ljallangan:
- Narxi: 300,000 so‘m
- Davomiyligi: 4 oy
- Mazmun: Robot yasash, dasturlash, sensorlar bilan ishlash
${userCourse && userCourse === 'robototexnika' ? `Siz robototexnika kursini tanlagansiz! Qo‘shimcha savollar bormi?` : 'Bu kurs haqida ko‘proq ma’lumot kerakmi?'}`,
      'kompyuter savodxonligi|computer literacy': `Kompyuter savodxonligi kursi:
- Narxi: 300,000 so‘m
- Davomiyligi: 3 oy
- Mazmun: MS Office, internetdan foydalanish, asosiy dasturlar
${userCourse && userCourse === 'kompyuter-sovodxonligi' ? `Siz bu kursni tanlagansiz. Qo‘shimcha ma’lumot kerakmi?` : 'Bu kursni sinab ko‘rmoqchimisiz?'}`,
      'matematika|math': `Matematika kursi:
- Narxi: 400,000 so‘m
- Davomiyligi: 4 oy
- Mazmun: Maktab dasturi, oliy matematika, imtihonlarga tayyorgarlik
${userCourse && userCourse === 'matematika' ? `Siz matematika kursini tanlagansiz! Yana savollar bormi?` : 'Bu kurs haqida ko‘proq bilmoqchimisiz?'}`,
      'ielts': `IELTS kursi xalqaro imtihonlarga tayyorlaydi:
- Narxi: 350,000 so‘m
- Davomiyligi: 3–4 oy
- Mazmun: Listening, Reading, Writing, Speaking bo‘yicha mashg‘ulotlar
${userCourse && userCourse.includes('ielts') ? `Siz IELTS kursini tanlagansiz. Qo‘shimcha ma’lumot kerakmi?` : 'IELTS haqida ko‘proq bilmoqchimisiz?'}`,
      'narx|qancha turadi|kurs narxi': `Kurs narxlari:
- Ingliz tili: 250,000–350,000 so‘m
- Dasturlash: 350,000–400,000 so‘m
- Robototexnika: 300,000 so‘m
- Kompyuter savodxonligi: 300,000 so‘m
- Matematika: 400,000 so‘m
Qaysi kurs narxini aniqlashtirmoqchisiz?`,
      'ro‘yxatdan o‘tish|registratsiya|qanday ro‘yxatdan o‘taman': `Ro‘yxatdan o‘tish uchun:
1. Saytdagi “Ro‘yxatdan o‘tish” bo‘limiga o‘ting.
2. Ism, telefon raqam va kursni kiriting.
3. “Ro‘yxatdan o‘tish” tugmasini bosing.
Biz siz bilan 24 soat ichida bog‘lanamiz! ${userName}, siz allaqachon ro‘yxatdan o‘tgansizmi?`,
      'manzil|qayerda joylashgan|address': `Biz Samarqand viloyati, Tayloq tumani, Amir Temur ko‘chasida joylashganmiz. Xaritani saytdagi “Manzil” bo‘limidan ko‘rishingiz mumkin.`,
      'aloqa|kontakt|bog‘lanish': `Biz bilan bog‘lanish:
- Telefon: +998 (91) 700 30 85
- Email: shams_academy@gmail.com
- Telegram: t.me/shams_academy_11
- Instagram: instagram.com/shamsakademiya`,
      'test|imtihon|sinov': `Saytdagi “Test” bo‘limida kurslar bo‘yicha bilimlaringizni sinab ko‘rishingiz mumkin. Har bir test 10 ta savoldan iborat. Qaysi kurs bo‘yicha test topshirmoqchisiz?`,
      'o‘qituvchilar|ustozlar|teacher': `O‘qituvchilarimiz xalqaro sertifikatlarga ega va tajribali mutaxassislar. Masalan, Ingliz tili o‘qituvchilarimiz IELTS 7.0+ natija ko‘rsatgan. Qo‘shimcha ma’lumot uchun “Biz haqimizda” bo‘limini ko‘ring.`,
      'davomiylik|qancha vaqt|kurs muddati': `Kurslar davomiyligi:
- Ingliz tili: 3–4 oy
- Dasturlash: 4–6 oy
- Robototexnika: 4 oy
- Kompyuter savodxonligi: 3 oy
- Matematika: 4 oy
Qaysi kurs davomiyligi haqida bilmoqchisiz?`,
      'yordam|help|nima qilay': `Iltimos, savolingizni aniqroq yozing, ${userName}! Masalan, “kurslar”, “narx” yoki “ro‘yxatdan o‘tish” deb so‘rang.`
    };

    for (const [key, value] of Object.entries(responses)) {
      const patterns = key.split('|');
      if (patterns.some(pattern => message.includes(pattern))) {
        return value;
      }
    }
    return `Uzr, ${userName}, bu savolga aniq javobim yo‘q. Iltimos, masalan, “kurslar”, “narx” yoki “test” deb so‘rang!`;
  };

  // Yuborish tugmasi
  sendBtn.addEventListener('click', sendMessage);

  // Enter tugmasi bilan yuborish
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Formadan ma’lumotlarni olish (ro‘yxatdan o‘tish)
  const registerBtn = document.querySelector('.registration-form .btn-primary');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const fullName = document.getElementById('fullName').value;
      const course = document.getElementById('course').value;
      if (fullName && course) {
        localStorage.setItem('userData', JSON.stringify({ fullName, course }));
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Get all course cards
  const courseCards = document.querySelectorAll('.course-card');

  // Add click event listener to each course card
  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      // Get the course ID from the data-course attribute
      const courseId = card.getAttribute('data-course');

      // Find the registration section
      const registrationSection = document.getElementById('registration');

      // Scroll to the registration section smoothly
      registrationSection.scrollIntoView({ behavior: 'smooth' });

      // Set the course dropdown to the selected course
      const courseSelect = document.getElementById('course');
      if (courseSelect) {
        courseSelect.value = courseId;
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const courseCards = document.querySelectorAll('.course-card');

  courseCards.forEach(card => {
    card.addEventListener('click', (event) => {
      // Prevent default link behavior if clicked on the link inside the card
      event.preventDefault();

      const courseId = card.getAttribute('data-course');
      const registrationSection = document.getElementById('registration');
      registrationSection.scrollIntoView({ behavior: 'smooth' });

      const courseSelect = document.getElementById('course');
      if (courseSelect) {
        courseSelect.value = courseId;
      }
    });
  });
});



        // Remove no-js class to enable buttons if JavaScript is available
        document.documentElement.classList.remove('no-js');

        let currentIndex = 0;
        const slides = document.querySelector('.carousel-inner');
        const totalSlides = document.querySelectorAll('.carousel-item').length;

        function moveSlide(direction) {
            currentIndex += direction;
            if (currentIndex >= totalSlides) currentIndex = 0;
            if (currentIndex < 0) currentIndex = totalSlides - 1;
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Update ARIA attributes for accessibility
            slides.setAttribute('aria-label', `Image carousel, slide ${currentIndex + 1} of ${totalSlides}`);
        }

        // Auto-slide
        let autoSlide = setInterval(() => {
            moveSlide(1);
        }, 5000);

        // Pause auto-slide on hover
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
        carousel.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                moveSlide(1);
            }, 5000);
        });

        // Handle touch events for mobile
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                moveSlide(1); // Swipe left
            } else if (touchEndX - touchStartX > 50) {
                moveSlide(-1); // Swipe right
            }
        });