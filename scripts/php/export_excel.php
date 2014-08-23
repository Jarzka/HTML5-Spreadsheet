<?php

use org\voimala\exporters\ExcelExporter;

require_once "src/org/voimala/exporters/ExcelExporter.php";

$postData = $_POST["json"];
$exporter = new ExcelExporter($postData);
$exporter->export();