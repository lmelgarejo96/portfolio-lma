var lang = localStorage.getItem("lang") || "es";
var glangs = ["es", "en"]
let lsAccesibleName = "accesibilityOPTS";
let timeOutBar = null;
let timeOutSpeech = null;
let zoom = 0;
let voices = [];
let voiceActive = false;
let tourElements = []

// dark = light

const options = [{
        name: "Aumentar texto",
        icon: "fas fa-search-plus",
        action: increaseText
    },
    {
        name: "Disminuir texto",
        icon: "fas fa-search-minus",
        action: decreaseText
    },
    {
        name: "Escala de grises",
        icon: "fas fa-adjust",
        dataName: "grayScale",
        action: grayScale
    },
    {
        name: "Alto contraste",
        icon: "fas fa-sun",
        dataName: "highContrast",
        action: highContrast
    },
    {
        name: "Estilo ligero",
        icon: "fas fa-lightbulb",
        dataName: "negativeContrast",
        action: negativeContrast
    },
    {
        name: "Subrayar enlaces",
        icon: "fas fa-underline",
        dataName: "underlineLinks",
        action: underlineLinks
    },
    {
        name: "Fuente legible",
        icon: "fas fa-font",
        dataName: "readableFont",
        action: readableFont
    },
    {
        name: "Audio parlante",
        icon: "fas fa-volume-up",
        dataName: "talkingAudio",
        action: talkingAudio
    },
    {
        name: "Tour automático",
        icon: "fa fa-caret-square-o-right",
        dataName: "tourPage",
        action: tourPage
    },
    {
        name: "Restablecer",
        icon: "fas fa-undo-alt",
        action: restore
    },
]


function activeAccesibilityMenu(ev) {
    document.querySelector(".accesibility-bar").classList.toggle("active-accesibility")
}

function openAccesibility() {
    if (timeOutBar) clearTimeout(timeOutBar);
    document.querySelector(".accesibility-bar").classList.add("active-accesibility")
}

function closeAccesibility() {
    if (timeOutBar) clearTimeout(timeOutBar);
    timeOutBar = setTimeout(() => {
        document.querySelector(".accesibility-bar").classList.remove("active-accesibility")
    }, 1200);
}

function renderAccesibilityList() {
    const UL = document.createElement("ul");
    UL.classList.add("accesibility-bar");
    UL.setAttribute("role", "list");
    const ACTIVATOR = document.createElement("button");
    ACTIVATOR.setAttribute("role", "button");
    ACTIVATOR.setAttribute("aria-label", "Herramientas de accesibilidad");
    ACTIVATOR.setAttribute("aria-pressed", "false");
    ACTIVATOR.classList.add("accesibility-activator");
    if (isMobile()) {
        ACTIVATOR.addEventListener("click", activeAccesibilityMenu);
    } else {
        UL.addEventListener("mouseover", () => openAccesibility())
        UL.addEventListener("mouseleave", () => closeAccesibility())
        ACTIVATOR.addEventListener("mouseover", () => openAccesibility())
        ACTIVATOR.addEventListener("mouseleave", () => closeAccesibility())
    }
    const ICON = document.createElement("i");
    ICON.setAttribute("class", "fab fa-accessible-icon");
    ACTIVATOR.appendChild(ICON);
    ACTIVATOR.addEventListener("click", activeAccesibilityMenu);
    UL.appendChild(ACTIVATOR);
    const OVERLAY = document.createElement("DIV")
    OVERLAY.classList.add("app-accesibility-overlay")
    document.body.appendChild(OVERLAY)
    options.forEach(opt => {
        const LI = document.createElement("li");
        const I = document.createElement("i");
        const SPAN = document.createElement("span");
        LI.setAttribute("data-name", opt.dataName || opt.name)
        I.setAttribute("class", opt.icon);
        SPAN.innerText = opt.name;
        LI.appendChild(I);
        LI.appendChild(SPAN);
        LI.setAttribute("role", "listitem");
        LI.setAttribute("aria-label", `${opt.name}`);
        if (opt.dataName == "talkingAudio") {
            const SELECT_LANG = document.createElement("select");
            SELECT_LANG.setAttribute("id", "voices-select");
            SELECT_LANG.setAttribute("style", "display: block; width: 100%;");
            SELECT_LANG.addEventListener("change", handleVoiceChange)
            LI.appendChild(SELECT_LANG)
        }
        UL.appendChild(LI);
    })
    return UL;
}

