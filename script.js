const HtmlElements = {
  main: document.querySelector('.info-block__main'),
  movie: document.querySelector('.info-block__movie'),
  movies: document.querySelectorAll('.info-block__movie')
};

let movieIndex = 0;
const switchTimer = 4000;
let isDown = false;
let startX, scrollLeft;

HtmlElements.main.addEventListener('mousedown', () => {
  isDown = true;
});
HtmlElements.main.addEventListener('mouseleave', () => {
  isDown = false;
});
HtmlElements.main.addEventListener('mouseup', () => {
  isDown = false;
});
HtmlElements.main.addEventListener('mousemove', () => {
  if (!isDown) return;
  console.log(isDown);
});
