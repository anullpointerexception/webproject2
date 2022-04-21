<?php
include("businesslogic/simpleLogic.php");

$method = "";

header("Access-Control-Expose-Headers: GET, POST, DELETE");

isset($_GET["method"]) ? $method = $_GET["method"] : false;

$logic = new SimpleLogic();
$result = $logic->handleRequest($method, $_SERVER['REQUEST_METHOD']);
if ($result == null) {
    response($_SERVER['REQUEST_METHOD'], 400, null);
} else {
    response($_SERVER['REQUEST_METHOD'], 200, $result);
}


function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');

    switch ($method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        case "POST":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        case "DELETE":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
