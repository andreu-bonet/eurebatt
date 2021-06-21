import convict from 'convict'
import dotenv from 'dotenv'

dotenv.config()

const config = convict({
	port: {
		format: 'port',
		default: 80,
		env: 'PORT'
	},
	esp32: {
		ip: {
			format: String,
			default: '172.0.0.1',
			env: 'ESP32_IP'
		}
	}
})

config.validate({ allowed: 'strict' })

export { config }
