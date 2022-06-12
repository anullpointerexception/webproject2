<?php
include("./models/appointment.php");
include("db.php");

class DataHandler
{
    private $db;
    function __construct(){
        $this->db=new DbConnecter();
    }

   public function getAllAppointments(){   
        $res = $this->db->mysqli->query('SELECT * FROM appointments');
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 
    }

    public function getAppointmentDetails($id){
        $stmt=$this->db->mysqli->prepare('SELECT * FROM appointments a, appointment_choices ac WHERE a.id=? AND ac.appointmentid=a.id');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res=$stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 

    }

    public function getAppointmentDetails_withUC($id){
        $stmt=$this->db->mysqli->prepare('SELECT * FROM appointments a, appointment_choices ac, userchoice uc WHERE a.id=? AND ac.appointmentid=a.id  AND uc.terminid=ac.id');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res=$stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 
    }

    public function addAppointment(){
        $data=json_decode(file_get_contents('php://input')); //get body data 
        
        $stmt=$this->db->mysqli->prepare("INSERT INTO appointments(title, location, expirationdate, duration) VALUES(?,?,?,?)");
        $stmt->bind_param('sssi', $data->title, $data->location, $data->expirationdate, $data->duration);
        $stmt->execute();
        $lastid = $this->db->mysqli->insert_id;
        if($stmt->error){
            return null;
        }else{
            return "{\"msg\":\"success\", \"id\" : $lastid }";
        }
    }


    public function addUserChoice(){
        $data=json_decode(file_get_contents('php://input'));
        $stmt=$this->db->mysqli->prepare("INSERT INTO appointment_choices(appointmentid, termin) VALUES(?,?)");
        $stmt->bind_param('is', $data->appointmentid, $data->termin);
        $stmt->execute();
        if($stmt->error){
            return null;
        }else{
            return "{\"msg\":\"success\"}";
        }
    }

    public function deleteAppointment($id){
        $stmt=$this->db->mysqli->prepare('DELETE FROM appointments WHERE id=?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        
        if($stmt->error){
            return null;
        }else{
            return "success";
        }
    }
}
