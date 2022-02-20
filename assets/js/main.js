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
                hamburger: null,
                menu: null,
                main: null,
            }
        },
        mounted() {
            console.log(this.lang, this.menuList);
            this.hamburger = document.querySelector("#hamburger-btn")
            this.menu = document.querySelector(".app-menu")
            this.main = document.querySelector("main")
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