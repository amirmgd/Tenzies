import Die from "./Die"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function App() {
	const [dice, setDice] = useState(allNewDice())
	const [tenzies, setTenzies] = useState(false)
	const [count, setCount] = useState(0)
	const [record, setRecord] = useState(false)

	useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld)
		const firstValue = dice[0].value
		const allSame = dice.every((die) => die.value === firstValue)
		if (allHeld && allSame) {
			setTenzies(true)
			if (localStorage.getItem("record") === null) {
				localStorage.setItem("record", count)
			} else if (localStorage.getItem("record") > count) {
				localStorage.setItem("record", count)
				setRecord(true)
			}
		}
	}, [dice])

	function dieGenerator() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(dieGenerator())
		}
		return newDice
	}

	function rollDice() {
		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : dieGenerator()
				})
			)
			setCount((prevCount) => (prevCount += 1))
		} else {
			setDice(allNewDice())
			setTenzies(false)
			setCount(0)
			setRecord(false)
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die
			})
		)
	}
	const diceElement = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	))

	return (
		<div className='main'>
			{tenzies && <Confetti />}

			<h1 className='title'>Tenzies</h1>
			<p className='instruction'>
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className='dice-container'>{diceElement}</div>
			<button className='roll' onClick={rollDice}>
				{tenzies ? "New Game" : "Roll"}
			</button>

			{tenzies && !record && (
				<h3 className='records'>
					Congragulations, you finished the game after {count} rolls
				</h3>
			)}
			{tenzies && record && (
				<p className='records'>
					Congragulations, you broke the record by finishing the game after{" "}
					<bold className='record-num'>{count}</bold> rolls
				</p>
			)}
		</div>
	)
}

export default App
