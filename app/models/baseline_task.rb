class BaselineTask < ActiveRecord::Base
  belongs_to :ModelStoryType
  attr_accessible :description, :is_sensitive_to_size, :name, :review_team_size, :small_doit_loe_hours
  validates :name, 
    :uniqueness => {:message => "name must be unique", :scope => :ModelStoryType_id}
end
