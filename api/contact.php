<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['type' => 'danger', 'message' => 'Please fill out all required fields.']);
    exit();
}

$to = 'thakuranit515@gmail.com';
$email_subject = "New Contact Form: $subject";
$email_body = "You have a new message from your contact form.\n\nName: $name\nEmail: $email\nSubject: $subject\nMessage: $message";

// It's best to use a 'From' email address that is on your domain to prevent emails from going to spam
$headers = "From: noreply@vancedsolutions.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(['type' => 'success', 'message' => 'Contact form successfully submitted. Thank you, I will get back to you soon!']);
} else {
    http_response_code(500);
    echo json_encode(['type' => 'danger', 'message' => 'There was an error while submitting the form. Please ensure your hosting allows PHP mail().']);
}
