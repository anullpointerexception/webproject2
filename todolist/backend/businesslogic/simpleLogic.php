<?php
include("db/dataHandler.php");

class SimpleLogic
{

    private $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method)
    {
        switch ($method) {

            case "getAllAppointments":
                $res = $this->dh->getAllAppointments();
                break;
                
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
