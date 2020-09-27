const mainNav = document.querySelector('.main-nav');
const navStartPosition = mainNav.offsetTop;
const navControlBtn = mainNav.querySelector('.main-nav__control');
const ancors = document.querySelectorAll('a[href*="#"]');
const toTopBtn = document.querySelector('.to-top-btn');

mainNav.classList.add('main-nav--closed');

function toggleMenu() {
  if (mainNav.classList.contains('main-nav--closed')) {
    mainNav.classList.remove('main-nav--closed');
  } else {
    mainNav.classList.add('main-nav--closed');
  }
}

function onWindowScroll() {
  if (window.pageYOffset >= navStartPosition) {
    mainNav.classList.add('main-nav--fixed')
  } else {
    mainNav.classList.remove('main-nav--fixed');
  }

  if (window.pageYOffset >= 500) {
    toTopBtn.style.display = 'block';
  } else {
    toTopBtn.style.display = 'none';
  }
}

window.addEventListener('scroll', onWindowScroll);

navControlBtn.addEventListener('click', function (evt) {
  evt.preventDefault();
  toggleMenu();
});

for (let ancor of ancors) {
  ancor.addEventListener('click', function (evt) {
    evt.preventDefault();

    const targetId = ancor.getAttribute('href').substr(1);

    document.querySelector('#' + targetId).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
};
