class CreateStoryTypes < ActiveRecord::Migration
  def change
    create_table :story_types do |t|
      t.integer :project_id
      t.string :story_type_name

      t.timestamps
    end
    add_index :story_types, :project_id
  end
end
