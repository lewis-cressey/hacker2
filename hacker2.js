const SECTIONS = document.querySelectorAll("section")
const NAV = document.querySelector("nav")
const QUESTIONS = []
let SCORE = 0

function updateNav() {
	NAV.innerHTML = `Hacker score = ${SCORE} out of 10`
}

class Question {
	constructor() {
		this.element = SECTIONS[QUESTIONS.length]
		this.questionNo = QUESTIONS.length + 1
		QUESTIONS.push(this)
		
		this.isSolved = false

		const h2 = document.createElement("h2")
		h2.textContent = `Question ${this.questionNo}`
		this.element.insertBefore(h2, this.element.firstChild)

		this.alertLayer = document.createElement("div")
		this.alertLayer.className = "alert-layer suppressed"
		this.alertLayer.textContent = "SOLVED!"		
		this.element.insertBefore(this.alertLayer, this.element.firstChild)
	}
	
	solve() {
		if (this.isSolved) return
		this.isSolved = true
		u(this.alertLayer).removeClass("suppressed")
		SCORE += 1
		updateNav()
	}
}

class TextQuestion extends Question {
	constructor(md5) {
		super()
		this.inputElement = this.element.querySelector("input")
		this.inputElement.addEventListener("input", e => this.check())
	}
	
	solve() {
		super.solve()
		this.inputElement.setAttribute("disabled", true)
	}
	
	check() {
		const value = this.inputElement.value.toUpperCase().replace(/\s+/g, "")
		const answerMd5 = md5(value)
		const correctMd5 = this.inputElement.getAttribute("data-md5")
		if (answerMd5 === correctMd5) {
			this.solve()
		} else {
			console.log(`MD5=${answerMd5}`)
		}
	}
}

function main() {
	updateNav()
	for (let section of u("section").nodes) {
		new TextQuestion(section)
	}
	Lightense(".lightbox")
}

main()
