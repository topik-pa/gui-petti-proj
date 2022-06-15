const mainMenu = {
  toggleMobileMenu: () => {
    const header = document.querySelector('header')
    const menuIcon = header.querySelector('.icon-menu')
    const menu = header.querySelector('nav')
    menuIcon.addEventListener('click', () => {
      menu.classList.toggle('show')
    })
  }
}

export default mainMenu
