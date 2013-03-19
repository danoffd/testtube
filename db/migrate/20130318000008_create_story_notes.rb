class CreateStoryNotes < ActiveRecord::Migration
  def change
    create_table :story_notes do |t|
      t.integer :user_story_id
      t.text :note
      t.string :note_type
      t.boolean :is_satisfied

      t.timestamps
    end
    add_index :story_notes, :user_story_id
  end
end
