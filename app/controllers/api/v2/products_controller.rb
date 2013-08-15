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


class Api::V2::ProductsController < Api::V2::ApiController

  before_filter :find_provider, :only => [:create]
  before_filter :authorize

  resource_description do
    api_version "v2"
  end

  def_param_group :product do
    param :gpg_key_name, :identifier, :desc => "identifier of the gpg key"
    param :description, String, :desc => "Product description"
  end

  def rules
    create_test = lambda{@provider.nil? ? true : @provider.edtiable?}

    {
      :create => create_test,
      :index => lambda { true }
    }
  end

  def param_rules
    {
      :create => [:name, :label, :description, :gpg_key_name, :recursive]
    }
  end

  api :GET, "/products", "List of products"
  def index
    query_string = params[:name] ? "name:#{params[:name]}" : params[:search]

    options = {
        :load_records? => false
    }
    options[:sort_by] = params[:sort_by] if params[:sort_by]
    options[:sort_order]= params[:sort_order] if params[:sort_order]

    items = Glue::ElasticSearch::Items.new(Product)
    products, total_count = items.retrieve(query_string, params[:offset], options)

    respond_for_index :collection => {:records => products, :subtotal => total_count, :total => items.total_items}
  end

  api :POST, "/products", "Create a product"
  def create
    params[:label] = labelize_params(params)

    product = Product.create!(params)

    respond_for_create :resource => product
  end

  api :GET, "/products/:id", "Show a product"
  param :id, :number, :desc => "product numeric identifier"
  def show
    super
  end

  api :PUT, "/products/:id", "Update a product"
  param :id, :number, :desc => "product numeric identifier"
  param_group :product
  param :product, Hash do
    param :recursive, :bool, :desc => "set to true to recursive update gpg key"
  end
  def update
    super
  end

  api :DELETE, "/products/:id", "Destroy a product"
  param :id, :number, :desc => "product numeric identifier"
  def destroy
    super
  end

  api :GET, "/products/:id/repositories", "List product's repositories"
  param :organization_id, :identifier, :desc => "organization identifier"
  param :environment_id, :identifier, :desc => "environment identifier"
  param :id, :number, :desc => "product numeric identifier"
  param :include_disabled, :bool, :desc => "set to True if you want to list disabled repositories"
  param :name, :identifier, :desc => "repository identifier"
  def repositories
    super
  end

  api :POST, "/products/:id/sync_plan", "Assign sync plan to product"
  param :organization_id, :identifier, :desc => "organization identifier"
  param :id, :number, :desc => "product numeric identifier"
  param :plan_id, :number, :desc => "Plan numeric identifier"
  def set_sync_plan
    super
  end

  api :DELETE, "/products/:id/sync_plan", "Delete assignment sync plan and product"
  param :organization_id, :identifier, :desc => "organization identifier"
  param :id, :number, :desc => "product numeric identifier"
  param :plan_id, :number, :desc => "Plan numeric identifier"
  def remove_sync_plan
    super
  end

  def find_provider
    @provider = Provider.find(params[:provider_id]) if params[:provider_id]
  end

end
