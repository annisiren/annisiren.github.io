<?php

    // $name = $_POST['name'];
    // $visitor_email = $_POST['email'];
    // $message = $_POST['message'];
    //
    // $email_from = "asiren@eecs.yorku.ca";//<== update the email address
	// $email_subject = "New Form submission";
	// $email_body = "You have received a new message from the user $name.\n".
	//     "Here is the message:\n $message".
    //
    //
    // $to = "asiren@eecs.yorku.ca";//<== update the email address
	// $headers = "From: $email_from \r\n";
	// $headers .= "Reply-To: $visitor_email \r\n";
	// //Send the email!
	// // mail($to,$email_subject,$email_body,$headers);
	// //done. redirect to thank-you page.
	// header('Location: index.html');
    //
    // // $headers = array ('From' => $from,
    // //     'To' => $to,
    // //     'Subject' => $subject);
    //  $smtp = Mail::factory('smtp',
    //    array ('host' => $host,
    //      'auth' => true,
    //      'username' => $username,
    //      'password' => $password));
    //
    //  $mail = $smtp->send($to, $email_subject, $email_body, $headers);
    //
    //  if (PEAR::isError($mail)) {
    //    echo("<p>" . $mail->getMessage() . "</p>");
    //   } else {
    //    echo("<p>Message successfully sent!</p>");
    //   }
    //

    require_once "Mail.php";

    $from = "Sandra Sender <sender@example.com>";
    $to = "Ramona Recipient <recipient@example.com>";
    $subject = "Hi!";
    $body = "Hi,\n\nHow are you?";

    $host = "mail.gdom.net";
    $username = "lfc hosted email";
    $password = "email password";

    $headers = array ('From' => $from,
      'To' => $to,
      'Subject' => $subject);
    $smtp = Mail::factory('smtp',
      array ('host' => $host,
        'auth' => true,
        'username' => $username,
        'password' => $password));

    $mail = $smtp->send($to, $headers, $body);

    if (PEAR::isError($mail)) {
      echo("<p>" . $mail->getMessage() . "</p>");
     } else {
      echo("<p>Message successfully sent!</p>");
     }



  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */



  // Replace contact@example.com with your real receiving email address
  // $receiving_email_address = 'asiren@eecs.yorku.ca';

  // if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
  //   include( $php_email_form );
  // } else {
  //   die( 'Unable to load the "PHP Email Form" Library!');
  // }

  // $name = $_POST['name'];
  // print $name;
  // print "Hello there";

  // echo("<script>console.log('PHP: " . $name . "');</script>");
  // echo("<script>console.log('PHP: " . 'Hello world' . "');</script>");

  // $contact = new PHP_Email_Form;
  // $contact->ajax = true;
  //
  // $contact->to = $receiving_email_address;
  // $contact->from_name = $_POST['name'];
  // $contact->from_email = $_POST['email'];
  // $contact->subject = $_POST['subject'];
  //
  // $contact->add_message( $_POST['name'], 'From');
  // $contact->add_message( $_POST['email'], 'Email');
  // $contact->add_message( $_POST['message'], 'Message', 10);
  //
  // echo $contact->send();


?>
