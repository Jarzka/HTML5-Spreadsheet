<?php

namespace org\voimala\exporters;

use PHPExcel;
use PHPExcel_IOFactory;
use Exception;

require_once("Exporter.php");
require_once "libraries/PHPExcel.php";

class ExcelExporter extends Exporter {

    /**  @param $data Data to be exported. Type: JSON String. */
    public function __construct($data) {
        parent::__construct($data);
    }

    public function export() {
        try {
            $this->createExcelFile();
        } catch (Exception $e) {
            echo "Internal server error: unable to create Excel file.";
        }
    }

    private function createExcelFile() {

        // Basic properties for the Excel spreadsheet

        $spreadsheet = new PHPExcel();
        $spreadsheet->getProperties()->setCreator("Voimala.org HTML5 SpreadSheet")
            ->setLastModifiedBy("Voimala.org HTML5 SpreadSheet")
            ->setTitle("Exported HTML5 SpreadSheet");
        $spreadsheet->setActiveSheetIndex(0);

        $activeSheet = $spreadsheet->getActiveSheet();

        // Cell contents

        $dataAsAssociativeArray = json_decode($this->dataToBeExported, true);
        $cells = array_keys($dataAsAssociativeArray);

        foreach ($cells as $cell) {
            $activeSheet->setCellValue($cell, $dataAsAssociativeArray[$cell]);
        }

        // Generate Excel file and download
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="spreadsheet.xlsx"');
        header('Cache-Control: max-age=0');

        $writer = PHPExcel_IOFactory::createWriter($spreadsheet, 'Excel2007');
        $writer->save('php://output');
    }

}