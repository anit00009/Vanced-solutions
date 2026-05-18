<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['type' => 'danger', 'message' => 'Method not allowed.']);
    exit();
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['type' => 'danger', 'message' => 'Please fill out all required fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['type' => 'danger', 'message' => 'Please enter a valid email address.']);
    exit();
}

$configFile = __DIR__ . '/config.php';
$config = file_exists($configFile) ? require $configFile : [];

$to = $config['to_email'] ?? 'hr@vancedsolutions.com';
$fromEmail = $config['from_email'] ?? 'noreply@vancedsolutions.com';
$fromName = $config['from_name'] ?? 'Vanced Solutions Website';
$emailSubject = 'New Contact Form: ' . ($subject !== '' ? $subject : 'No subject');
$emailBody = "You have a new message from your contact form.\n\n"
    . "Name: $name\n"
    . "Email: $email\n"
    . "Subject: $subject\n"
    . "Message:\n$message\n";

$sent = false;
$smtp = $config['smtp'] ?? [];

if (!empty($smtp['enabled'])) {
    require_once __DIR__ . '/smtp-send.php';
    $sent = send_smtp_mail($smtp, $to, $emailSubject, $emailBody, $email, $fromEmail, $fromName);
}

if (!$sent) {
    $headers = "From: $fromName <$fromEmail>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $sent = @mail($to, $emailSubject, $emailBody, $headers);
}

if ($sent) {
    echo json_encode([
        'type' => 'success',
        'message' => 'Contact form successfully submitted. Thank you, we will get back to you soon!'
    ]);
    exit();
}

http_response_code(500);
echo json_encode([
    'type' => 'danger',
    'message' => 'Could not send your message. Add your Gmail SMTP details in api/config.php (see api/config.example.php).'
]);
