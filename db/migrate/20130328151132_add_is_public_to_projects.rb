class AddIsPublicToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :is_public, :boolean
  end
end
