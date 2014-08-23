"use strict";

app.controller("spreadsheetController", ["$scope", "$parse", "spreadsheetFactory",
    function($scope, $parse, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;

        /** @return If the first character is '=', resolves cell references and returns the outcome without '=' character.
         * Otherwise returns the content as it is.*/
        $scope.resolveCellReferences = function(cellContent) {
            if (cellContent.charAt(0) != '=') {
                return cellContent;
            }

            cellContent = cellContent.replace('=', '');
            var constructFinalCell = cellContent;

            var regex = /[A-Z]\d+/g;
            var matches = cellContent.match(regex);

            if (matches != null) {
                for (var i = 0; i < matches.length; i++) {
                    var cellReference = matches[i];
                    var referencedCellContent = $scope.spreadsheetFactory.cells[cellReference];
                    if (typeof referencedCellContent === "undefined" || referencedCellContent === "") {
                        referencedCellContent = 0;
                    } else {
                        referencedCellContent = $scope.resolveCellReferences(referencedCellContent);
                    }

                    constructFinalCell = constructFinalCell.replace(cellReference , referencedCellContent);
                }
            }

            return constructFinalCell;
        }

        // Efficient, slow
        $scope.computeCellOutput = function(cell) {
            var cellContent = $scope.spreadsheetFactory.cells[cell];

            // Cell is empty?
            if (typeof cellContent === "undefined") {
                return "";
            }

            // If the first character is '=', compute cell output

            var result;
            if (cellContent.charAt(0) == '=') {
                var cellContentReferencesFound = $scope.resolveCellReferences(cellContent);
                var formula = cellContentReferencesFound.substr(cellContentReferencesFound);
                try {
                    result = $parse(formula)($scope);
                }
                catch (e) {
                    result = cellContent;
                }

                if (typeof result === "undefined") {
                    return cellContentReferencesFound;
                } else {
                    return result;
                }
            }

            return cellContent;
        };
    }]);