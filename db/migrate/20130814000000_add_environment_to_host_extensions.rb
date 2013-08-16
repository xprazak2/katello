class AddEnvironmentToHostExtensions < ActiveRecord::Migration

  def change
    add_column :hosts, :kt_environment_id, :integer

    add_index :hosts, :kt_environment_id, :name => "index_hosts_on_environment_id"
  end

end
