class CreateActors < ActiveRecord::Migration
  def change
    create_table :actors do |t|
      t.references :project
      t.string :actor_singular_name, :limit => 50
      t.string :actor_plural_name, :limit => 50
      t.boolean :use_an_instead_of_a

      t.timestamps
    end
    add_index :actors, :project_id
  end
end
