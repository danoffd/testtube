class AddInviteeIdToProjectUsers < ActiveRecord::Migration
  def change
    add_column :project_users, :invitee_id, :integer
  end
end
