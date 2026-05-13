<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('success' => false, 'message' => 'Only POST requests are allowed.'));
    exit;
}

$adminPassword = getenv('BLOG_ADMIN_PASSWORD') ?: 'change-this-password';
$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload) || !isset($payload['password']) || !hash_equals($adminPassword, $payload['password'])) {
    http_response_code(401);
    echo json_encode(array('success' => false, 'message' => 'Invalid admin password.'));
    exit;
}

if (!isset($payload['posts']) || !is_array($payload['posts'])) {
    http_response_code(422);
    echo json_encode(array('success' => false, 'message' => 'Missing blog posts.'));
    exit;
}

$cleanPosts = array();

foreach ($payload['posts'] as $post) {
    if (!is_array($post) || empty($post['title'])) {
        continue;
    }

    $content = isset($post['content']) && is_array($post['content'])
        ? array_values(array_filter(array_map('strval', $post['content'])))
        : array();

    $cleanPosts[] = array(
        'id' => preg_replace('/[^a-z0-9-]/', '', strtolower($post['id'] ?? '')),
        'title' => trim((string) ($post['title'] ?? '')),
        'category' => trim((string) ($post['category'] ?? 'Insights')),
        'excerpt' => trim((string) ($post['excerpt'] ?? '')),
        'image' => trim((string) ($post['image'] ?? 'Images/en-insight-img1.png')),
        'author' => trim((string) ($post['author'] ?? 'Vanced Solutions')),
        'date' => trim((string) ($post['date'] ?? date('Y-m-d'))),
        'readTime' => trim((string) ($post['readTime'] ?? '5 min read')),
        'content' => $content
    );
}

$json = json_encode(array('posts' => $cleanPosts), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

if ($json === false || file_put_contents(__DIR__ . '/blog-data.json', $json . PHP_EOL, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'Unable to write blog-data.json. Check file permissions.'));
    exit;
}

echo json_encode(array('success' => true, 'message' => 'Blog posts saved.'));
