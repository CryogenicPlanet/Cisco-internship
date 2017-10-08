<?php 
header('Access-Control-Allow-Origin: *'); 
  $username = $_REQUEST['email'];
  $password = $_REQUEST['pword'];
  if ($username == "rahultarak12345@gmail.com") {
      header("HTTP/1.1 200 OK");
      echo "Sucessful Login ";
  } else {
      header("HTTP/1.1 401 Unauthorized");
      echo "Invalid Login ".$username;
  }
?>