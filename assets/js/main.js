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


let data = null;
let langs = ["en", "es"]
let gLang = 'es'

const readDataJson = async(callback) => {
    try {
        const response = await fetch('./assets/data.json')
        const json = await response.json()
        data = json;
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



loadLangFromLS();
readDataJson((json) => {
    const { menu, aboutSection } = json
    new Vue({
        el: "#app",
        data() {
            return {
                lang: gLang,
                menuList: menu,
                aboutSection,
                // elements
                scroll: 0,
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
            window.addEventListener('scroll', (e) => {
                const scroll = window.scrollY || document.body.scrollTop || document.documentElement.scrollTop
                this.scroll = scroll
            })
        }, // on mounted
        methods: {
            onHanburgerClick() {
                this.hamburger.classList.toggle("is-active")
                this.menu.classList.toggle("active")
                this.main.classList.toggle("blur")
            },
            onMainClick() {
                this.hamburger.classList.remove("is-active")
                this.menu.classList.remove("active")
                this.main.classList.remove("blur")
            }
        }
    })
})