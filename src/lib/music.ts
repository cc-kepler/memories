// Global music player — persists across page navigations

type Listener = (playing: boolean) => void
const listeners = new Set<Listener>()

let audio: HTMLAudioElement | null = null
let _playing = false
let _ended = false

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio('/陈绮贞 - 慢歌1.mp3')
    audio.addEventListener('ended', () => {
      _playing = false
      _ended = true
      listeners.forEach(fn => fn(false))
    })
  }
  return audio
}

export function isPlaying(): boolean {
  return _playing
}

export function play() {
  const a = getAudio()
  if (_playing) return
  if (_ended) {
    a.currentTime = 0
    _ended = false
  }
  a.play().catch(() => {})
  _playing = true
  listeners.forEach(fn => fn(true))
}

export function toggle(): boolean {
  const a = getAudio()
  if (_playing) {
    a.pause()
    _playing = false
  } else {
    if (_ended) {
      a.currentTime = 0
      _ended = false
    }
    a.play().catch(() => {})
    _playing = true
  }
  listeners.forEach(fn => fn(_playing))
  return _playing
}

export function subscribe(fn: Listener) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
