/**
 * Copyright 2014 Red Hat, Inc.
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

angular.element(document).ready(function () {
    angular.bootstrap(document, BASTION_MODULES);
});

BASTION_MODULES = [
    'alchemy',
    'alchemy.format',
    'alch-templates',
    'angular-blocks',
    'ngAnimate',
    'ngSanitize',
    'templates',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'Bastion.activation-keys',
    'Bastion.auth',
    'Bastion.content-views',
    'Bastion.content-views.versions',
    'Bastion.custom-info',
    'Bastion.environments',
    'Bastion.gpg-keys',
    'Bastion.i18n',
    'Bastion.menu',
    'Bastion.capsules',
    'Bastion.organizations',
    'Bastion.products',
    'Bastion.repositories',
    'Bastion.subscriptions',
    'Bastion.sync-plans',
    'Bastion.host-collections',
    'Bastion.content-hosts',
    'Bastion.tasks',
    'Bastion.widgets',
    'Bastion.integration'
];
