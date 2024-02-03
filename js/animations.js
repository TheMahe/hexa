const tl = gsap.timeline({defaults: {duration: 0.35, ease: "Power2.easeOut"}});
const home = document.querySelector(".home");
const notifications = document.querySelector('.notifications');
const messages = document.querySelector('.messages');
const homeSvg = document.querySelector('.home-svg');
const feather = document.querySelector('.feather');
const rightFeather = document.querySelector('.right-feather');
const bell = document.querySelector('.bell');
const ringer = document.querySelector('.ringer');
const wave = document.querySelector('.wave');
const messagesSvg = document.querySelector('.messages-svg');
const flap = document.querySelector('.flap');
const note = document.querySelector('.note');

gsap.set('.feather', {scale: 0, transformOrigin: "center"});

function homeClickHandler() {
    gsap.fromTo(homeSvg, {scale: 1}, {scale: 0.9, yoyp: true, repeat:1});
    gsap.fromTo(feather, {y:-5, scale:0}, {y:20, scale:1.5, duration: 1, stagger: 0.2});
    gsap.fromTo(rightFeather, {x: 0}, {x: 5});
}

function notificationsClickHandler() {
    gsap.fromTo(bell, {rotation: -5}, {rotation: 0, duration: 2, ease: "elastic.out(2, 0.2)"});
    gsap.fromTo(ringer, {rotation: -3, x:0.5}, {rotation: 0, x:0, duration: 1, ease: "elastic.out(2, 0.2)"});
    gsap.fromTo(wave, {scale: 0, opacity:1}, {scale: 1.3, opacity:0, duration:1});
}

function messagesClickHandler() {
    tl.fromTo(messagesSvg, {scale: 1}, {scale: 0.9});
    tl.fromTo(flap, {scale: 1}, {scale: -1}, '<30%');
    tl.fromTo(messagesSvg, {scale: 0.9}, {scale: 1}, '<50%');
    tl.fromTo(note, {y:0, opacity:1}, {y: -40, opacity:0, duration:0.75});
    tl.to(flap, {scale:1}, "<50%");
}

home.addEventListener('click', homeClickHandler);
notifications.addEventListener('click', notificationsClickHandler);
messages.addEventListener('click', messagesClickHandler);