function validateClass(className, el) {
    const BODY = document.querySelector("body." + className);
    if (!BODY) {
        return el.classList.remove("active-item");
    }
    return el.classList.add("active-item");
}

function increaseText(ev) {
    if (zoom < 2) {
        zoom += 1;
    }

    switch (zoom) {
        case 1:
            document.body.classList.add("zoom-1");
            document.body.classList.remove("zoom-2");
            break;
        case 2:
            document.body.classList.remove("zoom-1");
            document.body.classList.add("zoom-2");
            break;
    }
    saveAccesibility(localStorage.getItem(lsAccesibleName), "zoom", zoom);
}

function decreaseText(ev) {
    if (zoom > 0) {
        zoom -= 1;
    }

    switch (zoom) {
        case 0:
            document.body.classList.remove("zoom-1");
            document.body.classList.remove("zoom-2");
            break;
        case 1:
            document.body.classList.add("zoom-1");
            document.body.classList.remove("zoom-2");
            break;
    }
    saveAccesibility(localStorage.getItem(lsAccesibleName), "zoom", zoom);
}

function grayScale(ev, el) {
    document.body.classList.toggle("gray-scale");
    document.documentElement.classList.toggle("gray-scale");
    validateClass("gray-scale", el || this);
    saveAccesibility(localStorage.getItem(lsAccesibleName), "grayScale", "gray-scale");
}

function highContrast(ev, el) {
    document.body.classList.remove("dark");
    document.body.classList.toggle("high-contrast");
    document.querySelectorAll(".accesibility-bar li")[4].classList.remove("active-item");
    validateClass("high-contrast", el || this);
    saveAccesibility(localStorage.getItem(lsAccesibleName), "highContrast", "high-contrast");
}

function negativeContrast(ev, el) {
    document.body.classList.remove("high-contrast");
    document.body.classList.toggle("dark");
    document.querySelectorAll(".accesibility-bar li")[3].classList.remove("active-item");
    validateClass("dark", el || this);
    saveAccesibility(localStorage.getItem(lsAccesibleName), "negativeContrast", "dark");
}

function lightStyle(ev, el) {
    document.body.classList.toggle("light-style");
    document.body.classList.remove("dark")
}

function underlineLinks(ev, el) {
    document.body.classList.toggle("underline-links");
    validateClass("underline-links", el || this);
    saveAccesibility(localStorage.getItem(lsAccesibleName), "underlineLinks", "underline-links");
}

function readableFont(ev, el) {
    document.body.classList.toggle("readable-font");
    validateClass("readable-font", el || this);
    saveAccesibility(localStorage.getItem(lsAccesibleName), "readableFont", "readable-font");
}



function talkingAudio(ev, el) {
    if (ev && ev.target.nodeName == "SELECT") return;
    document.body.classList.toggle("voice-active");
    validateClass("voice-active", el || this)
    if ([...document.body.classList].indexOf("voice-active") > -1) {
        selectedAllLinks()
        voiceActive = true;
    } else {
        unSelectedAllLinks()
        voiceActive = false;
    }
    saveAccesibility(localStorage.getItem(lsAccesibleName), "talkingAudio", "voice-active");
}

function disableVoiceActive() {
    voiceActive = false;
    document.querySelectorAll(".accesibility-bar li")[7].classList.remove("active-item");
    unSelectedAllLinks()
    document.body.classList.remove("voice-active");
    saveAccesibility(localStorage.getItem(lsAccesibleName), "talkingAudio", "voice-active");
}

