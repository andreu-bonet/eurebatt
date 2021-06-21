import path from 'path'
import http from 'http'
import { config } from './config'
import express from 'express'
import axios from 'axios'
import robot from 'robotjs'
import { Server, Socket } from 'socket.io'
import { SequenceData } from './types'
import { autoclickRecord, autoclickStart } from './mouse'
import { Logger, LogerType } from './logger'

const app = express()
robot.setMouseDelay(500)

const httpServer = http.createServer(app)
const io = new Server(httpServer)

const resolution = robot.getScreenSize()
console.log(resolution)

app.use(express.static(path.join(process.cwd(), 'public')))

const vialCoords = [0, 20, 40, 60, 80, 100, 156, 176, 196, 216, 236, 256]
const middleCoords = 128

async function sendCmd(logger: LogerType, command: string, desc?: string) {
	if (desc) logger.log(desc)
	await axios
		.post(config.get('esp32.ip'), command)
		.catch(err => console.log(err.message))
}

async function sequenceSetup(logger: LogerType) {
	await sendCmd(logger, 'autosampler_zeroing 7500', 'Zeroing autosampler')
	await sendCmd(
		logger,
		`autosampler ${-middleCoords}`,
		`Moving autosampler ${-middleCoords} mm`
	)
	await sendCmd(logger, 'peristaltic 7500', 'Activating peristaltic pump 7.5 s')
	await sendCmd(logger, 'cathode 10000', 'Opening cathodic compartment 10 s')
	await sendCmd(logger, 'anode 10000', 'Opening anodic compartment 10 s')
	await sendCmd(logger, 'syringe -12000', 'Rotating syringe -12000 steps')
	await sendCmd(logger, 'cathode 10000', 'Opening cathodic compartment 10 s')
	await sendCmd(logger, 'anode 10000', 'Opening anodic compartment 10 s')
}

async function sequenceExecute(
	logger: LogerType,
	seq: SequenceData,
	vialDistance: number
) {
	await sendCmd(
		logger,
		`autosampler ${vialDistance}`,
		`Moving autosampler ${vialDistance} mm`
	)
	await sendCmd(logger, 'syringe -8500', 'Rotating syringe -8500 steps')

	logger.log('==> START AUTOCLICKING')
	logger.push('autoclick')

	autoclickStart(logger, seq, resolution)

	logger.pop()
	logger.log('==> END AUTOCLICKING')

	logger.log('==> START STIRRING')
	if (seq.stirring) {
		await sendCmd(
			logger,
			`stirring ${seq.duration * 60000} ${seq.stirring_rpm}`,
			`Stirring for ${(seq.duration * 60).toFixed(0)} s`
		)
	} else {
		await new Promise(r => setTimeout(r, seq.duration * 60000))
		logger.log(`Waiting for ${(seq.duration * 60).toFixed(0)} s`)
	}
	logger.log('==> END STIRRING')

	await sendCmd(logger, 'cathode 10000', 'Opening cathodic compartment 10 s')
	await sendCmd(logger, 'anode 10000', 'Opening anodic compartment 10 s')

	logger.log('==> START AUTOCLICKING')
	logger.push('autoclick')

	autoclickRecord(logger, seq, resolution)

	logger.pop()
	logger.log('==> END AUTOCLICKING')

	logger.log('==> START CLEANING')
	await sendCmd(
		logger,
		`autosampler ${-vialDistance}`,
		`Moving autosampler ${-vialDistance} mm`
	)

	for (let cleanIdx = 0; cleanIdx < seq.cleaning_cycles; cleanIdx++) {
		logger.log(`==> START CLEANING CYCLE #${cleanIdx + 1}`)
		logger.push(`clean #${cleanIdx + 1}`)

		await sendCmd(
			logger,
			'peristaltic 8200',
			'Activating peristaltic pump 8.2 s'
		)
		await sendCmd(
			logger,
			`stirring ${seq.cleaning_duration * 1000}`,
			`Stirring for ${seq.cleaning_duration} s`
		)
		await sendCmd(logger, 'cathode 10000', 'Opening cathodic compartment 10 s')
		await sendCmd(logger, 'anode 10000', 'Opening anodic compartment 10 s')

		logger.pop()
		logger.log(`==> END CLEANING CYCLE #${cleanIdx + 1}`)
	}

	logger.log('==> END CLEANING')
}

io.on('connection', (socket: Socket) => {
	const logger = Logger(socket)

	socket.on('command_single', async command => {
		socket.emit('wait')
		console.log(command)
		await sendCmd(logger, command)
		socket.emit('continue')
	})

	socket.on('sequence', async (sequences: SequenceData[]) => {
		console.log(sequences)

		socket.emit('wait')
		logger.log('==> START SETUP')
		logger.push('setup')

		await sequenceSetup(logger)

		logger.pop()
		logger.log('==> END SETUP')

		let idx = 0

		for (const [seqIdx, sequence] of sequences.entries()) {
			logger.log(`==> START SEQUENCE #${seqIdx + 1}`)
			logger.push(`seq #${seqIdx + 1}`)

			for (let repIdx = 0; repIdx < sequence.repetitions; repIdx++) {
				logger.log(`==> START REPETITION #${repIdx + 1}`)
				logger.push(`rep #${repIdx + 1}`)

				await sequenceExecute(
					logger,
					sequence,
					middleCoords - vialCoords[idx++]
				)

				logger.pop()
				logger.log(`==> END REPETITION #${repIdx + 1}`)
			}

			logger.pop()
			logger.log(`==> END SEQUENCE #${seqIdx + 1}`)
		}

		logger.log('==> FINISHED!!!')
		socket.emit('continue')
	})
})

httpServer.listen(config.get('port'), () =>
	console.log(`Runing on port ${config.get('port')}`)
)
