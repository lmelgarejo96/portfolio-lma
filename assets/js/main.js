let langs = ["en", "es"]
let gLang = 'es'

const loader = document.querySelector("#loader")
const logoSplash = document.querySelector(".logo-splash")
window.dataLayer = window.dataLayer || []

async function readDataJson(callback) {
    try {
        const response = await fetch('./assets/data.json')
        const json = await response.json()
        logoSplash.classList.add("morph-color")
        callback(json)
    } catch (error) {}
}

function loadLangFromLS() {
    const lang = localStorage.getItem("lang")
    gLang = lang && langs.includes(lang) ? lang : 'es'
}

function gtag() {
    dataLayer.push(arguments);
}

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

loadLangFromLS();
readDataJson((json) => {

    const dataObj = {
        lang: gLang,
        ...json,
        projectsSection: {...json.projectsSection },
        isShowMoreProjects: false,
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

    new Vue({
        el: "#app",
        data: () => dataObj,
        watch: {
            scroll(val) { val > 50 ? this.nav.classList.add("nav-shadow") : this.nav.classList.remove("nav-shadow") },
            lang(val) {
                this.$refs.languageToogle.checked = val === 'es'
                setDefaultLang(val)
            }
        },
        created() { this.seeLessProjects() },
        mounted() {

            this.$refs.languageToogle.checked = this.lang === 'es'

            this.hamburger = document.querySelector("#hamburger-btn")
            this.menu = document.querySelector(".app-menu")
            this.main = document.querySelector("main")
            this.nav = document.querySelector(".app-nav")

            document.body.addEventListener("scroll", this.handleScroll, { passive: true })

            this.observer = new IntersectionObserver(this.handleIntersection, this.optionsIntersection);
            document.querySelectorAll(".scroll-item").forEach(el => this.observer.observe(el))

            executeAccesibility()

            this.loadIndexAnimation()

            gtag('js', new Date());
            gtag('config', 'G-HHYSL9LMYC');

        },
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
            handleScroll(ev) {
                const scroll = window.scrollY || document.body.scrollTop || document.documentElement.scrollTop
                this.scroll = scroll
            },
            handleIntersection(entries, observer) {
                entries.forEach(entry => { entry.isIntersecting ? entry.target.classList.add("active-top") : null })
            },
            seeMoreProjects() {
                this.isShowMoreProjects = true;
            },
            seeLessProjects() {
                this.isShowMoreProjects = false;
            },
            onLanguageChange(ev) {
                ev.target.checked ?
                    (localStorage.setItem("lang", 'es'), this.lang = 'es') :
                    (localStorage.setItem("lang", 'en'), this.lang = 'en');
            },
            loadIndexAnimation() {
                const t1 = new TimelineMax({ paused: true });

                const loaderElement = document.querySelector(".loader-page")
                const brandElement = document.querySelector(".app-brand")
                const headerElements = document.querySelectorAll(".app-title > span, .app-hero > .app-description, .app-hero > a")
                const hamburgerElement = document.querySelector("#hamburger-btn")
                const navElements = document.querySelectorAll(".app-menu li, .app-menu .switch")
                const accesibilityElement = document.querySelector(".accesibility-activator")

                t1.from(loaderElement, .5, { opacity: 1, ease: Expo.easeInOut, delay: .15, onComplete: () => loader.classList.add("no-active") })
                    .staggerFrom([brandElement, hamburgerElement, ...navElements], .75, { y: -25, opacity: 0, ease: Expo.easeInOut }, 0.1)
                    .staggerFrom([...headerElements], .65, { y: 15, opacity: 0, ease: Expo.easeInOut }, 0.1)
                    .staggerFrom(accesibilityElement, .2, { left: "-100%", opacity: 0, ease: Expo.easeInOut }, .1)
                    .from(accesibilityElement, .45, { x: -100, opacity: 0, ease: Expo.easeInOut, delay: .15 })

                t1.play()
            }
        }
    })
})