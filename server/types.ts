interface RobotCommand {
	t: string
	x?: number
	y?: number
	v?: string
	d: string
}

interface SequenceData {
	repetitions: number
	duration: number
	stirring: boolean
	stirring_rpm: number
	potential: number
	interval: number
	cleaning_cycles: number
	cleaning_duration: number
}

export { RobotCommand, SequenceData }
