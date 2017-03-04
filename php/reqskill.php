<?php
	header("Access-Control-Allow-Origin:*");
	header("Content-type:text/html;charset-utf-8");
	$db = mysql_connect("bdm266102300.my3w.com", "bdm266102300", "lamento89");
	mysql_query("SET NAMES 'UTF8'");
	
	if($db){
		mysql_select_db("bdm266102300_db",$db);
		$sql = "SELECT * FROM skill";
		$result = mysql_query($sql);
		$arr = array();
		$row = mysql_fetch_row($result);
		$results = array();
		while ($row = mysql_fetch_assoc($result)) {
			$results[] = $row;
		}
		echo json_encode($results);
		mysql_close($db);
	}
?>