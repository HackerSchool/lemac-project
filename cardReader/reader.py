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


def id_lookup(id:int) -> int:
        """
        returns: istID associated with it
                 -1 if not in the database
        """ 
        pass

def send_card_information(ist_id:int):
    database.send_msg_to_endpoint(
        "cardEndpoint", {"ist_id":ist_id}
    )

try:
    mifare_id,text = reader.read()
    print(id)
    try:
        # Ceck if there is an ist_id associated with this mifare_id
        if (card_ist_id := id_lookup(mifare_id)) is not None:
            print("Recognized", card_ist_id)
            send_card_information(card_ist_id)
        # Association not found
        else:
            print("New card detected with MIFARE ID", id)
            send_card_information(-1)

    except database_connection_exception as e:
        print("There was an error connecting to the database")
        
        # TODO: ERR LED FLASHING
finally:
    GPIO.cleanup()

