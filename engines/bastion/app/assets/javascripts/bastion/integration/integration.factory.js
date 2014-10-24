angular.module('Bastion.integration').factory('Job',
    ['BastionResource', 'CurrentOrganization',
    function (BastionResource, CurrentOrganization) {

        return BastionResource('/api/organizations/:organizationId/jobs/:id/:action',
         {id: '@id', organizationId: CurrentOrganization}, {
          
          update: {method: 'PUT'},
          setContentView: {method: 'PUT', params: {action: 'set_content_view'}}
          
        });
    }]
);