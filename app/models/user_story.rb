class UserStory < ActiveRecord::Base
  belongs_to :ProjectModel
  belongs_to :ProjectActor
  belongs_to :ModelStoryType
  has_many :story_comments, :dependent => :destroy, :foreign_key => 'UserStory_id'
  attr_accessible :doit_loe_hours,
    :doit_loe_hours_calculated,
    :fibonacci_estimate,
    :is_estimate_final,
    :is_fully_recorded,
    :priority,
    :so_i_can,
    :want_to,
    :ProjectModel_id,
    :ProjectActor_id,
    :ModelStoryType_id
  
  validates :want_to, 
    :uniqueness => {:message => "the want to clause must be unique", :scope => :ProjectModel_id}
  validates :want_to, :presence => true
  validates :ProjectModel_id, :presence => true
  validates :ProjectActor_id, :presence => true
  validates :ModelStoryType_id, :presence => true
  validates :so_i_can, :presence => true
end
