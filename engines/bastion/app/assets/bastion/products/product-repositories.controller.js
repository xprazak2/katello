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
 * @name  Bastion.products.controller:ProductRepositoriesController
 *
 * @requires $scope
 * @requires Repository
 *
 * @description
 *   Provides the functionality for manipulating repositories attached to a product.
 */
angular.module('Bastion.products').controller('ProductRepositoriesController', ['$scope', 'Repository', '$state', '$stateParams',
    function($scope, Repository, $state, $stateParams) {
        if ($stateParams.productId && !$stateParams.id) {
            $scope.repositories = Repository.query({productId: $stateParams.productId});
        } else if ($stateParams.id) {
            $scope.repository = Repository.get({productId: $stateParams.productId, id: $stateParams.id});
        }

        $scope.showRepository = function(repository) {
            $state.transitionTo('products.details.repositories.info', {productId: repository.productId, id: repository.id});
        }
    }
]);
