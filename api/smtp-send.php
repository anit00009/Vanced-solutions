<?php

function send_smtp_mail(array $smtp, $to, $subject, $body, $replyTo = null, $fromEmail = null, $fromName = null)
{
    $host = $smtp['host'] ?? 'smtp.gmail.com';
    $port = (int)($smtp['port'] ?? 587);
    $username = $smtp['username'] ?? '';
    $password = $smtp['password'] ?? '';
    $encryption = strtolower($smtp['encryption'] ?? 'tls');
    $fromEmail = $fromEmail ?: $username;
    $fromName = $fromName ?: 'Website Contact';

    if (!$username || !$password) {
        return false;
    }

    $remote = ($encryption === 'ssl' ? 'ssl://' : '') . $host;
    $socket = @fsockopen($remote, $port, $errno, $errstr, 20);
    if (!$socket) {
        return false;
    }

    stream_set_timeout($socket, 20);

    $read = function () use ($socket) {
        $data = '';
        while ($line = fgets($socket, 515)) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };

    $write = function ($command) use ($socket) {
        fwrite($socket, $command . "\r\n");
    };

    $expect = function ($response, $codes) {
        $code = (int)substr(trim($response), 0, 3);
        return in_array($code, (array)$codes, true);
    };

    if (!$expect($read(), [220])) {
        fclose($socket);
        return false;
    }

    $write('EHLO ' . gethostname());
    if (!$expect($read(), [250])) {
        fclose($socket);
        return false;
    }

    if ($encryption === 'tls') {
        $write('STARTTLS');
        if (!$expect($read(), [220])) {
            fclose($socket);
            return false;
        }
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return false;
        }
        $write('EHLO ' . gethostname());
        if (!$expect($read(), [250])) {
            fclose($socket);
            return false;
        }
    }

    $write('AUTH LOGIN');
    if (!$expect($read(), [334])) {
        fclose($socket);
        return false;
    }

    $write(base64_encode($username));
    if (!$expect($read(), [334])) {
        fclose($socket);
        return false;
    }

    $write(base64_encode($password));
    if (!$expect($read(), [235])) {
        fclose($socket);
        return false;
    }

    $write('MAIL FROM:<' . $fromEmail . '>');
    if (!$expect($read(), [250])) {
        fclose($socket);
        return false;
    }

    $write('RCPT TO:<' . $to . '>');
    if (!$expect($read(), [250, 251])) {
        fclose($socket);
        return false;
    }

    $write('DATA');
    if (!$expect($read(), [354])) {
        fclose($socket);
        return false;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers = [
        'From: ' . $encodedFromName . ' <' . $fromEmail . '>',
        'To: <' . $to . '>',
        'Subject: ' . $encodedSubject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    if ($replyTo) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.";
    $write($message);
    if (!$expect($read(), [250])) {
        fclose($socket);
        return false;
    }

    $write('QUIT');
    fclose($socket);
    return true;
}
