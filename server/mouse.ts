import robot from 'robotjs'
import { LogerType } from './logger'
import { RobotCommand, SequenceData } from './types'

function robot_command(logger: LogerType, command: RobotCommand) {
	logger.log(command.d)
	if (command.x && command.y) {
		robot.moveMouse(command.x, command.y)
		robot.mouseClick('left', command.t === 'dclick')
	} else if (command.t === 'key' && command.v) {
		robot.typeString(command.v)
	} else if (command.t === 'enter') {
		robot.keyTap('enter')
	}
}

function getFileName(sequence: SequenceData) {
	return [
		`date(${new Date().toISOString().split('T')[0]})`,
		`time(${new Date()
			.toISOString()
			.split('T')[1]
			.split('.')[0]
			.replace(/:/g, '-')})`,
		`duration(${sequence.duration}min)`,
		`potential(${sequence.potential}V)`,
		`stirring(${sequence.stirring ? sequence.stirring_rpm : 0})`,
		`bicarbonate(${1.5})`,
		`catalyst(${'Sn_bulk'})`
	].join('_')
}

function startClicks1680x1050(seq: SequenceData) {
	return [
		{ t: 'click', x: 174, y: 1030, d: 'Open program' },
		{ t: 'click', x: 611, y: 213, d: 'Potencial icon' },
		{ t: 'click', x: 1514, y: 215, d: 'Potencial input' },
		{ t: 'click', x: 1514, y: 215, d: 'Potencial input clear' },
		{ t: 'key', v: `${seq.potential}`.replace('.', ','), d: 'Potencial value' },
		{ t: 'click', x: 729, y: 214, d: 'Duration icon' },
		{ t: 'click', x: 1594, y: 213, d: 'Duration input' },
		{ t: 'click', x: 1594, y: 213, d: 'Duration input clear' },
		{ t: 'key', v: `${seq.duration * 60}`, d: 'Duration value' },
		{ t: 'click', x: 1591, y: 242, d: 'Interval input' },
		{ t: 'click', x: 1591, y: 242, d: 'Interval input clear' },
		{ t: 'key', value: `${seq.interval}`.replace('.', ','), d: 'Interval val' },
		{ t: 'click', x: 997, y: 127, d: 'Start' },
		{ t: 'click', x: 174, y: 1030, d: 'Close program' }
	]
}

function startClicks1920x1080(seq: SequenceData) {
	return [
		{ t: 'click', x: 169, y: 1058, d: 'Open program' },
		{ t: 'click', x: 611, y: 212, d: 'Potencial icon' },
		{ t: 'click', x: 1755, y: 214, d: 'Potencial input' },
		{ t: 'click', x: 1755, y: 214, d: 'Potencial input clear' },
		{ t: 'key', v: `${seq.potential}`.replace('.', ','), d: 'Potencial value' },
		{ t: 'click', x: 722, y: 208, d: 'Duration icon' },
		{ t: 'click', x: 1832, y: 213, d: 'Duration input' },
		{ t: 'click', x: 1832, y: 213, d: 'Duration input clear' },
		{ t: 'key', v: `${seq.duration * 60}`, d: 'Duration value' },
		{ t: 'click', x: 1832, y: 241, d: 'Interval input' },
		{ t: 'click', x: 1832, y: 241, d: 'Interval input clear' },
		{ t: 'key', v: `${seq.interval}`.replace('.', ','), d: 'Interval value' },
		{ t: 'click', x: 1236, y: 126, d: 'Start' },
		{ t: 'click', x: 171, y: 1058, d: 'Close program' }
	]
}

function recordClicks1680x1050(sequence: SequenceData) {
	return [
		{ t: 'click', x: 174, y: 1030, d: 'Open program' },
		{ t: 'click', x: 254, y: 74, d: 'Results tab' },
		{ t: 'dclick', x: 187, y: 860, d: 'Plot icon' },
		{ t: 'click', x: 1022, y: 131, d: 'Show data' },
		{ t: 'click', x: 1635, y: 132, d: 'Export data' },
		{ t: 'click', x: 1654, y: 165, d: 'File format dropdown' },
		{ t: 'click', x: 1609, y: 213, d: 'Excel option' },
		{ t: 'click', x: 1637, y: 225, d: 'Export' },
		{ t: 'key', v: getFileName(sequence), d: 'File name' },
		{ t: 'enter', d: 'Save' },
		{ t: 'click', x: 298, y: 77, d: 'Close results tab' },
		{ t: 'click', x: 174, y: 1030, d: 'Close program' }
	]
}

function recordClicks1920x1080(sequence: SequenceData) {
	return [
		{ t: 'click', x: 169, y: 1058, d: 'Open program' },
		{ t: 'click', x: 175, y: 72, d: 'Results tab' },
		{ t: 'dclick', x: 221, y: 887, d: 'Plot icon' },
		{ t: 'click', x: 1259, y: 131, d: 'Show data' },
		{ t: 'click', x: 1876, y: 129, d: 'Export data' },
		{ t: 'click', x: 1894, y: 168, d: 'File format dropdown' },
		{ t: 'click', x: 1853, y: 210, d: 'Excel option' },
		{ t: 'click', x: 1880, y: 227, d: 'Export' },
		{ t: 'key', v: getFileName(sequence), d: 'File name' },
		{ t: 'enter', d: 'Save' },
		{ t: 'click', x: 298, y: 76, d: 'Close results tab' },
		{ t: 'click', x: 171, y: 1058, d: 'Close program' }
	]
}

function autoclickStart(
	logger: LogerType,
	sequence: SequenceData,
	resolution: {
		width: number
		height: number
	}
) {
	const commands =
		resolution.width === 1680 && resolution.height === 1050
			? startClicks1680x1050(sequence)
			: startClicks1920x1080(sequence)

	commands.forEach(command => robot_command(logger, command))
}

function autoclickRecord(
	logger: LogerType,
	sequence: SequenceData,
	resolution: {
		width: number
		height: number
	}
) {
	const commands =
		resolution.width === 1680 && resolution.height === 1050
			? recordClicks1680x1050(sequence)
			: recordClicks1920x1080(sequence)

	commands.forEach(command => robot_command(logger, command))
}

export { autoclickStart, autoclickRecord }
