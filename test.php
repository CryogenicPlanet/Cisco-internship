<?php 
header('Access-Control-Allow-Origin: *'); 
  $username = $_REQUEST['email'];
  $password = $_REQUEST['pword'];
  if ($username == "rahultarak12345@gmail.com") {
      echo "Sucessful Login";
  }
?>