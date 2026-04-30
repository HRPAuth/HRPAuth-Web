<?php
// 目标域名（不要以 / 结尾）
$target = 'http://hrpauth.samuelcheston.com';

// 获取 relay.php 后的路径部分
// REQUEST_URI 例如：/relay.php/foo/bar?x=1
$uri = $_SERVER['REQUEST_URI'];

// 去掉前缀 "/relay.php"
$prefix = '/relay.php';
if (strpos($uri, $prefix) === 0) {
    $uri = substr($uri, strlen($prefix)); // 得到 "/foo/bar?x=1"
}

// 如果为空，至少给一个 "/"
if ($uri === '') {
    $uri = '/';
}

// 构造目标 URL
$url = $target . $uri;

// 初始化 cURL
$ch = curl_init($url);

// 透传请求方法
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// 透传请求头（过滤 Host）
$headers = [];
foreach (getallheaders() as $k => $v) {
    if (strtolower($k) === 'host') continue;
    $headers[] = "$k: $v";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// 透传请求体（POST/PUT 等）
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// 返回 header + body
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

$resp_header = substr($response, 0, $header_size);
$resp_body   = substr($response, $header_size);

// 输出目标服务器的 header
foreach (explode("\r\n", $resp_header) as $h) {
    if (stripos($h, 'Transfer-Encoding:') === 0) continue;
    if (stripos($h, 'Content-Length:') === 0) continue;
    if ($h === '') continue;
    header($h);
}

// 输出 body
echo $resp_body;
