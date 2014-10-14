angular.module('Bastion.integration').controller('JobsController',
    ['$scope', '$location', 'translate', 'Nutupane', 'Job', 'CurrentOrganization', 
        function ($scope, $location, translate, Nutupane, Job, CurrentOrganization) {

            $scope.successMessages = [];
            $scope.errorMessages = [];

            var params = {
                'search': $location.search().search || "",
                'sort_by': 'name',
                'sort_order': 'ASC' 
            }

            var nutupane = new Nutupane(Job, params);
            $scope.jobsTable = nutupane.table;
            $scope.removeRow = nutupane.removeRow;
            $scope.nutupane = nutupane;

            $scope.jobsTable.closeItem = function () {
              $scope.transitionTo('jobs.index');
            };

            nutupane.enableSelectAllResults();

            $scope.table = $scope.jobsTable;



        }]
);