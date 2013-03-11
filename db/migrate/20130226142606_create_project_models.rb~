class CreateProjectModels < ActiveRecord::Migration
  def change
    create_table :project_models do |t|
      t.references :Project
      t.string :name
      t.string :description
      t.datetime :start_date
      t.datetime :end_date
      t.decimal :doit_hours_per_day, :precision => 4, :scale => 2

      t.timestamps
    end
    add_index :project_models, :Project_id
  end
end
