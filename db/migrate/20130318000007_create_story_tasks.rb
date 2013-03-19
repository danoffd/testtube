class CreateStoryTasks < ActiveRecord::Migration
  def change
    create_table :story_tasks do |t|
      t.integer :baseline_task_id
      t.integer :user_story_id
      t.boolean :is_overridden
      t.string :name
      t.text :description
      t.decimal :doit_loe_hours, :precision => 10, :scale => 2

      t.timestamps
    end
    add_index :story_tasks, :baseline_task_id
    add_index :story_tasks, :user_story_id
  end
end
