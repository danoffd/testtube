class AddIsSatisfiedToNote < ActiveRecord::Migration
  def change
    add_column :notes, :isSatisfied, :boolean
  end
end
