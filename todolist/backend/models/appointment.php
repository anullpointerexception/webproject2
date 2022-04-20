<?php
class Appointment {
    public $id;
    public $title;
    public $location;
    public $date;
    public $expirationdate;   

    function __construct($id, $title, $location, $date, $expirationdate) {
        $this->id = $id;
        $this->title=$title;
        $this->location=$location;
        $this->date=$date;
        $this->expirationdate=$expirationdate;
      }
}
