<?php
 
  
// Database connection details
$servername = "your_host"; // Replace with your MySQL server hostname
$username = "your_username";    // Replace with your MySQL username
$password = "your_password";    // Replace with your MySQL password
$database = "your_db"; // Replace with your MySQL database name

$vehicle_id = "your_vehicle_id"; // Replace with your vehicle id

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to retrieve data from the "truck" table
$sql = "SELECT client_id, client_secret, refresh_token FROM truck";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    // Fetch and store the values in variables
    while ($row = $result->fetch_assoc()) {
        $client_id = $row["client_id"];
        $client_secret = $row["client_secret"];
        $refresh_token = $row["refresh_token"];
    }

   
} else {
    echo "No records found in the 'truck' table.";
}

 
 


$url = 'https://dah2vb2cprod.b2clogin.com/914d88b1-3523-4bf6-9be4-1b96b4f6f919/oauth2/v2.0/token?p=B2C_1A_signup_signin_common';
$data = array(
    'grant_type' => 'refresh_token',
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'refresh_token' => $refresh_token
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

$tokenData = json_decode($result);

$accessToken = $tokenData->access_token;
$refresh_token2 = $tokenData->refresh_token;



// SQL query to retrieve data from the "truck" table
$sql2 = "UPDATE truck SET refresh_token = '$refresh_token2',date=now() where refresh_token ='$refresh_token'";
$result2 = $conn->query($sql2);

// Close the database connection
$conn->close();

?>

<?
//Post Status


 
$url = 'https://api.mps.ford.com/api/fordconnect/v1/vehicles/'.$vehicle_id.'/status';
 

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, ""); // Empty body



$headers = array();
$headers[] = 'Accept: */*';
$headers[] = 'Content-Type: application/json';
$headers[] = 'Application-Id: AFDC085B-377A-4351-B23E-5E1D35FB3700';
$headers[] = 'Authorization: Bearer '.$accessToken.'';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
}  

curl_close($ch);


 sleep(5);


//Get Status

$url = 'https://api.mps.ford.com/api/fordconnect/v3/vehicles/'.$vehicle_id.'';

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPGET, 1); // Use HTTPGET instead of POST

$headers = array();
$headers[] = 'Accept: */*';
$headers[] = 'Content-Type: application/json';
$headers[] = 'Application-Id: AFDC085B-377A-4351-B23E-5E1D35FB3700';
$headers[] = 'Authorization: Bearer '.$accessToken.'';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} 
else {
    
    $responseData = json_decode($result);
    
    if ($responseData !== null) {
        // JSON decoding was successful
      

        echo json_encode($responseData);
    } else {
        // JSON decoding failed
        echo "Failed to decode JSON response.\n";
    }
}
curl_close($ch);

?>
