<html>
<head>
<title>Raj</title>
</head>
<body>


<?php
	
if( isset($_POST['submit']) ){
			

	$con = mysql_connect("localhost","root","");

	if(!$con){
		die("Cant Connect " . mysql_error());	
	}
	
	mysql_select_db("user",$con);

	$sql = "INSERT INTO data(name,email,message) VALUES('{$_POST['name']}','{$_POST['email']}','{$_POST['message']}') ";

	mysql_query($sql,$con);

	mysql_close($con);

	

}

	

?>


</body>
<html>

