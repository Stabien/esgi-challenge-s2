import cx from 'classnames'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => {
  return twMerge(cx(inputs))
}
