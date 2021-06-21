import network
import usocket
from machine import Pin
from time import sleep_us
from time import ticks_ms
from utime import ticks_add
from utime import ticks_diff

class Stepper:
	def __init__(self, stp_pin, dir_pin, pow_pin, microstepping):
		self.stp = Pin(stp_pin, Pin.OUT)
		self.dir = Pin(dir_pin, Pin.OUT)
		self.pow = Pin(pow_pin, Pin.OUT, value=0)
		self.microstepping = microstepping

	def power_on(self):
		self.pow.value(0)

	def power_off(self):
		self.pow.value(1)

	def set_direction(self, direction):
		self.dir.value(direction)

	def rotate_steps(self, steps, rpm):
		if steps < 0:
			self.set_direction(0)
		else:
			self.set_direction(1)

		sleep_duration_us = 150000 // rpm

		for i in range(abs(steps)):
			self.stp.value(1)
			sleep_us(sleep_duration_us)
			self.stp.value(0)
			sleep_us(sleep_duration_us)

	def rotate_mm(self, mm, rpm):
		self.power_on()
		# full_rev = 360
		# step_angle = 1.8
		# pitch_mm = 8
		# steps_per_mm = (full_rev / step_angle) / pitch_mm
		steps_per_mm = 25
		steps = mm * steps_per_mm * self.microstepping
		self.rotate_steps(steps, rpm)
		self.power_off()

	def rotate_ms(self, duration_ms, rpm):
		self.power_on()
		self.set_direction(1)
		deadline = ticks_add(ticks_ms(), duration_ms)
		while ticks_diff(deadline, ticks_ms()) > 0:
			self.rotate_steps(1, rpm)
		self.power_off()

class Single:
	def __init__(self, pin, engage_value=0, disengage_value=1):
		self.pin = Pin(pin, Pin.OUT)
		self.engage_value = engage_value
		self.disengage_value = disengage_value
		self.disengage()

	def status(self):
		return self.pin.value

	def engage(self):
		self.pin.value(self.engage_value)

	def disengage(self):
		self.pin.value(self.disengage_value)

	def activate(self, duration_ms):
		self.engage()
		deadline = ticks_add(ticks_ms(), duration_ms)
		while ticks_diff(deadline, ticks_ms()) > 0:
			pass
		self.disengage()

class Endpoint:
	def __init__(self, pin):
		self.pin = Pin(pin, Pin.IN)

	def status(self):
		return self.pin.value()

def wifiConnect(ssid, password):
	station = network.WLAN(network.STA_IF)
	
	if station.isconnected():
		return station.ifconfig()

	if not station.active():
		station.active(True)
	
	station.connect(ssid, password)

	while not station.isconnected():
		pass

	return station.ifconfig()

# Component declarations
stirrer_stepper = Stepper(stp_pin=19, dir_pin=21, pow_pin=18, microstepping=1)
syringe_stepper = Stepper(stp_pin=32, dir_pin= 5, pow_pin=33, microstepping=32)
sampler_stepper = Stepper(stp_pin= 2, dir_pin= 4, pow_pin=15, microstepping=32)
perist_pump = Single(pin=26, engage_value=0, disengage_value=1)
catho_valve = Single(pin=27, engage_value=1, disengage_value=0)
anode_valve = Single(pin=14, engage_value=1, disengage_value=0)
endpoint = Endpoint(pin=25)

# Setup
stirrer_stepper.power_off()
sampler_stepper.power_off()
syringe_stepper.power_off()
perist_pump.disengage()
catho_valve.disengage()
anode_valve.disengage()

# Wifi Connect
print(wifiConnect('Eurecat_Lab', 'Eureca2021!'))

# Socket open
socket = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)
socket.bind(('', 3000))
socket.listen(5)

# Infinite listening loop
while True:
	# Read http request and parse command
	conn, addr = socket.accept()
	payload = conn.recv(1024).decode('utf-8')
	command = payload.split('\r\n')[-1].split(' ')
	print(command)

	# Switch by command type
	if command[0] == 'stirring':
		duration_ms = int(command[1])
		rpm = 150
		if len(command) > 2:
			rpm = int(command[2])
		stirrer_stepper.rotate_ms(duration_ms, rpm)

	elif command[0] == 'cathode':
		duration_ms = int(command[1])
		catho_valve.activate(duration_ms)

	elif command[0] == 'anode':
		duration_ms = int(command[1])
		anode_valve.activate(duration_ms)

	elif command[0] == 'peristaltic':
		duration_ms = int(command[1])
		perist_pump.activate(duration_ms)

	elif command[0] == 'syringe':
		steps = int(command[1])
		mm = steps // 800
		rpm = 150 # int(command[2])
		syringe_stepper.rotate_mm(mm, rpm)

	elif command[0] == 'autosampler':
		mm = int(command[1])
		rpm = 15000 # int(command[2])
		sampler_stepper.rotate_mm(mm, rpm)

	elif command[0] == 'autosampler_zeroing':
		rpm = int(command[1])
		sampler_stepper.set_direction(1)
		sampler_stepper.power_on()
		while endpoint.status() == 1:
			sampler_stepper.rotate_steps(1, rpm)
		sampler_stepper.power_off()

	# Send http 200 response when done
	conn.send('HTTP/1.1 200 OK\n')
	conn.send('Content-Type: text/plain\n')
	conn.send('Connection: close\n\n')
	conn.sendall('Done')
	conn.close()
