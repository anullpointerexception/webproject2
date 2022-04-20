<?php
include("./models/appointment.php");
include("db.php");

class DataHandler
{
    private $db;
    function __construct(){
        $this->db=new DbConnecter();
    }

   public function getAllAppointments()
    {   
        $res = $this->db->mysqli->query('SELECT * FROM appointments');
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 
    }
}
