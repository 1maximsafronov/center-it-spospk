'use strict';

var mainNav = document.querySelector('.main-nav');
var navStartPosition = mainNav.offsetTop;
var navControlBtn = mainNav.querySelector('.main-nav__control');
var ancors = document.querySelectorAll('a[href*="#"]');
var toTopBtn = document.querySelector('.to-top-btn');

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
    mainNav.classList.add('main-nav--fixed');
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

function setSmoothScroll(ancor) {
  ancor.addEventListener('click', function (evt) {
    evt.preventDefault();

    var targetId = ancor.getAttribute('href').substr(1);

    document.querySelector('#' + targetId).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

for (var i = 0; i < ancors.length; i++) {
  setSmoothScroll(ancors[i]);
}
