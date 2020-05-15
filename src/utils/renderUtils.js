import numeral from 'numeral'

export function renderPercentages (text) {
  return numeral(text).format('0%')
}

export function renderMoney (text) {
  return numeral(text).format('0,0.00')
}

export function renderMoneyInt (text) {
  return numeral(text).format('0,0')
}
