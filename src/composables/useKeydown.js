import { onBeforeUnmount } from 'vue'

let useKeydown = (keyCombos) => {
  let onKeydown = (event) => {
    //console.log(keyCombos.find((kc) => kc.key == event.key))
    let kc = keyCombos.find((kc) => kc.key == event.key)
    if (kc) {
      kc.fn()
    }
  }
  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
export default useKeydown