let cloneArrElements = []

function disableTourActive(paused) {
    voiceActive = false;
    if (timeOutSpeech) clearTimeout(timeOutSpeech)

    if (!paused) {
        document.body.classList.remove("tour-active");
        document.querySelectorAll(".accesibility-bar > li")[8].classList.remove("active-item");
        speechSynthesis.cancel();
        cloneArrElements = []
    }
    /* else {
           speechSynthesis.pause();
       } */
}


function resumeTour() {
    //disableVoiceActive()
    if (cloneArrElements && cloneArrElements.length == 0) {
        disableTourActive()
        return
    }
    voiceActive = true;
    document.body.classList.add("tour-active");
    document.querySelectorAll(".accesibility-bar > li")[8].classList.add("active-item");

    if (speechSynthesis) speechSynthesis.cancel()
    if (timeOutSpeech) clearTimeout(timeOutSpeech)
    timeOutSpeech = setTimeout(() => playElementsTour(cloneArrElements), 500);
}

function tourPage(ev) {
    // pasar arr elements
    document.body.classList.toggle("tour-active");
    cloneArrElements = []
    disableVoiceActive()
    validateClass("tour-active", ev.currentTarget || this);
    if ([...document.body.classList].indexOf("tour-active") > -1) {
        voiceActive = true;
    } else {
        disableTourActive()
        return;
    }
    const firstElement = {
        scroll: 0,
        el: document.querySelector(".app-accesibility-overlay"),
        text: gLang == 'en' ?
            "Hello, you are about to start the automatic tour of the page. If you want to cancel the tour, press the automatic tour button again" : "Hola, estás a punto de iniciar el tour automático por la pagina. Si deseas cancelar el tour vuelve a presionar en el botón de tour automático.\n"
    }
    document.querySelectorAll(".scroll-item").forEach(el => {
        el.classList.remove("scroll-item");
        el.classList.remove("active-top")
    })
    const allElements = [firstElement, ...getTimelineTourElements()]
    playElementsTour(allElements)

}



function playElementsTour(elements) {
    cloneArrElements = [...elements]
    if (timeOutSpeech) clearTimeout(timeOutSpeech)
    if (!voiceActive) return;
    if (elements && elements.length == 0) {
        // tour finalizado
        disableTourActive()
        return
    };

    const currentElement = elements[0]

    if (currentElement.el) {
        currentElement.el.classList.add("tour-item-active")
        currentElement.el.classList.remove("scroll-item")
        currentElement.el.classList.remove("active-top")
        currentElement.el.classList.remove("d-none")
    }

    currentElement.el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    const newElements = [...elements]
    newElements.shift()
    playByText("es-ES", currentElement.text, () => {})
        .then(() => {
            timeOutSpeech = setTimeout(() => {
                if (currentElement.el) currentElement.el.classList.remove("tour-item-active")
                playElementsTour(newElements)
            }, 500);
        })
        .catch(() => {
            timeOutSpeech = setTimeout(() => {
                if (currentElement.el) currentElement.el.classList.remove("tour-item-active")
                playElementsTour(newElements)
            }, 500)
        })
}

function getTimelineTourElements(gap = 150) {

    const timelineElements = []

    tourElements.forEach(el => {

        if (NodeList.prototype.isPrototypeOf(el)) {
            el.forEach(subEl => {
                timelineElements.push({
                    el: subEl,
                    scroll: (subEl.scrollTop || subEl.offsetTop || subEl.scrollTop) - gap,
                    text: getTextByElement(subEl)
                })
            })
        } else {
            timelineElements.push({
                el: el,
                scroll: (el.scrollTop || el.offsetTop || subEl.scrollTop) - gap,
                text: getTextByElement(el)
            })
        }
    })
    return timelineElements
}

