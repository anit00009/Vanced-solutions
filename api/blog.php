<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$adminPassword = getenv('BLOG_ADMIN_PASSWORD') ?: 'change-this-password';
$inputJSON = file_get_contents('php://input');
$payload = json_decode($inputJSON, true);

if (!$payload || !is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input or empty request body.']);
    exit();
}

if (empty($payload['password']) || $payload['password'] !== $adminPassword) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid admin password.']);
    exit();
}

if (empty($payload['posts']) || !is_array($payload['posts'])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Missing blog posts.']);
    exit();
}

$cleanPosts = [];
foreach ($payload['posts'] as $post) {
    if (!$post || !is_array($post) || empty($post['title'])) {
        continue;
    }

    $content = [];
    if (isset($post['content']) && is_array($post['content'])) {
        foreach ($post['content'] as $c) {
            if (!empty($c)) {
                $content[] = (string)$c;
            }
        }
    }

    $cleanPosts[] = [
        'id' => preg_replace('/[^a-z0-9-]/', '', strtolower((string)($post['id'] ?? ''))),
        'title' => trim((string)($post['title'] ?? '')),
        'category' => trim((string)($post['category'] ?? 'Insights')),
        'excerpt' => trim((string)($post['excerpt'] ?? '')),
        'image' => trim((string)($post['image'] ?? 'Images/en-insight-img1.png')),
        'author' => trim((string)($post['author'] ?? 'Vanced Solutions')),
        'date' => trim((string)($post['date'] ?? date('Y-m-d'))),
        'readTime' => trim((string)($post['readTime'] ?? '5 min read')),
        'content' => $content
    ];
}

$dataToWrite = json_encode(['posts' => $cleanPosts], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
$dataPath = __DIR__ . '/../blog-data.json';

if (file_put_contents($dataPath, $dataToWrite) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to write blog-data.json. Check file permissions. Make sure the server has write access to the file.']);
    exit();
}

echo json_encode(['success' => true, 'message' => 'Blog posts saved.']);
