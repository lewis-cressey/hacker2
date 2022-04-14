const SECTIONS = document.querySelectorAll("section")
const NAV = document.querySelector("nav")
const QUESTIONS = []
let SCORE = 0

function updateNav() {
	NAV.innerHTML = `Hacker score = ${SCORE} out of ${QUESTIONS.length}`
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
		this.inputElement.remove()
		const tray = u("<div class='tray'>")
		this.markSymbol = u("<div class='mark'>").nodes[0]
		const checkButton = u("<button>Check answer</button>").nodes[0]

		tray.append(checkButton)
		tray.append(this.inputElement)
		tray.append(this.markSymbol)
		
		u(this.element).append(tray)
		
		checkButton.addEventListener("click", e => this.check())
	}
	
	solve() {
		super.solve()
		this.inputElement.setAttribute("disabled", true)
	}
	
	check() {
		const value = this.inputElement.value.toUpperCase().replace(/\s+/g, "")
		const correctMd5 = this.inputElement.getAttribute("data-md5")
		let match = false

		for (let i = 1; i <= value.length && !match; i += 1) {
			const answerMd5 = md5(value.slice(0, i))
			if (answerMd5 === correctMd5) match = true
		}

		if (match) {
			this.solve()
			this.markSymbol.innerHTML = "&#x2713;"
		} else {
			console.log(`MD5=${md5(value)}`)
			this.markSymbol.innerHTML = "&#x274c;"
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