function readText(text) {
    speak(text)
}

function loadVoices() {
    voices = speechSynthesis.getVoices();

}

function getTextByElement(el) {
    return el.getAttribute("title") || el.getAttribute("aria-label") || el.getAttribute("alt") || el.innerText;
}

function handleMouseOver(ev) {
    const el = ev.currentTarget
    el.classList.add("active");
    if (voiceActive) {
        const text = getTextByElement(el);
        readText(text);
        return;
    }
}

function handleLinkClick(event) {
    const el = event.currentTarget
    el.classList.remove("active");
    el.removeEventListener("mouseenter", handleMouseOver);
    el.removeEventListener("focus", handleMouseOver);
    el.removeEventListener("touchstart", handleMouseOver);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el.removeEventListener("touchend", handleMouseLeave);
    el.removeEventListener("blur", handleMouseLeave);
    if (voiceActive) {
        const text = getTextByElement(el)
        readText(`Dirigiendonos a: ${text}`);
        return;
    }
}

function handleMouseLeave(ev) {
    const el = ev.currentTarget
    el.classList.remove("active");
    speechSynthesis.cancel();
}

function restore(ev) {
    document.body.classList.remove("zoom-1");
    document.body.classList.remove("zoom-2");
    document.body.classList.remove("images-name");
    document.body.classList.remove("readable-font");
    document.body.classList.remove("underline-links");
    document.body.classList.remove("light-style");
    document.body.classList.remove("negative-contrast");
    document.body.classList.remove("high-contrast");
    document.body.classList.remove("gray-scale");
    document.body.classList.remove("dark");
    document.body.classList.remove("voice-active");
    document.body.classList.remove("tour-active");
    disableTourActive()
    disableVoiceActive()
    document.querySelectorAll(".accesibility-bar li").forEach(li => li.classList.remove("active-item"));
    voiceActive = false;
    setDefaultAccesibilityOPTS();
}

var executeAccesibility = (tourElementsProp) => {

    document.body.appendChild(renderAccesibilityList());
    const elements = document.querySelectorAll(".accesibility-bar > li");

    elements.forEach((li, i) => {
        li.addEventListener("click", options[i].action);
    })

    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    tourElements = tourElementsProp;

    loadVoicesWhenAvailable(function() {})
    loadAccesibilityHistory();

    console.log("Accesibility Works!");
}

const readableElements = "a, h1, h2, h3, h4, h5, h6, p, .accesibility-bar li, .accesibility-activator, .readable, img, .switch"

function selectedAllLinks() {
    document.querySelectorAll(readableElements).forEach(el => {
        if (el.innerHTML == "" && el.nodeName != "IMG") {
            el.remove();
            return;
        }
        el.addEventListener("mouseenter", handleMouseOver);
        el.addEventListener("focus", handleMouseOver);
        el.addEventListener("touchstart", handleMouseOver, { passive: true });
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("blur", handleMouseLeave);
        el.addEventListener("touchend", handleMouseLeave, { passive: true });
    })
}

function unSelectedAllLinks() {
    document.querySelectorAll(readableElements).forEach(el => {
        el.removeEventListener("mouseenter", handleMouseOver);
        el.removeEventListener("focus", handleMouseOver);
        el.removeEventListener("touchstart", handleMouseOver, { passive: true });
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("blur", handleMouseLeave);
        el.removeEventListener("touchend", handleMouseLeave, { passive: true });
    })
}

function saveAccesibility(obj, opt, value) {
    try {
        if (!obj) return setDefaultAccesibilityOPTS();
        obj = JSON.parse(obj);
        if (typeof obj != 'object') return;
        let newOBJ = {...obj };
        if (opt != "zoom" && opt != "vLangSelected") {
            if ([...document.body.classList].indexOf(value) > -1) {
                newOBJ[opt] = true;
                if (opt == "negativeContrast") {
                    newOBJ['highContrast'] = false;
                }
                if (opt == "highContrast") {
                    newOBJ['negativeContrast'] = false;
                }
            } else {
                newOBJ[opt] = false;
            }
        } else {
            newOBJ[opt] = value;
        }

        localStorage.setItem(lsAccesibleName, JSON.stringify(newOBJ));
    } catch (error) {
        setDefaultAccesibilityOPTS();
    }
}

