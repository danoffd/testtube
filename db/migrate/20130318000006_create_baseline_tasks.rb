class CreateBaselineTasks < ActiveRecord::Migration
  def change
    create_table :baseline_tasks do |t|
      t.integer :story_type_id
      t.string :name
      t.string :description
      t.decimal :small_doit_loe_hours, :precision => 10, :scale => 2
      t.boolean :is_sensitive_to_size
      t.integer :review_team_size

      t.timestamps
    end
    add_index :baseline_tasks, :story_type_id
  end
end
