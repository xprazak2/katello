#
# Copyright 2013 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

class Api::V2::ApiController < Api::ApiController

  include Api::Version2
  include Api::V2::Rendering
  include Api::V2::ErrorHandling

  # support for session (thread-local) variables must be the last filter in this class
  include Util::ThreadSession::Controller
  include AuthorizationRules

  resource_description do
    api_version 'v2'
  end

  protected

    def labelize_params(params)
      return params[:label] unless params.try(:[], :label).nil?
      return Util::Model::labelize(params[:name]) unless params.try(:[], :name).nil?
    end

    def find_organization
      organization_id = params[:organization_id]
      raise HttpErrors::NotFound, _("One of parameters [%s] required but not specified.") %
          organization_id_keys.join(", ") if organization_id.nil?

      @organization = Organization.without_deleting.having_name_or_label(organization_id).first
      raise HttpErrors::NotFound, _("Couldn't find organization '%s'") % org_id if @organization.nil?

      @organization
    end

    def sort_params
      options = {}
      options[:sort_by] = params[:sort_by] if params[:sort_by]
      options[:sort_order]= params[:sort_order] if params[:sort_order]
      options
    end
end
