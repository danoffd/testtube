class CreateModelStoryTypes < ActiveRecord::Migration
  def change
    create_table :model_story_types do |t|
      t.references :ProjectModel
      t.string :story_type_name

      t.timestamps
    end
    add_index :model_story_types, :ProjectModel_id
  end
end
