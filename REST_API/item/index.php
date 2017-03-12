<?php
  session_start();
  // Display all warnings
  ini_set('display_errors', '1');
  ini_set('display_startup_errors', '1');
  error_reporting(E_ALL);
  ob_start();
?>
<?php 
	$link = mysqli_connect();
	if (mysqli_connect_errno()) {
		printf("Connection failed: %s\n", mysqli_connect_error());
		exit();
	}

	$id=$_GET['id'];
	$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Id='$id'";

	if (($result=mysqli_query($link, $query)) === false) {
	  	printf("Query failed: %s <br />\n%s", $query, mysqli_error($link));
	  	exit();
	}
	$res=mysqli_fetch_assoc($result);

	$quantities = '';
	$query2="SELECT * FROM ocs_quantity WHERE Id='$id'";
	$result2=mysqli_query($link, $query2);
	$rowcount=mysqli_num_rows($result2);
	$i = 1;
	while ($row=$result2->fetch_object()) {
		$element = '{"Size":"'.$row->Size.'", "Color":"'.$row->Color.'", "Quantity":"'.$row->Quantity.'"}';
		if ($i != $rowcount){
			$quantities .= $element.',';
		}else{
			$quantities .= $element;
		}
		$i = $i + 1;
	}
	$data='{"Id":"'.$res['Id'].'", "Name":"'.$res['Title'].'", "Category":"'.$res['Category'].'", "Gender":"'.$res['Gender'].'", "Price":"'.$res['Price'].'", "Description":"'.$res['Description'].'", "Country":"'.$res['Country'].'", "imageUrl":"'.$res['Image_url'].'", "Quantities":['.$quantities.']}';

	print_r($data);
	mysqli_free_result($result);
	mysqli_free_result($result2);
	header('Access-Control-Allow-Origin: *');
?>