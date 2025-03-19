document.addEventListener('DOMContentLoaded', () => {
  const slidesEl = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slides > *');
  const totalSlides = slideItems.length;
  let currentSlide = 0;
  const transitionTime = 2000;
  const intervalTime = 4000;
  const faqItems = document.querySelectorAll('.faq-item');

  slidesEl.style.transition = `transform ${transitionTime}ms linear`;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });


  const getSlideDimensions = () => {
    const slideWidth = slideItems[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(getComputedStyle(slidesEl).gap) || 40;
    return { slideWidth, gap, totalShift: slideWidth + gap };
  };

  const updateSlideTransform = () => {
    const { totalShift } = getSlideDimensions();
    slidesEl.style.transform = `translateX(-${currentSlide * totalShift}px)`;
  };

  const shiftSlides = () => {
    if (window.innerWidth > 768) {
      currentSlide = currentSlide === 0 ? 1 : 0;
    } else {
      currentSlide = (currentSlide + 1) % totalSlides;
    }
    updateSlideTransform();
  };

  setInterval(shiftSlides, intervalTime);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && currentSlide > 1) {
      currentSlide = 0;
    } else if (currentSlide >= totalSlides) {
      currentSlide = 0;
    }
    updateSlideTransform();
  });

  const liveFeedSlidesContainer = document.querySelector('.live-feed-slides');
  const liveFeedSlides = document.querySelectorAll('.live-feed-slide');
  const prevButton = document.querySelector('.slider-prev');
  const nextButton = document.querySelector('.slider-next');
  let currentGroup = 0;

  const getLiveFeedSlidesPerView = () => window.innerWidth > 768 ? 4 : 1;

  const updateLiveFeedButtons = () => {
    const slidesPerView = getLiveFeedSlidesPerView();
    const totalGroups = Math.ceil(liveFeedSlides.length / slidesPerView);
    prevButton.disabled = currentGroup === 0;
    nextButton.disabled = currentGroup === totalGroups - 1;
  };

  const moveLiveFeedSlider = () => {
    const slidesPerView = getLiveFeedSlidesPerView();
    const slideWidth = liveFeedSlides[0].getBoundingClientRect().width;
    const totalShift = slideWidth + 40;
    const offset = -(currentGroup * totalShift * slidesPerView);
    liveFeedSlidesContainer.style.transform = `translateX(${offset}px)`;
    updateLiveFeedButtons();
  };

  nextButton.addEventListener('click', () => {
    const slidesPerView = getLiveFeedSlidesPerView();
    const totalGroups = Math.ceil(liveFeedSlides.length / slidesPerView);
    if (currentGroup < totalGroups - 1) {
      currentGroup++;
      moveLiveFeedSlider();
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentGroup > 0) {
      currentGroup--;
      moveLiveFeedSlider();
    }
  });

  updateLiveFeedButtons();

  window.addEventListener('resize', () => {
    const slidesPerView = getLiveFeedSlidesPerView();
    const totalGroups = Math.ceil(liveFeedSlides.length / slidesPerView);
    if (currentGroup >= totalGroups) {
      currentGroup = 0;
    }
    moveLiveFeedSlider();
  });

  const form = document.getElementById('interview-form');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const positionInput = document.getElementById('position');
  const questionsInput = document.getElementById('questions');
  const resumeInput = document.getElementById('resume');
  const employmentRadios = document.getElementsByName('employment');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.setCustomValidity('Пожалуйста, укажите ваше имя');
      isValid = false;
    } else {
      nameInput.setCustomValidity('');
    }

    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!phonePattern.test(phoneInput.value)) {
      phoneInput.setCustomValidity('Пожалуйста, укажите корректный номер телефона (например, +79991234567)');
      isValid = false;
    } else {
      phoneInput.setCustomValidity('');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailInput.setCustomValidity('Пожалуйста, укажите корректный email');
      isValid = false;
    } else {
      emailInput.setCustomValidity('');
    }

    const isEmploymentSelected = Array.from(employmentRadios).some(radio => radio.checked);
    if (!isEmploymentSelected) {
      employmentRadios[0].setCustomValidity('Пожалуйста, выберите категорию занятости');
      isValid = false;
    } else {
      employmentRadios[0].setCustomValidity('');
    }

    if (resumeInput.files.length > 0) {
      const file = resumeInput.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        resumeInput.setCustomValidity('Пожалуйста, загрузите файл в формате PDF, DOC или DOCX');
        isValid = false;
      } else {
        resumeInput.setCustomValidity('');
      }
    }

    if (isValid) {
      console.log('Форма валидна, отправляем данные:', {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        position: positionInput.value,
        employment: Array.from(employmentRadios).find(radio => radio.checked)?.value,
        questions: questionsInput.value,
        resume: resumeInput.files[0]?.name
      });
    }
  });

  [nameInput, phoneInput, emailInput].forEach(input => {
    input.addEventListener('input', () => {
      input.reportValidity();
    });
  });

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});