import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

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

class SkillButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cooldown: 0,
      timerRef: null,
      charges: props.maxCharges || 0
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    if (this.props.cooldown) {
      this.setState({ cooldown: this.props.cooldown })
      const timerRef = setInterval(() => {
        if (this.state.cooldown === 0) {
          clearInterval(this.state.timerRef)
          return
        }
        this.setState({ cooldown: this.state.cooldown - 1 })
      }, 1000)
      this.setState({ timerRef })
    }
    this.props.onClick()
  }

  render () {
    return (
      <button
        onClick={ this.onClick }
        disabled={ this.props.disabled() || this.state.cooldown > 0 }
      >
        { this.props.text }{ this.state.cooldown > 0 ? ' (' + this.state.cooldown + 's)' : null }
      </button>
    )
  }
}

SkillButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  cooldown: PropTypes.number.isRequired,
  maxCharges: PropTypes.number
}

const CardStatus = (props) => {
  return (
    <div>
      <div className="clearfix">
        <p className="float-left">Held:</p>
        {
          props.held !== EMPTY_CARD
            ? (
              <div className="float-right">
                <img src={props.held.image} />
                <span> <strong>The { props.held.name }</strong>
                  { ': ' + (props.held.forMelee ? '6% dmg up for melee, 3% for ranged' : '6% dmg up for ranged, 3% for melee') + '; ' + props.held.seal + ' seal' }
                </span>
              </div>
            )
            : null
        }
      </div>
      <p>Seals: <span>{ props.seals.join(', ') }</span></p>
    </div>
  )
}

CardStatus.propTypes = {
  held: PropTypes.object.isRequired,
  seals: PropTypes.array.isRequired
}

class Controls extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      held: EMPTY_CARD,
      seals: [EMPTY, EMPTY, EMPTY]
    }
    this.draw = this.draw.bind(this)
    this.redraw = this.redraw.bind(this)
    this.play = this.play.bind(this)
    this.divination = this.divination.bind(this)
    this.divinationEnabled = this.divinationEnabled.bind(this)
    this.divinationStrength = this.divinationStrength.bind(this)
  }

  draw () {
    this.setState({ held: getRandomCard() })
  }

  redraw () {
    let nextCard = this.state.held
    while (nextCard === this.state.held) {
      nextCard = getRandomCard()
    }
    this.setState({ held: nextCard })
  }

  play () {
    const nextSeals = this.state.seals
    nextSeals.push(this.state.held.seal)
    if (nextSeals.length > 3) {
      nextSeals.shift()
    }
    this.setState({
      seals: nextSeals,
      held: EMPTY_CARD
    })
  }

  divination () {
    this.setState({ seals: [EMPTY, EMPTY, EMPTY] })
  }

  divinationEnabled () {
    let count = 0
    for (let seal of this.state.seals) {
      if (seal !== EMPTY) {
        count++
      }
    }
    return count > 1
  }

  divinationStrength () {
    let nonEmptySeals = this.state.seals.filter(s => s !== EMPTY)
    if (nonEmptySeals.length !== 3) {
      return 0
    }
    const uniqueSize = new Set(nonEmptySeals).size
    if (uniqueSize <= 2) {
      return 3
    }
    return 6
  }

  render () {
    return (
      <div>
        <CardStatus held={this.state.held} seals={this.state.seals} />
        <br />
        <div className="button-row">
          <SkillButton className="skill-button" onClick={this.draw} disabled={() => this.state.held !== EMPTY_CARD} text="Draw" cooldown={30} />
          <SkillButton className="skill-button" onClick={this.redraw} disabled={() => this.state.held === EMPTY_CARD} text="Redraw" cooldown={30} maxCharges={3} />
          <SkillButton className="skill-button" onClick={this.play} disabled={() => this.state.held === EMPTY_CARD} text="Play" cooldown={0} />
          <SkillButton className="skill-button" onClick={() => {}} disabled={() => true} text="Sleeve Draw" cooldown={180} />
          <SkillButton className="skill-button" onClick={() => {}} disabled={() => true} text="Minor Arcana" cooldown={1} />
          <SkillButton className="skill-button" onClick={this.divination} disabled={() => !this.divinationEnabled()} text="Divination" cooldown={180} />
        </div>
        <br />
        <p>Divination strength: { this.divinationStrength() + '%' }</p>
      </div>
    )
  }
}

Controls.propTypes = {}

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
