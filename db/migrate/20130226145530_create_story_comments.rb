class CreateStoryComments < ActiveRecord::Migration
  def change
    create_table :story_comments do |t|
      t.references :UserStory
      t.text :comment
      t.string :comment_type
      t.boolean :is_satisfied

      t.timestamps
    end
    add_index :story_comments, :UserStory_id
  end
end
