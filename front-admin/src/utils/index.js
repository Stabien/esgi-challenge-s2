import cx from 'classnames'
import { twMerge } from 'tailwind-merge'
import { numberOfLogo } from '@/utils/constant'

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
  const randomNumber = randomInt(1, numberOfLogo)
  localStorage.setItem('logoNumber', randomNumber)
}

export const getOcto = (ecart = 20) => {
  const x1 = 0 + ecart
  const y1 = 0

  const x2 = 100 - ecart
  const y2 = 0

  const x3 = 100
  const y3 = 0 + ecart

  const x4 = 100
  const y4 = 100 - ecart

  const x5 = 100 - ecart
  const y5 = 100

  const x6 = 0 + ecart
  const y6 = 100

  const x7 = 0
  const y7 = 100 - ecart

  const x8 = 0
  const y8 = 0 + ecart

  const result = `${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%,${x4}% ${y4}%, ${x5}% ${y5}%,${x6}% ${y6}%, ${x7}% ${y7}%, ${x8}% ${y8}%`
  return `polygon(${result})`
}

export const getRandomItem = (array) => {
  return array[randomInt(0, array.length)]
}
