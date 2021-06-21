import path from 'path'
import http from 'http'
import config from './config'
import express from 'express'
import { Server, Socket } from 'socket.io'

const app = express()

const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use(express.static(path.join(process.cwd(), 'public')))

io.on('connection', (socket: Socket) => {
	socket.on('command_single', data => {
		console.log(data)
		console.log(config.get('esp32.ip'))
		socket.emit('wait')
		setTimeout(() => {
			socket.emit('continue')
		}, 5000)
	})
})

httpServer.listen(config.get('port'))
