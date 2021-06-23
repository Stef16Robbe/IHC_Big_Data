from datetime import datetime

class Logger:
	base_log = ""
	
	def __init__(self):
		self.base_log = str(datetime.now().strftime("%d/%m/%Y %H:%M:%S") + ": ")

	def prRed(self, skk): return "\033[91m{}\033[00m"  .format(skk)
	def prYellow(self, skk): return "\033[93m{}\033[00m" .format(skk)

	def create_message(self, msg, type=None):
		message = "\n"
		base = type + " " + self.base_log + msg
		for i in range(len(base)): message += "="
		message += "\n" + base + "\n"
		for i in range(len(base)): message += "="
		message += "\n"

		if type == "ERROR":
			print(self.prRed(message))
		elif type == "WARN":
			print(self.prYellow(message))
		elif type == "INFO":
			print(message)

	def info(self, msg):
		self.create_message(msg, "INFO")

	def err(self, msg):
		self.create_message(msg, "ERROR")

	def warn(self, msg):
		self.create_message(msg, "WARN")
