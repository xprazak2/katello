class AddEnvironmentToMedium < ActiveRecord::Migration

  def change
    add_column :media, :kt_environment_id, :integer

    add_index :media, :kt_environment_id, :name => "index_media_on_environment_id"
  end

end
