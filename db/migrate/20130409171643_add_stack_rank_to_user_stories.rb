class AddStackRankToUserStories < ActiveRecord::Migration
  def change
    add_column :user_stories, :stack_rank, :integer
  end
end
