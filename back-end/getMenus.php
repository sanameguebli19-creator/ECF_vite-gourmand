<?php
require 'db.php';

$stmt = $pdo->query("SELECT * FROM menus");
$menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($menus);