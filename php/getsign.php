<?php
header("Access-Control-Allow-Origin:*");
header("Content-type:text/html;charset-utf-8");
require_once "jssdk.php";
$jssdk = new JSSDK("wxf23f6f8cf7221ee7", "23a2f0722d82259e76ec6f8cdb11c0fe");
$signPackage = $jssdk->GetSignPackage($_POST['url']);
echo json_encode($signPackage);
?>