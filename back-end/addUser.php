<?php
require_once "database.php";

$password = password_hash("123456", PASSWORD_DEFAULT);

$sql = "INSERT INTO users (prenom, email, password) VALUES (?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute(["Julie", "test@mail.com", $password]);

echo "Utilisateur ajouté ✅";
?>