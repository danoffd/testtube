class CreateUserStories < ActiveRecord::Migration
  def change
    create_table :user_stories do |t|
      t.integer :project_id
      t.integer :actor_id
      t.integer :story_type_id
      t.integer :parent_user_story_id
      t.string :want_to
      t.string :so_i_can
      t.decimal :doit_loe_hours_calculated, :precision => 10, :scale => 2
      t.decimal :doit_loe_hours_manual, :precision => 10, :scale => 2
      t.integer :fibonacci_estimate
      t.integer :priority
      t.boolean :is_fully_recorded
      t.boolean :is_estimate_final

      t.timestamps
    end
    add_index :user_stories, :project_id
    add_index :user_stories, :actor_id
    add_index :user_stories, :story_type_id
  end
end
