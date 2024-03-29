<?php
include("db/dataHandler.php");

class SimpleLogic
{

    private $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param, $httpmethod)
    {
        if($httpmethod==='GET'){
            switch ($method) {

                case "getAllAppointments":
                    $res = $this->dh->getAllAppointments();
                    break;
                
                case "getAppointmentDetails":
                    $res = $this->dh->getAppointmentDetails($param);
                    break;
                case "getAppointmentDetails_withUC":
                    $res=$this->dh->getAppointmentDetails_withUC($param);
                    break;
                default:
                    $res = null;
                    break;
            }
        
        }elseif($httpmethod==='POST'){
            switch ($method) {
                
                case "addAppointment":
                    $res = $this->dh->addAppointment($param);
                    break;
                case "addChoice":
                    $res=$this->dh->addChoice();
                    break;
                case "addUserChoice":
                    $res=$this->dh->addUserChoice();
                    break;
                default:
                    $res = null;
                    break;
            }

        }elseif($httpmethod==='DELETE'){
            switch ($method) {
                case "deleteAppointment":
                    $res=$this->dh->deleteAppointment($param);
                    break;  
                default:
                    $res = null;
                    break;
            }

        }else{
            return null;
        }
        return $res;
    }
}
