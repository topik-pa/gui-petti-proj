// import '../styles/style.css'

import mainMenu from '../components/shared/header/main-menu/main-menu.js'
import gotoTop from '../components/shared/goto_top/goto_top.js'
import index from '../views/index.js'
import err404 from '../views/404/404.js'

mainMenu.toggleMobileMenu()
gotoTop.init()

if (location.hash) {
  const $target = document.getElementById(location.hash.replace('#', ''))
  if ($target) {
    setTimeout(() => {
      $target.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  }
}

if (document.querySelector('body#home')) {
  index.init()
}
if (document.querySelector('body#err404')) {
  err404.init()
}
