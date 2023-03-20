<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    // require 'PHPMailer/src/Exception.php';
    // require 'PHPMailer/src/PHPMailer.php';
    // require 'PHPMailer/src/SMTP.php';
    require 'PHPMailer-master/src/PHPMailer.php';
    require 'PHPMailer-master/src/SMTP.php';
    require 'PHPMailer-master/src/Exception.php';

    $mail = new PHPMailer(true);
	
    $mail->CharSet = "UTF-8";
    $mail->IsHTML(true);

    // $name = $_POST["name"];
	// $phone = $_POST["phone"];
    $email = $_POST["email"];
	$subject = $_POST["subject"];
    $message = $_POST["message"];
	$email_template = "template_mail.html";

    // $body = str_replace('%name%', $name, $body);
	// $body = str_replace('%phone%', $phone, $body);
    $body = file_get_contents($email_template);
	$body = str_replace('%email%', $email, $body);
	$body = str_replace('%message%', $message, $body);

    // $mail->addAddress("support@oipax.com");
    $mail->addAddress("bekishevtair@gmail.com");
	$mail->setFrom($email, "Oipax", 0);
	$mail->setFrom($email);
    $mail->Subject = ($subject);
    $mail->MsgHTML($body);

    if (!$mail->send()) {
        $message = "Error";
    } else {
        $message = "Message sent!";
    }
	
	$response = ["message" => $message];

    header('Content-type: application/json');
    echo json_encode($response);


?>