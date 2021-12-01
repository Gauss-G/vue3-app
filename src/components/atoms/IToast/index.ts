import { createApp } from 'vue'
import IToast from './IToast.vue'

export function toast(props) {
  let box = document.getElementById('toast-panel')
  if (!box) {
    box = document.createElement('div')
    if (props.position === 'right')
      box.style = 'position: fixed;right: 50px;top: 120px;width: 50%;z-index: 11111;text-align: center;'
    else
      box.style = 'position: fixed;left: 0;bottom: 0;width: 100%;z-index: 11111;text-align: center;'

    box.id = 'toast-panel'
    document.body.appendChild(box)
  }
  const index = box.children.length + 1
  const children = document.createElement('div')
  children.id = `toast-panel-children${index}`
  box.appendChild(children)
  const vm = createApp(IToast, {
    close: () => {
      vm.unmount(children)
      children.remove()
      if (box.children.length <= 0)
        box?.remove()
    },
    ...props,
  })
  vm.mount(children)
}
