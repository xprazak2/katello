
#
# Copyright 2014 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Katello
class Distributor < Katello::Model
  self.include_root_in_json = false

  include Hooks
  define_hooks :as_json_hook

  include Glue::Candlepin::Consumer if Katello.config.use_cp
  include Glue if Katello.config.use_cp
  include Glue::ElasticSearch::Distributor if Katello.config.use_elasticsearch
  include Authorization::Distributor
  include AsyncOrchestration

  after_rollback :rollback_on_create, :on => :create

  belongs_to :environment, :class_name => "Katello::KTEnvironment", :inverse_of => :distributors

  has_many :task_statuses, :class_name => "Katello::TaskStatus", :as => :task_owner, :dependent => :destroy
  has_many :custom_info, :class_name => "Katello::CustomInfo", :as => :informable, :dependent => :destroy
  belongs_to :content_view, :inverse_of => :distributors

  validates :environment, :presence => true
  # multiple distributors with a single name are supported
  validates :name, :presence => true, :length => {:maximum => 250}
  validates :location, :length => {:maximum => 255}
  validates_with Validators::UniqueFieldInOrg, :attributes => :name
  validates_with Validators::NoTrailingSpaceValidator, :attributes => :name
  validates_with Validators::KatelloDescriptionFormatValidator, :attributes => :description
  validates_with Validators::ContentViewEnvironmentValidator
  validates_with Validators::KatelloNameFormatValidator, :attributes => :name

  before_create  :fill_defaults

  after_create :init_default_custom_info

  scope :in_environment, lambda { |env| where('environment_id = ?', env) unless env.nil?}
  scope :completer_scope, lambda { |options| readable(options[:organization_id])}

  def organization
    environment.organization
  end

  def consumed_pool_ids
    self.pools.collect {|t| t['id']}
  end

  def available_releases
    self.environment.available_releases
  end

  def consumed_pool_ids=(attributes)
    attribs_to_unsub = consumed_pool_ids - attributes
    attribs_to_unsub.each do |id|
      self.unsubscribe id
    end

    attribs_to_sub = attributes - consumed_pool_ids
    attribs_to_sub.each do |id|
      self.subscribe id
    end
  end

  def filtered_pools
    # No filtering done
    self.available_pools
  end

  def as_json(options)
    json = super(options)
    json['environment'] = environment.as_json unless environment.nil?
    json['content_view'] = content_view.as_json if content_view
    json['version'] = version.as_json if version
    json
  end

  def init_default_custom_info
    self.organization.default_info_hash["distributor"].each do |k|
      self.custom_info.create!(:keyname => k)
    end
  end

  def tasks
    import_candlepin_tasks
    self.task_statuses
  end

  # A rollback occurred while attempting to create the distributor; therefore, perform necessary cleanup.
  def rollback_on_create
    # remove the distributor from elasticsearch
    distributor_id = "id:#{self.id}"
    Tire::Configuration.client.delete "#{Tire::Configuration.url}/katello_distributor/_query?q=#{distributor_id}"
    Tire.index('katello_distributor').refresh
  end

  def self.available_versions(options = {})
    options = {:all => false}.merge(options)
    versions = Resources::Candlepin::CandlepinPing.distributor_versions.sort { |i, j| i["displayName"] <=> j["displayName"] }
    versions = versions.collect { |v| v.slice("name", "displayName") } unless options[:all]
    versions
  end

  def self.latest_version
    available_versions.collect { |v| v["name"] }.select { |n| n =~ (Katello.config.katello? ? /\Asat/ : /\Asam/) }.last
  end

  def version
    facts['distributor_version']
  end

  private

  def save_task_status(pulp_task, task_type, parameters_type, parameters)
    # TODO: remove entirely from distributor model, or need to keep as stub?
  end

  def fill_defaults
    self.description = _("Initial Creation Params") unless self.description
    self.location = _("None") unless self.location
  end

  def collect_custom_info
    hash = {}
    self.custom_info.each { |c| hash[c.keyname] = c.value } if self.custom_info
    hash
  end
end
end
