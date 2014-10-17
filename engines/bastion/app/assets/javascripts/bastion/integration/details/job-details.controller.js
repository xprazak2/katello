angular.module('Bastion.integration').controller('JobDetailsController',
    ['$scope', '$state', 'Job', function ($scope, $state, Job) {

        
        $scope.successMessages = [];
        $scope.errorMessages = [];

        if ($scope.job) {
            $scope.panel = {loading: false};
        } else {
            $scope.panel = {loading: true};
        }

        console.log($scope.$stateParams.jobId);        
        $scope.job = Job.get({id: $scope.$stateParams.jobId}, function () {
            $scope.panel.loading = false;
        });

    }]
);