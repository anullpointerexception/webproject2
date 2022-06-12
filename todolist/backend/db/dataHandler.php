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

    public function getAppointmentDetails($id){ //get the details for an appointment
        $stmt=$this->db->mysqli->prepare('SELECT * FROM appointments a, appointment_choices ac WHERE a.id=? AND ac.appointmentid=a.id');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res=$stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        
        return $rows; 

    }

    public function getAppointmentDetails_withUC($id){ //get the details for an appointment including the userchoices
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

    public function addChoice(){ //add a choice to an appointment
        $data=json_decode(file_get_contents('php://input'));
        $stmt=$this->db->mysqli->prepare("INSERT INTO appointment_choices(appointmentid, termin) VALUES(?,?)");
        $stmt->bind_param('is', $data->appointmentid, $data->termin);

        $stmt->execute();
        if($stmt->error){ //return null on error f.e: appointmentid not in appointment table (foreign key cant reference)
            return null;
        }else{
            return "{\"msg\":\"success\"}";
        } 
    }

    public function addUserChoice(){ //submit a user choice
        $data=json_decode(file_get_contents('php://input'));
        //check if a user with the same name already voted for this appointment
        $stmt=$this->db->mysqli->prepare('SELECT * FROM userchoice WHERE terminid=? AND name=?');
        $stmt->bind_param('is', $data->appointment_choices_id, $data->name);
        $stmt->execute();
        $res=$stmt->get_result();
        
        if($res->num_rows!==0){
            echo "user already voted";
            return null;
        }

        $stmt=$this->db->mysqli->prepare("INSERT INTO userchoice(terminid, name, comment) VALUES(?,?,?)");
        $stmt->bind_param('iss', $data->appointment_choices_id, $data->name, $data->comment);
        
        $stmt->execute();
        if($stmt->error){ //return null on error f.e: appointmentid not in appointment table (foreign key cant reference)
            return null;
        }else{
            return "success";
        } 
    }

    public function deleteAppointment($id){ //delete appointment with given id
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
