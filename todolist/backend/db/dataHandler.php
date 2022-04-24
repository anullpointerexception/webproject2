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

    public function getAppointmentDetails($id)
    {
        $stmt=$this->db->mysqli->prepare('SELECT * FROM appointments a, appointment_choices ac WHERE a.id=? AND ac.appointmentid=a.id');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res=$stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 

    }
}
