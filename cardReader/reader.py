"""
Card reader
Main program
"""

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import db_handler
import database_connection_exception

reader = SimpleMFRC522()

database = db_handler()

try:
    id,text = reader.read()
    print(id)
    try:
        if (ist_id := database.id_lookup(id)) is not None:
            print("Recognized", ist_id)
    except database_connection_exception as e:
        print("There was an error connecting to the database")
finally:
    GPIO.cleanup()


