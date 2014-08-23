<?php

namespace org\voimala\exporters;

use Exception;

require_once("Exporter.php");

class JSONExporter extends Exporter {

    /**  @param $data Data to be exported. Type: JSON String. */
    public function __construct($data) {
        parent::__construct($data);
    }

    public function export() {
        header('Content-Disposition: attachment; filename=spreadsheet.json');
        header('Content-Type: application/json');
        echo $this->dataToBeExported;
    }

} 