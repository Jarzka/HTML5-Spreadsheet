<?php

namespace org\voimala\exporters;

abstract class Exporter {

    protected $dataToBeExported;

    public function __construct($data) {
        $this->dataToBeExported = $data;
    }

    public abstract function export();

} 