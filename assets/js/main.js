const hamburger = document.querySelector("#hamburger-btn")
const menu = document.querySelector(".app-menu")
const main = document.querySelector("main")

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active")
    menu.classList.toggle("active")
    main.classList.toggle("blur")
})

main.addEventListener("click", () => {
    hamburger.classList.remove("is-active")
    menu.classList.remove("active")
    main.classList.remove("blur")
})

Particles.init({
    selector: ".background-particles",
    color: ["#4dc9ac", "#ff0266", "#4dc9ac"],
    connectParticles: true,
    responsive: [{
        breakpoint: 768,
        options: {
            color: ["#4dc9ac", "#ff0266", "#4dc9ac"],
            maxParticles: 43,
            connectParticles: false
        }
    }]
});