"""
This file handles communication with the databse
"""

import database_connection_exception
import requests
import configparser
import mysql.connector




class db_handler:
    def __init__(self) -> None:
        config = configparser()
        config.read("config.ini")

        self.WEBSITE_URL = config.get("website","WEBSITE_URL")
        self.database_credentials = {
            "host":config.get("database","DATABASE_URL"),
            "user":config.get("database","DATABASE_USER"),
            "password":config.get("database","DATABASE_PASSWD"),
            "database":"",
        }

    def execute_query(self, query:str, params:tuple) -> str:
        try:
            db_con = mysql.connector.connect(**self.database_credentials)
            cursor = db_con.cursor()

            cursor.execute(query, params)

            return cursor
            
        except mysql.connector.Error as e:
            raise database_connection_exception(e)
        finally:
            db_con.close()
    
    def send_msg_to_endpoint(self, endpoint:str, params:dict) -> None:
        returnValue = requests.get(
            self.WEBSITE_URL+"/"+endpoint, 
            params
        )
        
        if not returnValue.ok:
            raise database_connection_exception()
