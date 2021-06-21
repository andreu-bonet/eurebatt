import { Socket } from 'socket.io'

const Logger = (socket: Socket) => {
	const tags: string[] = []

	return {
		log: (msg: string) => {
			const time = Date().split(' ')[4]
			const tagt = ` [${tags.join('] [')}]`
			socket.emit('info', `${time} |${tags.length ? `${tagt}` : ''} ${msg}`)
		},
		push: (tag: string) => {
			tags.push(tag)
		},
		pop: () => {
			tags.pop()
		}
	}
}

interface LogerType {
	log: (msg: string) => void
	push: (tag: string) => void
	pop: () => void
}

export { Logger, LogerType }
