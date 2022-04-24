<?php
class Appointment {
    public $id;
    public $title;
    public $location;
    public $duration;
    public $expirationdate;   

    function __construct($id, $title, $location, $duration, $expirationdate) {
        $this->id = $id;
        $this->title=$title;
        $this->location=$location;
        $this->duration=$duration;
        $this->expirationdate=$expirationdate;
      }
}
