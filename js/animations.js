const tl = gsap.timeline({defaults: {duration: 0.35, ease: "Power2.easeOut"}})
const home = document.querySelector(".home")
const notifications = document.querySelector('.notifications')
const messages = document.querySelector('.messages')

gsap.set('.feather', {scale: 0, transformOrigin: "center"})
home.addEventListener('click', () => {
    gsap.fromTo('.home-svg', {scale: 1}, {scale: 0.9, yoyp: true, repeat:1})
    gsap.fromTo('.feather', {y:-5, scale:0}, {y:20, scale:1.5, duration: 1, stagger: 0.2})
    gsap.fromTo('.right-feather', {x: 0}, {x: 5})
})

// Notification animation
gsap.set('.ringer', {transformOrigin: "top center"})
gsap.set('.bell', {transformOrigin: "top center"})
gsap.set('.wave', {opacity: 0, transformOrigin: "bottom" })
notifications.addEventListener('click', () => {
    gsap.fromTo('.bell', {rotation: -5}, {rotation: 0, duration: 2, ease: "elastic.out(2, 0.2)"})
    gsap.fromTo('.ringer', {rotation: -3, x:0.5}, {rotation: 0, x:0, duration: 1, ease: "elastic.out(2, 0.2)"})
    gsap.fromTo('.wave', {scale: 0, opacity:1}, {scale: 1.3, opacity:0, duration:1})
})


// messages
gsap.set('.flap', {transformOrigin: 'top'})
messages.addEventListener('click', () => {
    tl.fromTo('.messages-svg', {scale: 1}, {scale: 0.9})
    tl.fromTo('.flap', {scale: 1}, {scale: -1}, '<30%')
    tl.fromTo('.messages-svg', {scale: 0.9}, {scale: 1}, '<50%')
    tl.fromTo('.note', {y:0, opacity:1}, {y: -40, opacity:0, duration:0.75})
    tl.to('.flap', {scale:1}, "<50%")
})
  


  //Run animations
  barba.init({
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        // Your leave animation code
      },
      enter(data) {
        window.scrollTo(0, 0);
        initAnimations();
      }
    }]
  });

function initAnimations() {
    // Highlight page 2
const tlH = gsap.timeline({  
    scrollTrigger: {
        trigger: '.section-text',
        scrub: true,
        start: "-40%",
        end: "40%",
    }
 })

 tlH.fromTo('.highlight', {color: "rgba(255, 255, 255, 0.4)"}, {color: "rgba(255, 255, 255, 1)", stagger: 1})


const tlHRemove = gsap.timeline({  
    scrollTrigger: {
        trigger: '.section-text',
        scrub: true,
        start: "-20%",
        end: "60%",
    }
 });

 tlHRemove.to('.highlight', {color: "rgba(255, 255, 255, 0.4)", stagger: 1}) 

 const tl = gsap.timeline({ defaults: {duration: 0.75, ease: "power3.easeOut" } });

tl.fromTo(".hero-img", { scale: 1.3, borderRadius: "0rem" }, { scale: 1, borderRadius: "2rem", delay: 0.35, duration: 2.5, ease:"elastic.out(1.5,1)" })
tl.fromTo(".cta1", {x: "100%", color: "#ffc078", opacity: 0}, {x: 0, color: "#fff", opacity: 1}, "<10%")
tl.fromTo(".cta2", {y: "100%",color: "#ffc078", opacity: 0}, {y: 0,color: "#fff", opacity: 1}, "<10%")
tl.fromTo(".cta3", {x: "-100%",color: "#ffc078", opacity: 0}, {x: 0,color: "#fff", opacity: 1}, "<10%")







}

initAnimations();