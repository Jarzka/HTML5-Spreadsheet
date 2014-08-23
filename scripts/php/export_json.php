<?php

use org\voimala\exporters\JSONExporter;

require_once "src/org/voimala/exporters/JSONExporter.php";

$postData = $_POST["json"];
$exporter = new JSONExporter($postData);
$exporter->export();