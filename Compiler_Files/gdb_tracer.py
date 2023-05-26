# gdb_tracer.py
#
# The python script to trace the execution of the debugged program.
# Should be used from within GDB interface:
#
# gdb <program>
# (gdb) set args <arg0> <arg1> <arg2>
# (gdb) source gdb_tracer.py
#
# The traced instructions will be written to 'gdb-log.txt'.

import gdb
import re

def count_mem_access(instr_str):
    arrow = instr_str.find('=>')
    colon = instr_str.find(':', arrow + 2)
    instr_str = instr_str[colon:]
    opcode = re.search('[a-zA-Z]+', instr_str).group(0)

    if opcode[0:3] == 'ldr' or opcode[0:3] == 'str':
        try:
            register = re.search('\[[^\[\]]+\]', instr_str).group(0)
            return 1
        except AttributeError:
            print("[python] can't find registers in %s instruction" % opcode)
    elif opcode == 'push' or opcode == 'pop' or opcode[0:3] == 'ldm' or opcode[0:3] == 'stm':
        try:
            registers = re.search('\{[a-zA-Z0-9,\ ]+\}', instr_str).group(0)
            return registers.count(',') + 1
        except AttributeError:
            print("[python] can't find registeres in %s instruction" % opcode)
    
    return 0

gdb.execute('break main')
gdb.execute('run')

# Obtains the name of the assembly source file.
source_name = gdb.execute('frame', to_string=True)
source_name = re.search('[a-zA-Z0-9_-]+\.s:[0-9]+', source_name).group(0)
source_name = source_name[:source_name.find(':')]

# Every executed instruction will be written to this file.
f = open('gdb-log.txt', 'w')
total_memory_access_count = 0

# Executes 900 instructions in the compiled program, or terminate when the 
# program ends, whichever is earlier.
# Instructions that don't belong to the assembly program generated from 
# MiniJava compiler do not count towards this number.
# When your project is graded, each test case will be ran with a certain
# maximum number of instructions, just in case that the program runs forever.
for x in range(900):
	try:
		frame_str = gdb.execute('frame', to_string=True)
		source_location = re.search('[a-zA-Z0-9_-]+\.s:[0-9]+', frame_str).group(0)
	except AttributeError:
		source_location = ''
	except gdb.error:
		print("[python] program terminated prematurely")
		break

	instruction_str = gdb.execute('x/1iw $pc', to_string=True)

	# Runs the next instruction until the program exits.
	try:
		if frame_str.find(source_name) == -1:
			# Current frame is not the .s file generated from MiniJava compiler.
			# Issues GDB 'finish' command to execute until the end of the function.
			gdb.execute('finish')
		else:
			total_memory_access_count += count_mem_access(instruction_str)
			gdb.execute('stepi', to_string=True)
	except gdb.error:
		print("[python] program has terminated")
		break

	gdb.flush()
	f.write('['+source_location+']'+instruction_str)

print("[python] Total memory access count = %d" % total_memory_access_count)
f.write("[python] Total memory access count = %d" % total_memory_access_count)
f.close()