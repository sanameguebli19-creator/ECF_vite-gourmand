<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$nom     = $data['nom'];
$email   = $data['email'];
$menu_id = $data['menu_id'];
$qty     = $data['quantite'];

$stmt = $pdo->prepare("INSERT INTO commandes (nom, email, menu_id, quantite)
VALUES (?, ?, ?, ?)");

$stmt->execute([$nom, $email, $menu_id, $qty]);

echo json_encode(["message" => "Commande enregistrée"]);