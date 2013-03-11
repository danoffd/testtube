class CreateProjectActors < ActiveRecord::Migration
  def change
    create_table :project_actors do |t|
      t.references :Project
      t.string :actor_singular_name
      t.string :actor_plural_name
      t.boolean :use_an_instead_of_a

      t.timestamps
    end
    add_index :project_actors, :Project_id
  end
end
