const loader = document.querySelector("#loader")
const logoSplash = document.querySelector(".logo-splash")

Particles.init({
    selector: ".background-particles",
    color: ["#4dc9ac", "#ff0266", "#4dc9ac"],
    maxParticles: 200,
    connectParticles: false,
    responsive: [{
        breakpoint: 768,
        options: {
            color: ["#4dc9ac", "#ff0266", "#4dc9ac"],
            maxParticles: 43,
            connectParticles: false
        }
    }]
});


let data = null;
let langs = ["en", "es"]
let gLang = 'es'

const readDataJson = async(callback) => {
    try {
        const response = await fetch('./assets/data.json')
        const json = await response.json()
        data = json;
        logoSplash.classList.add("morph-color")
        callback(data)
    } catch (error) {
        // catch error
    }
}

const loadLangFromLS = () => {
    const lang = localStorage.getItem("lang")
    if (!lang) return
    if (!langs.includes(lang)) return
    gLang = lang
}


// Intersection API



loadLangFromLS();
readDataJson((json) => {
    const { mail, headerInfo, menu, aboutSection, expSection, projectsSection } = json
    new Vue({
        el: "#app",
        data() {
            return {
                lang: gLang,
                headerInfo,
                mail,
                menuList: menu,
                aboutSection,
                expSection,
                projectsSection,
                // elements
                scroll: 0,
                optionsIntersection: {
                    root: document.body,
                    rootMargin: '0px',
                    threshold: 0.30
                },
                observer: null,
                hamburger: null,
                menu: null,
                main: null,
                nav: null
            }
        },
        watch: {
            scroll(val) {
                if (val > 50) {
                    this.nav.classList.add("nav-shadow")
                } else {
                    this.nav.classList.remove("nav-shadow")
                }
            }
        },
        mounted() {
            this.hamburger = document.querySelector("#hamburger-btn")
            this.menu = document.querySelector(".app-menu")
            this.main = document.querySelector("main")
            this.nav = document.querySelector(".app-nav")

            document.body.addEventListener("scroll", () => {
                const scroll = window.scrollY || document.body.scrollTop || document.documentElement.scrollTop
                this.scroll = scroll
            })

            this.observer = new IntersectionObserver(this.handleIntersection, this.optionsIntersection);
            document.querySelectorAll(".scroll-item").forEach(el => {
                this.observer.observe(el);
            })
            setTimeout(() => {
                loader.classList.add("no-active")
            }, 1200);
        }, // on mounted
        methods: {
            onHanburgerClick() {
                this.hamburger.classList.toggle("is-active")
                this.menu.classList.toggle("active")
                this.main.classList.toggle("blur")
            },
            closeHamburger() {
                this.hamburger.classList.remove("is-active")
                this.menu.classList.remove("active")
                this.main.classList.remove("blur")
            },
            removeShortDescription(ref) {
                this.$refs[ref][0].classList.remove("short-description")
            },
            addShortDescription(ref) {
                this.$refs[ref][0].classList.add("short-description")
            },
            handleIntersection(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let elem = entry.target;
                        elem.classList.add("active-top")
                        if (entry.intersectionRatio >= 0.75) {
                            console.log("75%")
                        }
                    }
                })
            }
        }
    })
})