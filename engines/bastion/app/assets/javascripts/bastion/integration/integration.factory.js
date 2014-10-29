angular.module('Bastion.integration').factory('Job',
    ['BastionResource', 'CurrentOrganization',
    function (BastionResource, CurrentOrganization) {

        return BastionResource('/integration/api/organizations/:organizationId/jobs/:id/:action',
         {id: '@id', organizationId: CurrentOrganization}, {
          
          update: {method: 'PUT'},
          setContentView: {method: 'PUT', params: {action: 'set_content_view'}},
          setHostgroup: {method: 'PUT', params: {action: 'set_hostgroup'}},
          
        });
    }]
);

angular.module('Bastion.integration').factory('Hostgroup',
    ['BastionResource', 'CurrentOrganization',
    function (BastionResource, CurrentOrganization) {

        return BastionResource('/api/v2/hostgroups/:id/:action',
            {id: '@id', organizationId: CurrentOrganization}, {});
    }]
);