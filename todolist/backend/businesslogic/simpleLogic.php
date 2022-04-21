<?php
include("db/dataHandler.php");

class SimpleLogic
{

    private $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $httpmethod)
    {
        if($httpmethod==='GET'){
            switch ($method) {

                case "getAllAppointments":
                    $res = $this->dh->getAllAppointments();
                    break;
                    
                default:
                    $res = null;
                    break;
            }
        
        }elseif($httpmethod==='POST'){
            switch ($method) {
                //POST METHODS HERE  
                default:
                    $res = null;
                    break;
            }

        }elseif($httpmethod==='DELETE'){
            switch ($method) {
                //DELETE METHODS HERE  
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
