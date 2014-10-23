angular.module('Bastion.integration').controller('JobDetailsContentViewsController',
    ['$scope', '$q', '$location','translate', 'Job', 'ContentView', 'Nutupane', 
        function ($scope, $q, $location, translate, Job, ContentView, Nutupane) {

            $scope.successMessages = [];
            $scope.errorMessages = [];

            params = {
                'search': $location.search().search || "",
                'sort_by': 'name',
                'sort_order': 'ASC',
                /*'full_result': true*/
            };

            $scope.job = $scope.job || Job.get({id: $scope.$stateParams.jobId}, function () {
                $scope.panel.loading = false;
            })

            var cvNutupane = new Nutupane(ContentView, params);
            $scope.cvTable = cvNutupane.table;
            $scope.nutupane = cvNutupane;   



            
        }
    ])