function loadAccesibilityHistory() {
    try {
        let accesibilityOPTS = localStorage.getItem(lsAccesibleName);
        if (!accesibilityOPTS) return setDefaultAccesibilityOPTS();
        accesibilityOPTS = JSON.parse(accesibilityOPTS);
        if (typeof accesibilityOPTS != 'object') return setDefaultAccesibilityOPTS();
        zoom = accesibilityOPTS.zoom;
        if (zoom > 0) increaseText();
        if (accesibilityOPTS.grayScale) {
            grayScale(null, document.querySelector("[data-name='grayScale']"));
        }
        if (accesibilityOPTS.highContrast) {
            highContrast(null, document.querySelector("[data-name='highContrast']"));
        }
        if (accesibilityOPTS.negativeContrast) {
            negativeContrast(null, document.querySelector("[data-name='negativeContrast']"));
        }
        if (accesibilityOPTS.underlineLinks) {
            underlineLinks(null, document.querySelector("[data-name='underlineLinks']"));
        }
        if (accesibilityOPTS.readableFont) {
            readableFont(null, document.querySelector("[data-name='readableFont']"));
        }
        if (accesibilityOPTS.talkingAudio) {
            talkingAudio(null, document.querySelector("[data-name='talkingAudio']"));
        }
    } catch (error) {
        setDefaultAccesibilityOPTS();
    }
}

function setDefaultAccesibilityOPTS() {
    const DEFAULT_OPTS = {
        zoom: 0,
        graysCale: false,
        highContrast: false,
        negativeContrast: false,
        underlineLinks: false,
        readableFont: false,
        talkingAudio: false,
    }
    localStorage.setItem(lsAccesibleName, JSON.stringify(DEFAULT_OPTS));
}


let _speechSynth
let _voices
const _cache = {}
let _voiceSelected = {}
let timeOut = null


function renderVoicesList(voices) {

    const LANG_SELECT = document.getElementById("voices-select");
    LANG_SELECT.innerHTML = ""
    console.log("voces a renderizar", voices);
    voices.forEach((voi, idx) => {
        const OPT = document.createElement("option");
        OPT.innerText = voi.name.toString().toUpperCase();
        OPT.setAttribute("value", voi.lang + (idx + 1));
        OPT.setAttribute("style", "max-width:100%; overflow: hidden;");
        LANG_SELECT.appendChild(OPT);
    })

}

function handleVoiceChange(ev) {
    console.log("voice changed", ev);
    document.getElementById("voices-select").value = ev.target.value;
    const val = ev.target.value;
    if (!val) return;
    const voiceFounded = _voices.find((vo, idx) => (vo.lang + (idx + 1)) == val);
    if (!voiceFounded) return;
    _voiceSelected = voiceFounded;
    saveAccesibility(localStorage.getItem(lsAccesibleName), "vLangSelected", {
        default: voiceFounded.default,
        lang: voiceFounded.lang,
        localService: voiceFounded.localService,
        name: voiceFounded.name,
        voiceURI: voiceFounded.voiceURI,
    });
}

function loadLSVoiceSelected() {
    try {
        const obj = JSON.parse(localStorage.getItem(lsAccesibleName));
        if (!obj) return setDefaultLang();
        if (!obj.vLangSelected) return setDefaultLang();
        if (typeof obj.vLangSelected != "object") return setDefaultLang();
        const voiceLS = obj.vLangSelected;
        let indexF = -1;
        const voiceFounded = _voices.find((vo, idx) => {
            if (vo.lang == voiceLS.lang && vo.voiceURI == voiceLS.voiceURI) {
                indexF = idx;
                return true;
            }
        });
        if (!voiceFounded) return setDefaultLang();
        handleVoiceChange({ target: { value: (voiceFounded.lang + (indexF + 1)) } })
        console.log("invocando voices LS");
    } catch (error) {
        setDefaultLang();
    }

}

