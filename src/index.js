import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import ARROW_IMG from './images/The_Arrow.png'
import SPEAR_IMG from './images/The_Spear.png'
import BALANCE_IMG from './images/The_Balance.png'
import EWER_IMG from './images/The_Ewer.png'
import SPIRE_IMG from './images/The_Spire.png'
import BOLE_IMG from './images/The_Bole.png'

const EMPTY = '___'

const ARROW = 'Arrow'
const SPEAR = 'Spear'
const BALANCE = 'Balance'
const EWER = 'Ewer'
const SPIRE = 'Spire'
const BOLE = 'Bole'

const LUNAR_SEAL = 'Lunar'
const CELESTIAL_SEAL = 'Celestial'
const SOLAR_SEAL = 'Solar'

const EMPTY_CARD = {
  name: EMPTY,
  seal: null,
  image: null
}

const CARDS = [
  {
    name: ARROW,
    seal: LUNAR_SEAL,
    image: ARROW_IMG,
    forMelee: true
  },
  {
    name: SPEAR,
    seal: CELESTIAL_SEAL,
    image: SPEAR_IMG,
    forMelee: true
  },
  {
    name: BALANCE,
    seal: SOLAR_SEAL,
    image: BALANCE_IMG,
    forMelee: true
  },
  {
    name: EWER,
    seal: LUNAR_SEAL,
    image: EWER_IMG,
    forMelee: false
  },
  {
    name: SPIRE,
    seal: CELESTIAL_SEAL,
    image: SPIRE_IMG,
    forMelee: false
  },
  {
    name: BOLE,
    seal: SOLAR_SEAL,
    image: BOLE_IMG,
    forMelee: false
  }
]

const getRandomCard = () => {
  return CARDS[Math.floor(Math.random() * Math.floor(6))]
}

const Controls = () => {
  const [main, setMain] = useState(EMPTY_CARD)
  const [seals, setSeals] = useState([EMPTY, EMPTY, EMPTY])

  const draw = () => {
    setMain(getRandomCard())
  }
  const redraw = () => {
    let nextCard = main
    while (nextCard === main) {
      nextCard = getRandomCard()
    }
    setMain(nextCard)
  }
  const play = () => {
    const nextSeals = seals
    nextSeals.push(main.seal)
    if (nextSeals.length > 3) {
      nextSeals.shift()
    }
    setSeals(nextSeals)
    setMain(EMPTY_CARD)
  }
  const divination = () => {
    setSeals([EMPTY, EMPTY, EMPTY])
  }
  const divinationEnabled = () => {
    let count = 0
    for (let seal of seals) {
      if (seal !== EMPTY) {
        count++
      }
    }
    return count > 1
  }
  const divinationStrength = () => {
    let uniqueCount = new Set(seals.filter(s => s !== EMPTY)).size
    if (uniqueCount === 2) {
      return 3
    }
    if (uniqueCount === 3) {
      return 6
    }
    return 0
  }

  return (
    <div>
      <div className="clearfix">
        <p className="float-left">Main:</p>
        {
          main !== EMPTY_CARD
            ? (
              <div className="float-right">
                <img src={main.image} />
                <span> <strong>The { main.name }</strong>
                  { ': ' + (main.forMelee ? '6% dmg up for melee, 3% for ranged' : '6% dmg up for ranged, 3% for melee') + '; ' + main.seal + ' seal' }
                </span>
              </div>
            )
            : null
        }
      </div>
      <p>Seals: <span>{ seals.join(', ') }</span></p>
      <br />
      <button onClick={draw} disabled={main !== EMPTY_CARD}>Draw</button>
      <button onClick={redraw} disabled={main === EMPTY_CARD}>Redraw</button>
      <button onClick={play} disabled={main === EMPTY_CARD}>Play</button>
      <button onClick={divination} disabled={!divinationEnabled()}>Divination</button>
      <br />
      <p>Divination strength: { divinationStrength() + '%' }</p>
      <br />
      <p>Note: <strong>Redraw</strong> has 3 charges on a 30-second charge timer.</p>
    </div>
  )
}

// TODO Minor Arcana

const Index = () => {
  return (
    <div className="content">
      <h1>5.0 AST Card System</h1>
      <br />
      <Controls />
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById('app'))
