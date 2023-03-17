import Die from "./Die"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { Button, Typography, Container, Grid } from "@mui/material"

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
	}, [dice, count])

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
		<Container
			className='main'
			sx={{
				maxWidth: "500px",
				backgroundColor: "#f5f5f5",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}>
			{tenzies && <Confetti />}
			<Typography variant='h3'>Tenzies</Typography>
			<Typography
				variant='body1'
				sx={{
					textAlign: "center",
				}}>
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</Typography>
			<Grid sx={{ gap: "20px", m: 3 }} className='dice-container'>
				{diceElement}
			</Grid>
			<Button
				sx={{ boxShadow: 3, letterSpacing: 2 }}
				variant='contained'
				onClick={rollDice}>
				{tenzies ? "New Game" : "Roll"}
			</Button>
			{!tenzies &&
				(localStorage.getItem("record") === null ? (
					<Typography variant='body1' sx={{ m: 1 }}>
						You're playing the game for the first time, Have fun.
					</Typography>
				) : (
					<Typography variant='body1' sx={{ m: 2 }}>
						the current record is {""}
						<Typography
							variant='body1'
							sx={{ textDecoration: "underline", display: "inline" }}>
							{localStorage.getItem("record")}
						</Typography>
						, try to improve it.
					</Typography>
				))}
			{tenzies && !record && (
				<Typography
					variant='h6'
					sx={{ m: 2, color: "#4a4e74", textAlign: "center" }}>
					Congragulations, you finished the game after {count} rolls
				</Typography>
			)}
			{tenzies && record && (
				<Typography
					variant='h6'
					sx={{ m: 2, color: "#4a4e74", textAlign: "center" }}>
					Congragulations, you broke the record by finishing the game after{" "}
					<Typography
						variant='h6'
						sx={{
							display: "inline",
							textDecoration: "underline",
							color: "darkseagreen",
						}}>
						{count}
					</Typography>{" "}
					rolls
				</Typography>
			)}
		</Container>
	)
}

export default App
