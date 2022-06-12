<?php


class DbConnecter{
    public $mysqli;
    function __construct(){
        define('DB_SERVER', 'localhost');
        define('DB_USERNAME', 'root');
        define('DB_PASSWORD', '');
        //define('DB_USERNAME', 'bif2webscriptinguser');
        //define('DB_PASSWORD', 'bif2021');
        define('DB_NAME', 'appointmentorganizer');
 
        /* Attempt to connect to MySQL database */
        $this->mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
        // Check connection
        if($this->mysqli === false){
            die("ERROR: Could not connect. " . $this->mysqli->connect_error);
        }

    }
    
}

?>