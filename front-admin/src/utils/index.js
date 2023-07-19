import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
  return twMerge(cx(inputs))
}

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min

export const getLogo = () => {
  if (!localStorage.getItem('logoNumber')) {
    localStorage.setItem('logoNumber', 1)
  }
  const currentLogo = localStorage.getItem('logoNumber')
  return `eyes/eyes${currentLogo}.svg`
}
export const setLogo = () => {
  const randomNumber = randomInt(1, 11)
  localStorage.setItem('logoNumber', randomNumber)
}
