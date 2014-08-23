"use strict";

app.controller("menuController", ["$scope", "$http", "spreadsheetFactory",
    function($scope, $http, $spreadsheetFactory) {
        $scope.spreadsheetFactory = $spreadsheetFactory;
        $scope.http = $http;

        /********************************************************************************************
         * File
         * ******************************************************************************************
         */

        $scope.newFile = function() {
            var answer = confirm("Are you sure?");
            if (answer) {
                $scope.spreadsheetFactory.cells = {};
            }
        };

        $scope.open = function() {
            $("#load-file").trigger('click');
        };

        $("#load-file").change(function(e) {
            var file = $("#load-file").get(0).files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var jsonText = reader.result;

                try {
                    var json = JSON.parse(jsonText);
                    $scope.spreadsheetFactory.cells = json;
                    $scope.$apply();
                } catch (e) {
                    alert("The file is not in correct format.");
                }
            };

            reader.readAsText(file, "UTF-8");
        });

        // This method send POST request without using AJAX.
        function sendPostRequestContainingSpreasheetAsJSON(path) {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", path);

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "json");
            hiddenField.setAttribute("value", JSON.stringify($scope.spreadsheetFactory.cells));

            form.appendChild(hiddenField);
            document.body.appendChild(form);
            form.submit();
        }

        $("#save").click(function() {
            sendPostRequestContainingSpreasheetAsJSON("scripts/php/export_json.php");
        });

        $("#export-excel").click(function() {
            sendPostRequestContainingSpreasheetAsJSON("scripts/php/export_excel.php");
        });

        /********************************************************************************************
         * Table
         * ******************************************************************************************
         */

        $scope.addRow = function() {
            // Find the last row and increment
            $scope.spreadsheetFactory.rows.push($scope.spreadsheetFactory.rows[$scope.spreadsheetFactory.rows.length - 1] + 1);
        }

        $scope.removeRow = function() {
            var rowNumberBeRemoved = $scope.spreadsheetFactory.rows.length;

            if ($scope.spreadsheetFactory.rows.length > 1) {
                $scope.spreadsheetFactory.rows.pop();
            }

            // Remove cells
            for (var i = 0; i< $scope.spreadsheetFactory.columns.length; i++) {
                var column = $scope.spreadsheetFactory.columns[i];
                delete $scope.spreadsheetFactory.cells[column + rowNumberBeRemoved];
            }
        }

        /********************************************************************************************
         * Quick Guide
         * ******************************************************************************************
         */

        $scope.quickGuide = function() {
            $(".note-close").css("display", "block");
            $(".note").css("display", "block");
        };

        // Close button funtionality
        $(".note-close").click(function() {
            $(this).css("display", "none");
            $(".note").css("display", "none");
        });
    }]);