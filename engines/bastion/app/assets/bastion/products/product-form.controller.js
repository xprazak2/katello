/**
 * Copyright 2013 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
*/

/**
 * @ngdoc object
 * @name  Bastion.products.controller:ProducFormController
 *
 * @requires $scope
 * @requires Product
 * @requires Provider
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality specific to Products for use with the Nutupane UI pattern.
 *   Defines the columns to display and the transform function for how to generate each row
 *   within the table.
 */
angular.module('Bastion.products').controller('ProductFormController',
    ['$scope', 'Product', 'Provider', 'CurrentOrganization',
    function($scope, Product, Provider, CurrentOrganization) {

        fetchProviders();
        $scope.product = $scope.$parent.product || new Product.resource();

        $scope.save = function(product) {
            resetForm();
            $scope.product.$save(success, error);
        };

        function fetchProviders() {
            Provider.query({organization_id: CurrentOrganization}, function() {
                $scope.providers = Provider.records;
            });
        };

        function resetForm() {
            angular.forEach($scope.product, function(value, key) {
                $scope.productForm[key].$setValidity('', true);
            });
        };

        function success(response) {

        };

        function error(response) {
            console.log($scope);
            $scope.productForm.$setDirty();

            angular.forEach(response.data.errors, function(errors, field) {
                $scope.productForm[field].$setValidity('', false);
                $scope.productForm[field].$error.messages = errors;
            });
        };

    }]
);
