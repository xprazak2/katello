angular.module('Bastion.integration').controller('JobDetailsHostgroupsController',
    ['$scope', '$q', '$location', 'translate', 'Job', 'Nutupane', 
        function ($scope, $q, $location, translate, Job, Nutupane) {

            $scope.successMessages = [];
            $scope.errorMessages = [];

            params = {
                'search': $location.search().search || "",
                'sort_by': 'name',
                'order': 'ASC' 
            }

            $scope.job = $scope.job || Job.get({id: $scope.$stateParams.jobId}, function () {
                $scope.panel.loading = false;
            })

            
        }
    ]);