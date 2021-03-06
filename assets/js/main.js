let langs = ["en", "es"]
let gLang = 'es'

const loader = document.querySelector("#loader")
const logoSplash = document.querySelector(".logo-splash")
window.dataLayer = window.dataLayer || []

function readDataJson(callback) {
    fetch('./assets/data.json')
        .then(res => res.json())
        .then(data => {
            logoSplash.classList.add("morph-color")
            callback(data)
        })
}

function loadLangFromLS() {
    const lang = localStorage.getItem("lang")
    gLang = lang && langs.includes(lang) ? lang : 'es'
}

function gtag() {
    dataLayer.push(arguments);
}


function initVue(json) {
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
        accesibilityTool: null,
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
                this.loadIndexAnimation()
                this.$refs.languageToogle.checked = val === 'es'
                this.accesibilityTool.setLanguage(val)
                setTimeout(() => this.accesibilityTool.setTourElements(this.getTourElements()), 1200);

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

            this.accesibilityTool = new AccesibilityTool(this.getTourElements());
            this.accesibilityTool.setLanguage(this.lang)

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

                loaderElement.classList.remove("no-active")
                this.closeHamburger()

                t1.from(loaderElement, .5, { opacity: 1, ease: Expo.easeInOut, delay: .15, onComplete: () => loader.classList.add("no-active") })
                    .staggerFrom([brandElement, hamburgerElement, ...navElements], .75, { y: -25, opacity: 0, ease: Expo.easeInOut }, 0.1)
                    .staggerFrom([...headerElements], .65, { y: 15, opacity: 0, ease: Expo.easeInOut }, 0.1)
                    .staggerFrom(accesibilityElement, .2, { left: "-100%", opacity: 0, ease: Expo.easeInOut }, .1)
                    .from(accesibilityElement, .45, { x: -100, opacity: 0, ease: Expo.easeInOut, delay: .15 })

                t1.play()
            },
            getTourElements() {
                return [
                    document.querySelector(".app-hero .app-title"),
                    document.querySelector(".app-hero .app-description"),
                    document.querySelectorAll(".app-hero .app-btn-link"),
                    document.querySelectorAll("#about-me .app-section-title"),
                    document.querySelectorAll("#about-me p"),
                    document.querySelectorAll("#about-me .img-about"),
                    document.querySelectorAll("#experience .app-section-title"),
                    document.querySelectorAll("#experience li.rb-item"),
                    document.querySelectorAll("#experience .skills .item-title"),
                    document.querySelectorAll("#experience .skills-list li"),
                    document.querySelectorAll("#projects .app-section-title"),
                    document.querySelectorAll("#projects .projects-list .project"),
                    document.querySelectorAll("#contact .app-section-title"),
                    document.querySelectorAll("#contact .contact-subtitle"),
                    document.querySelectorAll("#contact .message-contact"),
                    document.querySelectorAll("#contact .app-btn-link"),
                    document.querySelectorAll("footer li a"),
                    document.querySelectorAll("footer .copyright")
                ]
            }
        }
    })
}

loadLangFromLS();
readDataJson(initVue)