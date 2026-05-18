<?php
/**
 * Copy to config.php and fill in your Gmail App Password.
 * Create one at: https://myaccount.google.com/apppasswords
 */
return [
    'to_email' => 'hr@vancedsolutions.com',
    'from_email' => 'noreply@vancedsolutions.com',
    'from_name' => 'Vanced Solutions Website',
    'smtp' => [
        'enabled' => true,
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'your@gmail.com',
        'password' => 'your-gmail-app-password',
        'encryption' => 'tls',
    ],
];