var setDefaultLang = (langProp) => {

    const LANG_SELECT = document.getElementById("voices-select");

    if (!glangs.includes(lang)) lang = 'es';

    if (langProp) {
        alert("Cambiando lang desde: " + lang + " a: " + langProp)
        lang = langProp;
        const voicesPerLang = _voices.filter(vo => vo.lang.indexOf(`${lang}`) > -1)
        alert("Voices: " + JSON.stringify(voicesPerLang.map(vo => vo.lang).join("_")))
        renderVoicesList(voicesPerLang);
    }

    let opt = LANG_SELECT.querySelectorAll("option")[0];

    if (!opt) {
        const noSpeechMsg = {
            en: "The Browser does not support the Web Speech api in the selected language",
            es: "El Navegador no soporta el api Weeb Speech en el idioma seleccionado"
        }
        alert(noSpeechMsg[lang])
        return
    }

    LANG_SELECT.value = opt.getAttribute("value")

    alert("Lang encontrado: " + opt.getAttribute("value"))

    handleVoiceChange({ target: { value: opt.getAttribute("value") } })
}

function loadVoicesWhenAvailable(onComplete = () => {}) {
    _speechSynth = window.speechSynthesis
    const voices = _speechSynth.getVoices()
    if (voices.length !== 0) {
        _voices = voices
        renderVoicesList(_voices.filter(vo => vo.lang.indexOf(`${lang}`) > -1))
        loadLSVoiceSelected();
        //selectedAllLinks();
        onComplete()
    } else {
        return setTimeout(function() { loadVoicesWhenAvailable(onComplete) }, 100)
    }
}


function getVoices(locale) {
    if (!_speechSynth) {
        throw new Error('Browser does not support speech synthesis')
    }
    if (_cache[locale]) return _cache[locale]

    _cache[locale] = _voices.filter(voice => voice.lang === locale)
    return _cache[locale]
}

function playByText(locale, text, onEnd) {

    return new Promise((resolve, reject) => {

        const voices = [_voiceSelected]
        const utterance = new window.SpeechSynthesisUtterance()
        utterance.voice = voices[0]
        utterance.pitch = 1
        utterance.rate = 1
        utterance.voiceURI = _voiceSelected._voiceSelected || 'native'
        utterance.volume = 1
        utterance.rate = 1
        utterance.pitch = 0.8
        utterance.text = text
        utterance.lang = _voiceSelected.lang || locale

        if (onEnd) {
            utterance.onend = resolve
        }

        utterance.onerror = reject

        _speechSynth.cancel()
        _speechSynth.speak(utterance)
    })
}



function isMobile() {
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
}

function speak(text) {
    if (isMobile()) {
        if (timeOut) {
            clearTimeout(timeOut);
        };
        timeOut = setTimeout(() => playByText(isMobile() ? "es-ES" : "es-MX", text), 300);
        return;
    }
    playByText(isMobile() ? "es-ES" : "es-MX", text)
}

/* document.addEventListener('DOMContentLoaded', function() {
    try {
        disableVoiceActive()
        disableTourActive()
    } catch (error) {}
}) */

const terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';

addEventListener(terminationEvent, function(event) {
    disableTourActive()
}, { capture: true });

// Visibility API 
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

if (typeof document.addEventListener === "undefined" || hidden === undefined) {
    console.warn("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

function handleVisibilityChange(ev) {
    if (document[hidden]) {

        [...document.body.classList].includes("tour-active") ? disableTourActive(true) : disableTourActive();

    } else {
        resumeTour()
    }
}