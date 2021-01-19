const banjo = new Banjo()
let synths
const allBanjoInputs = document.querySelectorAll(".banjo input, .banjo button")

disableBanjo()
document.querySelector("#initialize").addEventListener('click', () => {
  synths = Array(5).fill('').map(x => new Tone.Synth({
    envelope: {
      attack: 0,
      attackCurve: 'linear',
      decay: 0.2,
      sustain: 0.5,
      release: 5,
      releaseCurve: 'exponential'
    }
  }).toDestination())
  document.querySelector("#initialize").setAttribute('disabled', 'disabled')
  enableBanjo()
})

banjo.addEventListener('tone', tone => {
  const stringIndex = +tone.detail.stringIndex
  synths[stringIndex].volume.value = tone.detail.volume - 80
  const noteName = Tone.Frequency(tone.detail.pitch, "midi").toNote()
  synths[stringIndex].triggerAttackRelease(noteName, 0)
})


const pickers = document.querySelectorAll("button.pick")

const handlePick = (evt) => {
  const stringIndex = +evt.target.dataset.string
  const selector = `input[name='strength-${stringIndex}']`
  const strength = +document.querySelector(selector).value
  banjo.pickString(stringIndex, strength)
}
pickers.forEach(pick => pick.addEventListener('click', handlePick))

const handleFret = (evt) => {
  const stringIndex = +evt.target.dataset.string
  const fret = +evt.target.value
  banjo.fretString(stringIndex, fret)
}
const frets = document.querySelectorAll("input.fret")
frets.forEach(fret => fret.addEventListener('change', handleFret))


function disableBanjo() {
  allBanjoInputs.forEach(input => input.setAttribute('disabled', 'disabled'))
}

function enableBanjo() {
  allBanjoInputs.forEach(input => input.removeAttribute('disabled'))
}

document.querySelector("#roll").addEventListener('click', startRoll)

function startRoll(evt) {
  const btn = event.target
  btn.innerHTML = "Stop"
  const cancelRoll = rollInterval()
  btn.removeEventListener('click', startRoll)

  btn.addEventListener('click', function stopRoll() {
    cancelRoll()
    btn.innerHTML = "Roll"
    btn.removeEventListener('click', stopRoll)
    btn.addEventListener('click', startRoll)
  })
}

function roll () {
  const rollType = document.querySelector("[name=rolls]:checked").value
  const rollFunc = getRollFunction(rollType)
  rollFunc()
}

function rollInterval() {
  roll()
  const interval = setInterval(roll, 1600)
  return () => clearInterval(interval)
}

function pickString(stringIndex, strength) {
  document.querySelector(`.string-${stringIndex} .strength`).value  = strength
  const evt = mouseClick()
  document.querySelector(`.string-${stringIndex} .pick`).dispatchEvent(evt)
}

function boxRoll() {
  setTimeout(() => pickString(2, 60), 0)
  setTimeout(() => pickString(1, 50), 200)
  setTimeout(() => pickString(4, 50), 400)
  setTimeout(() => pickString(0, 50), 600)
  setTimeout(() => pickString(3, 60), 800)
  setTimeout(() => pickString(4, 50), 1200)
  setTimeout(() => pickString(0, 50), 1200)
}

function forwardRoll() {
  setTimeout(() => pickString(2, 60), 0)
  setTimeout(() => pickString(1, 50), 200)
  setTimeout(() => pickString(0, 50), 400)
  setTimeout(() => pickString(2, 60), 600)
  setTimeout(() => pickString(1, 50), 800)
  setTimeout(() => pickString(0, 50), 1000)
  setTimeout(() => pickString(3, 60), 1200)
  setTimeout(() => pickString(0, 50), 1400)
}

function reverseRoll() {
  setTimeout(() => pickString(0, 60), 0)
  setTimeout(() => pickString(2, 50), 200)
  setTimeout(() => pickString(1, 50), 400)
  setTimeout(() => pickString(0, 60), 600)
  setTimeout(() => pickString(2, 50), 800)
  setTimeout(() => pickString(1, 50), 1000)
  setTimeout(() => pickString(3, 60), 1200)
  setTimeout(() => pickString(0, 50), 1400)
}

function getRollFunction(rollType) {
  const rollFunc = rollType === "box" ? boxRoll
                 : rollType === "forward" ? forwardRoll
                 : rollType === "reverse" ? reverseRoll
                 : () => {}
  return rollFunc
}

document.querySelector("#chordG").addEventListener('click', chordG)
document.querySelector("#chordC").addEventListener('click', chordC)
document.querySelector("#chordD7").addEventListener('click', chordD7)

function chordG() {
  document.querySelectorAll('.fret.open').forEach(input => input.dispatchEvent(mouseClick()))
}

function chordC() {
  chordG()
  document.querySelector('.string-0 .fret[value="2"]').dispatchEvent(mouseClick())
  document.querySelector('.string-1 .fret[value="1"]').dispatchEvent(mouseClick())
  document.querySelector('.string-3 .fret[value="2"]').dispatchEvent(mouseClick())
}

function chordD7() {
  chordG()
  document.querySelector('.string-1 .fret[value="1"]').dispatchEvent(mouseClick())
  document.querySelector('.string-2 .fret[value="2"]').dispatchEvent(mouseClick())
}

function mouseClick() {
  return new MouseEvent("click", { view: window, bubbles: true, cancelable: false})
}
