class CreateUserStories < ActiveRecord::Migration
  def change
    create_table :user_stories do |t|
      t.references :ProjectModel
      t.references :ProjectActor
      t.references :ModelStoryType
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
    add_index :user_stories, :ProjectModel_id
    add_index :user_stories, :ProjectActor_id
    add_index :user_stories, :ModelStoryType_id
  end
end
