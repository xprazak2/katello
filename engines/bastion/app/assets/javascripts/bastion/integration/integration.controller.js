angular.module('Bastion.integration').controller('JobsController',
    ['$scope', '$location', 'translate', 'Nutupane', 'Job', 'CurrentOrganization', 
        function ($scope, $location, translate, Nutupane, Job, CurrentOrganization) {

            $scope.successMessages = [];
            $scope.errorMessages = [];

            var nutupane = new Nutupane(Job);
            $scope.jobTable = nutupane.table;
            $scope.nutupane = nutupane;

            $scope.jobTable.closeItem = function () {
              $scope.transitionTo('jobs.index');
            };

        }]
);