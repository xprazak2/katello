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


class Api::V2::ProvidersController < Api::V2::ApiController

  before_filter :find_organization, :only => [:index, :create]
  before_filter :authorize

  resource_description do
    api_version "v2"
  end

  def_param_group :provider do
    #param :name, String, :desc => "Provider name", :required => true
  end

  def rules
    index_test  = lambda { true }#lambda { Provider.any_readable?(@organization) }
    create_test = lambda { Provider.creatable?(@organization) }
    read_test   = lambda { @provider.readable? }
    edit_test   = lambda { @provider.editable? }
    delete_test = lambda { @provider.deletable? }

    {
      :index                    => index_test,
      :show                     => index_test,
      :create                   => create_test,
      :update                   => edit_test,
      :destroy                  => delete_test,
      :discovery                => edit_test,
      :products                 => read_test,
      :import_manifest          => edit_test,
      :import_manifest_progress => read_test,
      :refresh_manifest         => edit_test,
      :delete_manifest          => edit_test,
      :import_products          => edit_test,
      :refresh_products         => edit_test,
      :product_create           => edit_test
    }
  end

  def param_rules
    {
      :create => [:name, :organization_id],
      :update => [:name]
    }
  end

  api :GET, "/providers", "List providers"
  def index
    query_string = params[:name] ? "name:#{params[:name]}" : params[:search]

    options = sort_params
    options[:load_records?] = true

    options[:filters] = [
      {:not => {:term => {:provider_type => Provider::REDHAT}}},
      {:term => {:organization_id => @organization.id}}
    ]

    items = Glue::ElasticSearch::Items.new(Provider)
    providers, total_count = items.retrieve(query_string, params[:offset], options)

    respond_for_index :collection => {:records => providers, :subtotal => total_count, :total => items.total_items}
  end

  api :POST, "/providers", "Create a provider"
  param_group :provider
  def create
    provider = Provider.create!(params) do |p|
      p.organization  = @organization
      p.provider_type ||= Provider::CUSTOM
    end
    respond_for_create :resource => provider
  end

  api :DELETE, "/providers/:id", "Destroy a provider"
  param :id, :number, :desc => "Provider numeric identifier", :required => true
  def destroy
    #
    # TODO: these should really be done as validations, but the orchestration engine currently converts them into OrchestrationExceptions
    #
    raise HttpErrors::BadRequest, _("Provider cannot be deleted since one of its products or repositories has already been promoted. Using a changeset, please delete the repository from existing environments before deleting it.") if @provider.repositories.any? { |r| r.promoted? }

    @provider.destroy
    respond
  end

  api :PUT, "/providers/:id/refresh_products", "Refresh products for Red Hat provider"
  param :id, :number, :desc => "Provider numeric identifier", :required => true
  def refresh_products
    super
  end

  private

    def find_provider
      @provider = Provider.find(params[:id])
      @organization ||= @provider.organization
      raise HttpErrors::NotFound, _("Couldn't find provider '%s'") % params[:id] if @provider.nil?
    end

end
