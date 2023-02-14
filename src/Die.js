import { Typography, Container } from "@mui/material"

function Die(props) {
	return (
		<Container
			className='die'
			sx={{
				backgroundColor: props.isHeld ? "#59E391" : "",
			}}
			onClick={props.holdDice}>
			<Typography variant='h5' sx={{ fontFamily: "Helvetica", fontSize: 30 }}>
				{props.value}
			</Typography>
		</Container>
	)
}

export default Die
