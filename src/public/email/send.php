<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

//PHPMailer Object
$mail = new PHPMailer(true); //Argument true in constructor enables exceptions
$mail->CharSet = "utf-8";
// $mail->IsSMTP(); // enable SMTP
// $mail->SMTPAuth = true; // authentication enabled
// $mail->Host = "smtp.zoner.com";
// $mail->Port = 587; // or 587
// $mail->Username = "support@example.com";
// $mail->Password = "yGiCRNt98GkHFF/P0Yt+";

//From email address and name
if (isset($_GET['email'])) {
    $emailFrom = $_GET['email'];
    $emailLang = isset($_GET['language']) ? $_GET['language'] : 'en';
    $emailName = $_GET['name'];
    $emailSurname = $_GET['surname'];
    $emailVars = array(
        'email' => $emailFrom,
        'lang' => $emailLang,
        'name' => $emailName,
        'surname' => $emailSurname
    );
    $body = file_get_contents('templates/email_' . $emailLang . '.html');
    if(isset($emailVars)){
        foreach($emailVars as $k=>$v){
            $body = str_replace('{'.strtoupper($k).'}', $v, $body);
        }
    }
    
    $mail->From = 'support@example.com'; // CHANGE TO support@BRAND.com
    $mail->FromName = 'Example';

    //To address and name
    $mail->addAddress($emailFrom, $emailName);

    //Address to which recipient will reply
    $mail->addReplyTo("support@example.com", 'Example');

    //Send HTML or Plain Text email
    $mail->isHTML(true);
    $sbjArr = array(
        'en' => "Example email title EN",
        'cs' => "Example email title CS"
    );
    $mail->Subject = $sbjArr[$emailLang];
    $mail->MsgHTML($body);

    try {
        $mail->send();
        return "SUCCESS";
    } catch (Exception $e) {
        return "ERROR: " . $mail->ErrorInfo;
    }
} else {
    echo "INVALID OR MISSING PARAMS";
}