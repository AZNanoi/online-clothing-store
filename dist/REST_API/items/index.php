<?php
  session_start();
  // Display all warnings
  ini_set('display_errors', '1');
  ini_set('display_startup_errors', '1');
  error_reporting(E_ALL);
  ob_start();
?>
<?php 
	$link = mysqli_connect('ahzau-onlineclothingstore.one.mysql', 'ahzau_onlineclothingstore_one', 'XgZ7rmFE', 'ahzau_onlineclothingstore_one');
	if (mysqli_connect_errno()) {
		printf("Connection failed: %s\n", mysqli_connect_error());
		exit();
	}
	if (isset($_GET['keyword'])){
		$keyword=$_GET['keyword'];
		$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Title LIKE '%$keyword%' LIMIT 5";
	}elseif (isset($_GET['category'])) {
		$category=$_GET['category'];
		if($category == "Featured"){
			$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Featured=1";
		}elseif ($category == "Accessories" || $category == "Kids"){
			$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Category='$category'";
		}elseif ($category == "slideshow"){
			$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Category='$category'";
		}else{
			$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Gender='$category'";
		}
	} else {
		$keyword="";
		$query="SELECT * FROM ocs_items NATURAL JOIN ocs_images WHERE Title LIKE '$keyword%' LIMIT 5";
	}
	

	if (($result=mysqli_query($link, $query)) === false) {
	  	printf("Query failed: %s <br />\n%s", $query, mysqli_error($link));
	  	exit();
	}
	
	$items = '';
	$rowcount=mysqli_num_rows($result);
	$i = 1;
	while ($row=$result->fetch_object()) {
		$element = '{"Id":"'.$row->Id.'", "Name":"'.$row->Title.'", "Price":"'.$row->Price.'", "Gender":"'.$row->Gender.'", "Description":"'.$row->Description.'", "imageUrl":"'.$row->Image_url.'"}';
		if ($i != $rowcount){
			$items .= $element.',';
		}else{
			$items .= $element;
		}
		$i = $i + 1;
	}

	$data='{"data":['.$items.']}';

	print_r($data);
	mysqli_free_result($result);
	header('Access-Control-Allow-Origin: *');
?>