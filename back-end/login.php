<?php
session_start();
require_once "database.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user["password"])) {

  $_SESSION["user"] = $user["prenom"];

  echo json_encode([
    "success" => true,
    "message" => "Connexion réussie"
  ]);

} else {

  echo json_encode([
    "success" => false,
    "message" => "Identifiants incorrects"
  ]);
}